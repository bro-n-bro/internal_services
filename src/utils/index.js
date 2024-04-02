import { useGlobalStore } from '@/stores'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { SigningStargateClient } from '@cosmjs/stargate'
import { fromBech32, toBech32 } from '@cosmjs/encoding'


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
        result.base_denom = hash[2]
    } else {
        result.base_denom = string
    }

    return result
}


// Get base denom
export const getBaseDenom = denom => {
    if (denom) {
        let store = useGlobalStore(),
            result = store.balances.find(el => el.denom == denom)

        return result.base_denom
    }
}


// Get best denom
export const getBestDenom = denom => {
    if (denom) {
        let store = useGlobalStore(),
            result = store.balances.find(el => el.denom == denom)

        return result.best_denom
    }
}


// Formating token name
export const formatTokenName = tokenName => {
    if (tokenName) {
        let store = useGlobalStore(),
            newTokenName = ''

        if (store.formatableTokens.find(el => el.tokenName == tokenName.toUpperCase())) {
            newTokenName = store.formatableTokens.find(el => el.tokenName == tokenName.toUpperCase()).formatTokenName
        }

        return newTokenName.length ? newTokenName : tokenName
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

    // Get Keplr network enable
    await window.keplr.enable(chainId)

    // Set Offline Singer
    store.Keplr.offlineSinger = await window.getOfflineSignerAuto(chainId)

    // Set Keplr account
    let accounts = await store.Keplr.offlineSinger.getAccounts()
    store.Keplr.account = accounts[0]

    // Set Keplr key~
    store.Keplr.key = await window.keplr.getKey(chainId)

    // Set Keplr connected status
    store.isKeplrConnected = true
}



// Prepare Tx
export const prepareTx = async (msg, gasSimulate, chain) => {
    let store = useGlobalStore(),
        gasUsed = 0

    // Create request
    let offlineSigner = await window.getOfflineSignerAuto(store.networks[chain].chainId)

    Object.assign(offlineSigner, {
        signAmino: offlineSigner.signAmino ?? offlineSigner.sign
    })

    // RPC endpoint
    let rpcEndpoint = store.networks[chain].rpc_api

    // Client
    let client = await SigningStargateClient.connectWithSigner(rpcEndpoint, offlineSigner)

    // Simulate gas
    if (gasSimulate) {
        gasUsed = await client.simulate(store.Keplr.account.address, msg)
    }

    let fee = {
        amount: [{
            denom: store.networks[chain].denom,
            amount: '0'
        }],
        gas: gasSimulate ? Math.round(gasUsed * 1.3).toString() : '1000000'
    }

    // MENO
    let memo = 'bro.multisend'

    // Sign transaction
    let txRaw = await client.sign(store.Keplr.account.address, msg, fee, memo)

    return { txRaw, client }
}



// Send Tx
export const sendTx = async ({ txRaw, client }) => {
    // Encode TxRaw
    let txBytes = TxRaw.encode(txRaw).finish()

    // Broadcast Tx
    let result = await client.broadcastTx(txBytes, client.broadcastTimeoutMs, client.broadcastPollIntervalMs)

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
        price = 0,
        item = store.prices.find(el => el.symbol == denom.toUpperCase())

    if (item) {
        price = item.price
    }

    return price
}