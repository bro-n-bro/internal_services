import { defineStore } from 'pinia'
import { createKeplrOfflineSinger, denomTraces, findClosestSubstringInArray } from '@/utils'
import { SigningStargateClient } from '@cosmjs/stargate'
import { assets } from 'chain-registry'

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
            // this.balances = await this.stargateClient.getAllBalances(this.Keplr.account.address)

            try {
                // Request
                await fetch(`${this.networks[this.currentNetwork].lcd_api}/cosmos/bank/v1beta1/balances/${this.Keplr.account.address}`)
                    .then(response => response.json())
                    .then(async response => this.balances = response.balances)
            } catch (error) {
                console.error(error)
            }

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
                    // Get denom info by skychart
                    try {
                        // Request
                        let denomInfo = await fetch(`https://skychart.bronbro.io/v1/asset/${denomTracesResult.base_denom}`)
                            .then(response => response.json())

                        // Set info
                        balance.base_denom = denomInfo.base_denom
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
            }

            // Clear balances
            this.balances = this.balances.filter(obj => obj.hasOwnProperty('exponent'))
        },
    }
})
