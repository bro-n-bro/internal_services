import { defineStore } from 'pinia'
import { createKeplrOfflineSinger, denomTraces } from '@/utils'
import { SigningStargateClient } from '@cosmjs/stargate'
import { assets } from 'chain-registry'
import { getPriceByDenom, formatTokenAmount } from '@/utils'

// Networks
import cosmoshub from '@/stores/networks/cosmoshub'
import osmosis from '@/stores/networks/osmosis'
import bostrom from '@/stores/networks/bostrom'

const networks = {
    cosmoshub,
    osmosis,
    bostrom
}


export const useGlobalStore = defineStore('global', {
    state: () => ({
        currentNetwork: 'cosmoshub',

        Keplr: {},
        stargateClient: {},
        isKeplrConnected: false,

        prices: [],
        balances: [],

        networks,

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


        // Get IBS commands
        async GetIBSCommands() {
            let result = []

            try {
                await fetch('http://93.159.130.7:8000')
                    .then(response => response.json())
                    .then(data => result = data.available_commands)
            } catch (error) {
                console.error(error)
            }

            return result
        },


        // Init APP
        async initApp() {
            if (window.keplr) {
                // Keplr connect
                await createKeplrOfflineSinger(this.networks[this.currentNetwork].chainId)

                // Stargate client
                this.stargateClient = await SigningStargateClient.connectWithSigner(this.networks[this.currentNetwork].rpc_api, this.Keplr.offlineSinger)

                // Get currencies price
                await this.getCurrenciesPrice()

                // Get balances
                await this.getBalances()
            }
        },


        // Get balances
        async getBalances() {
            // Request
            this.balances = await this.stargateClient.getAllBalances(this.Keplr.account.address)

            // try {
            //     // Request
            //     await fetch(`${this.networks[this.currentNetwork].lcd_api}/cosmos/bank/v1beta1/balances/${this.Keplr.account.address}`)
            //         .then(response => response.json())
            //         .then(async response => this.balances = response.balances)
            // } catch (error) {
            //     console.error(error)
            // }

            // Get balance info
            for (const balance of this.balances) {
                let denomTracesResult = await denomTraces(balance.denom)

                if (!denomTracesResult.ingnoreTraces) {
                    assets.forEach(chain => {
                        // Get denom info
                        let denomInfo = chain.assets.find(token => token.base === denomTracesResult.base_denom)

                        if (denomInfo) {
                            // Set info
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
                        let chainInfo = assets.find(({chain_name}) => chain_name === this.networks[this.currentNetwork].alias)

                        // Get denom info
                        let denomInfo = chainInfo.assets.find(({base}) => base === balance.denom)

                        // Set info
                        balance.base_denom = denomTracesResult.base_denom
                        balance.symbol = denomInfo.symbol

                        // Format token exponent
                        let formatableToken = this.formatableTokens.find(el => el.tokenName == denomInfo.symbol.toUpperCase())

                        // Set exponent for denom
                        formatableToken
                            ? balance.exponent = formatableToken.exponent
                            : balance.exponent = denomInfo.denom_units.find(el => el.denom == denomTracesResult.base_denom).exponent
                    } catch (error) {
                        console.error(error)
                    }
                }

                // Get prices
                balance.price = getPriceByDenom(balance.symbol)
                balance.cost = formatTokenAmount(balance.amount, balance.base_denom) * balance.price
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
    }
})
