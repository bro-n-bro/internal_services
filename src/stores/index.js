import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { createKeplrOfflineSinger, denomTraces } from '@/utils'
import { SigningStargateClient } from '@cosmjs/stargate'
import { assets, chains } from 'chain-registry'
import { getPriceByDenom, formatTokenAmount } from '@/utils'

// Networks
import cosmoshub from '@/stores/networks/cosmoshub'
import osmosis from '@/stores/networks/osmosis'
import bostrom from '@/stores/networks/bostrom'
import gravitybridge from '@/stores/networks/gravitybridge'
import juno from '@/stores/networks/juno'
import omniflixhub from '@/stores/networks/omniflixhub'
import stargaze from '@/stores/networks/stargaze'
import stride from '@/stores/networks/stride'
import desmos from '@/stores/networks/desmos'
import agoric from '@/stores/networks/agoric'
import bandchain from '@/stores/networks/bandchain'
import celestia from '@/stores/networks/celestia'
import composable from '@/stores/networks/composable'
import dymension from '@/stores/networks/dymension'
import empowerchain from '@/stores/networks/empowerchain'
import neutron from '@/stores/networks/neutron'
import qwoyn from '@/stores/networks/qwoyn'
import saga from '@/stores/networks/saga'
import seda from '@/stores/networks/seda'
import evmos from '@/stores/networks/evmos'
import space_pussy from '@/stores/networks/space_pussy'


const allNetworks = {
    cosmoshub,
    osmosis,
    bostrom,
    gravitybridge,
    juno,
    omniflixhub,
    stargaze,
    stride,
    desmos,
    agoric,
    bandchain,
    celestia,
    composable,
    dymension,
    empowerchain,
    neutron,
    qwoyn,
    saga,
    seda,
    evmos
}


export const useGlobalStore = defineStore('global', {
    state: () => ({
        currentService: '',

        Keplr: {},
        stargateClient: {},
        isKeplrConnected: false,

        prices: [],
        balances: [],

        networks: {
            global: allNetworks,

            multisend: allNetworks,

            IBC: allNetworks,

            ibc_recovery: {
                space_pussy
            }
        },

        socket: {},
        commands: {},

        multisendCurrentNetwork: '',
        multisendFavorites: useLocalStorage('multisendFavorites', {}),

        IBCRecoveryCurrentNetwork: '',
        IBCRecoveryFavorites: useLocalStorage('IBCRecoveryFavorites', {}),

        IBCRouteCurrentNetwork: '',
        IBCRouteFavorites: useLocalStorage('IBCRouteFavorites', {}),

        formatableTokens: [
            {
                tokenName: 'BOOT',
                formatTokenName: 'MBOOT',
                exponent: 6
            },
            {
                tokenName: 'HYDROGEN',
                formatTokenName: 'MHYDROGEN',
                exponent: 6
            },
            {
                tokenName: 'TOCYB',
                formatTokenName: 'MTOCYB',
                exponent: 6
            }
        ],
    }),


    actions: {
        // Currencies price
        async getCurrenciesPrice() {
            try {
                await fetch('https://rpc.bronbro.io/price_feed_api/tokens/')
                    .then(response => response.json())
                    .then(data => this.prices = data)
            } catch (error) {
                console.error(error)
            }
        },


        // Get IBC Recovery commands
        async GetIBCRecoveryCommands() {
            let result = []

            try {
                await fetch('https://rly.bronbro.io')
                    .then(response => response.json())
                    .then(data => result = data.available_commands)
            } catch (error) {
                console.error(error)
            }

            return result
        },


        // Init APP
        async initApp(currentNetwork) {
            if (window.keplr) {
                // Keplr connect
                await createKeplrOfflineSinger(this.networks.global[currentNetwork].chainId)

                // Stargate client
                this.stargateClient = await SigningStargateClient.connectWithSigner(this.networks.global[currentNetwork].rpc_api, this.Keplr.offlineSinger)

                // Get currencies price
                await this.getCurrenciesPrice()

                // Get balances
                await this.getBalances(currentNetwork)
            }
        },


        // Get balances
        async getBalances(currentNetwork) {
            // Request
            this.balances = await this.stargateClient.getAllBalances(this.Keplr.account.address)

            // try {
            //     // Request
            //     await fetch(`${this.networks.global[this.currentNetwork].lcd_api}/cosmos/bank/v1beta1/balances/bostrom1ke7kxdn29w2lrxt9dzusa6shvmwd8xm9gxm2zf`)
            //         .then(response => response.json())
            //         .then(async response => this.balances = response.balances)
            // } catch (error) {
            //     console.error(error)
            // }

            // Get balance info
            for (const balance of this.balances) {
                // Denom traces
                balance.denom_traces = await denomTraces(balance.denom, currentNetwork)

                if (!balance.denom_traces.ingnoreTraces) {
                    assets.forEach(chain => {
                        // Get denom info
                        let denomInfo = chain.assets.find(token => token.base === balance.denom_traces.base_denom)

                        if (denomInfo) {
                            // Get chain info
                            // let chainInfo = chains.find(chain => chain.pretty_name === denomInfo.name)

                            // Set info
                            // balance.chain_id = chainInfo ? chainInfo.chain_id : null
                            balance.base_denom = denomInfo.base
                            balance.symbol = denomInfo.symbol

                            // Format denom exponent
                            let formatableToken = this.formatableTokens.find(el => el.tokenName == denomInfo.base.toUpperCase())

                            // Set exponent for denom
                            formatableToken
                                ? balance.exponent = formatableToken.exponent
                                : balance.exponent = denomInfo.denom_units[1]?.exponent || 0
                        }
                    })
                } else {
                    // Get denom info by chain-registry assets
                    try {
                        // Get chain info
                        let chainInfo = assets.find(({chain_name}) => chain_name === this.networks.global[currentNetwork].alias)

                        // Get denom info
                        let denomInfo = chainInfo.assets.find(({base}) => base === balance.denom)

                        // Set info
                        balance.base_denom = balance.denom_traces.base_denom
                        balance.symbol = denomInfo.symbol

                        // Format token exponent
                        let formatableToken = this.formatableTokens.find(el => el.tokenName == denomInfo.symbol.toUpperCase())

                        // Set exponent for denom
                        formatableToken
                            ? balance.exponent = formatableToken.exponent
                            : balance.exponent = denomInfo.denom_units.find(el => el.denom == balance.denom_traces.base_denom).exponent
                    } catch (error) {
                        console.error(error)
                    }
                }

                // Get prices
                balance.price = getPriceByDenom(balance.symbol)

                // Calc cost
                let formatableToken = this.formatableTokens.find(el => el.tokenName == balance.symbol)

                formatableToken
                    ? balance.cost = balance.amount * balance.price
                    : balance.cost = formatTokenAmount(balance.amount, balance.base_denom) * balance.price
            }

            // Clear balances
            this.balances = this.balances.filter(obj => obj.hasOwnProperty('exponent'))

            // Sort by "cost"
            this.balances.sort((a, b) => {
                if (a.cost > b.cost) { return -1 }
                if (a.cost < b.cost) { return 1 }
                return 0
            })
        },


        // Init WebSockets
        initWebSockets() {
            this.socket = new WebSocket('wss://rly.bronbro.io/ws')
        },
    }
})
