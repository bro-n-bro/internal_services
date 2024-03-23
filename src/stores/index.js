import { defineStore } from 'pinia'
import { createKeplrOfflineSinger, denomTraces, findClosestSubstringInArray } from '@/utils'

// Networks
import cosmoshub from '@/stores/networks/cosmoshub'

const networks = {
    cosmoshub
}


export const useGlobalStore = defineStore('global', {
    state: () => ({
        currentNetwork: 'cosmoshub',

        Keplr: {},
        isKeplrConnected: false,

        balances: [],
        skyChartAssets: [],

        networks,

        prices: null,

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
            }
        ],
    }),


    actions: {
        // Get skychart assets
        async getSkyChartAssets() {
            try {
                // Request
                await fetch('https://skychart.bronbro.io/v1/assets')
                    .then(response => response.json())
                    .then(data => this.skyChartAssets = data)
            } catch (error) {
                console.error(error)
            }
        },

        // Get exponents
        async getExponents() {
            try {
                // Get skychart assets
                await this.getSkyChartAssets()

                this.balances.forEach(async balance => {
                    // Find best denom name
                    balance.best_denom = findClosestSubstringInArray(balance.base_denom, this.skyChartAssets)

                    // Get denom info
                    try {
                        // Request
                        let denomInfo = await fetch(`https://skychart.bronbro.io/v1/asset/${balance.best_denom}`)
                            .then(response => response.json())

                        // Get exponent
                        let result = denomInfo.denom_units.find(el => el.denom == balance.best_denom)

                        // Format token exponent
                        let formatableToken = this.formatableTokens.find(el => el.tokenName == balance.best_denom.toUpperCase())

                        // Set exponent for denom
                        formatableToken
                            ? balance.exponent = formatableToken.exponent
                            : balance.exponent = result.exponent
                    } catch (error) {
                        console.error(error)
                    }
                })
            } catch (error) {
                console.error(error)
            }
        },


        // Init APP
        async initApp() {
            if (window.keplr) {
                // Keplr connect
                await createKeplrOfflineSinger(this.networks[this.currentNetwork].chainId)

                // Get network balance
                await this.getNetworkBalance()

                // Get formated balances
                for (const balance of this.balances) {
                    let result = await denomTraces(balance.denom)

                    balance.base_denom = result.base_denom
                }

                // Get exponents
                await this.getExponents()
            }
        },


        // Get network balance
        async getNetworkBalance() {
            try {
                // Request
                await fetch(`${this.networks[this.currentNetwork].lcd_api}/cosmos/bank/v1beta1/balances/${this.Keplr.account.address}`)
                    .then(response => response.json())
                    .then(async response => this.balances = response.balances)
            } catch (error) {
                console.error(error)
            }
        },
    }
})
