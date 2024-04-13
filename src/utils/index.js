import { useGlobalStore } from '@/stores'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { GasPrice, SigningStargateClient } from '@cosmjs/stargate'
import { fromBech32, toBech32 } from '@cosmjs/encoding'
import { Decimal } from '@cosmjs/math'


// Generate address
export const generateAddress = (prefix, address) => {
    return toBech32(prefix, fromBech32(address).data)
}


// Denom traces
export const denomTraces = async string => {
    let store = useGlobalStore(),
        result = {},
        hash = string.split('/')

    if (hash[0] == 'ibc') {
        try {
            // Request
            await fetch(`${store.networks[store.currentNetwork].lcd_api}/ibc/apps/transfer/v1/denom_traces/${hash[1]}`)
                .then(response => response.json())
                .then(response => result = response.denom_trace)
        } catch (error) {
            console.error(error)
        }
    } else if (hash[0] == 'factory') {
        result.ingnoreTraces = true
        result.base_denom = hash[hash.length - 1]
    } else {
        result.base_denom = string
    }

    return result
}


// Formating token name
export const formatTokenName = tokenName => {
    if (tokenName) {
        let store = useGlobalStore(),
            newTokenName = '',
            symbol = store.balances.find(el => el.denom == tokenName).symbol

        if (store.formatableTokens.find(el => el.tokenName == symbol.toUpperCase())) {
            newTokenName = store.formatableTokens.find(el => el.tokenName == symbol.toUpperCase()).formatTokenName
        }

        return newTokenName.length ? newTokenName : symbol
    }
}


// Formating token amount
export const formatTokenAmount = (amount, tokenName) => {
    let store = useGlobalStore(),
        formatAmount = amount / Math.pow(10, store.balances.find(el => el.base_denom == tokenName).exponent)

    return formatAmount
}


// Create Keplr offline singer
export const createKeplrOfflineSinger = async chainId => {
    let store = useGlobalStore()

    window.keplr.defaultOptions = {
        sign: {
            preferNoSetFee: true
        }
    }

    // Get Keplr network enable
    await window.keplr.enable(chainId)

    // Set Offline Singer
    store.Keplr.offlineSinger = await window.getOfflineSignerAuto(chainId)

    Object.assign(store.Keplr.offlineSinger, {
        signAmino: store.Keplr.offlineSinger.signAmino ?? store.Keplr.offlineSinger.sign
    })

    // Set Keplr account
    let accounts = await store.Keplr.offlineSinger.getAccounts()
    store.Keplr.account = accounts[0]

    // Set Keplr key
    store.Keplr.key = await window.keplr.getKey(chainId)

    // Set Keplr connected status
    store.isKeplrConnected = true
}



// Send Tx
export const sendTx = async (msg, chain) => {
    let store = useGlobalStore()

    // Create signer
    let offlineSigner = await window.getOfflineSignerAuto(store.networks[chain].chainId)

    Object.assign(offlineSigner, {
        signAmino: offlineSigner.signAmino ?? offlineSigner.sign
    })

    // RPC endpoint
    let rpcEndpoint = store.networks[chain].rpc_api

    // Fee currencies
    let chainInfos = await window.keplr.getChainInfosWithoutEndpoints(),
        chainInfo = chainInfos.find(item => item.chainId === store.networks[chain].chainId),
        feeCurrencies = chainInfo.feeCurrencies[0]

    // Gas price
    let gasPrice = new GasPrice(Decimal.fromUserInput(feeCurrencies.gasPriceStep?.average.toString() || '0', 3), feeCurrencies?.coinMinimalDenom)

    // Client
    let client = await SigningStargateClient.connectWithSigner(rpcEndpoint, offlineSigner, {
        gasPrice
    })

    // MENO
    let memo = 'bro.multisend'

    // Sign transaction
    let result = await client.signAndBroadcast(store.Keplr.account.address, msg, 'auto', memo)

    return result
}



// Get metwork logo
export const getNetworkLogo = alias => {
    return require(`@/assets/${alias}_logo.png`)
}


// Find closest substring in array
export function findClosestSubstringInArray(targetString, array) {
    let closestMatch = null,
        minDistance = Infinity

    for (const str of array) {
        const distance = levenshteinDistance(str.toLowerCase(), targetString.toLowerCase())

        if (Math.abs(str.length - targetString.length) === 1) {
            for (let i = 0; i < Math.min(str.length, targetString.length); i++) {
                if (str[i] !== targetString[i]) {
                    const slicedTarget = targetString.slice(0, i) + targetString.slice(i + 1)

                    if (str === slicedTarget) {
                        closestMatch = str
                        minDistance = distance

                        break;
                    }
                }
            }
        }

        if (distance < minDistance) {
            closestMatch = str
            minDistance = distance
        }
    }

    return closestMatch
}



// Levenshtein distance
function levenshteinDistance(s1, s2) {
    const len1 = s1.length,
        len2 = s2.length

    const matrix = []

     for (let i = 0; i <= len1; i++) {
        matrix[i] = [i]
    }

    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j
    }

    for (let j = 1; j <= len2; j++) {
        for (let i = 1; i <= len1; i++) {
            if (s1[i - 1] === s2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1]
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                )
            }
        }
    }

    return matrix[len1][len2]
}



// Get price by denom
export const getPriceByDenom = denom => {
    let store = useGlobalStore(),
        price = 0

    if (denom) {
        let item = store.prices.find(el => el.symbol == denom.toUpperCase())

        if (item) {
            price = item.price
        }
    }

    return price
}