import { useGlobalStore } from '@/stores'
import { GasPrice, SigningStargateClient } from '@cosmjs/stargate'
import { fromBech32, toBech32 } from '@cosmjs/encoding'
import { Decimal } from '@cosmjs/math'
import { chains } from 'chain-registry'


// Generate address
export const generateAddress = (prefix, address) => {
    return toBech32(prefix, fromBech32(address).data)
}


// Denom traces
export const denomTraces = async (string, currentNetwork) => {
    let store = useGlobalStore(),
        result = {
            path: null,
            base_denom: string
        },
        hash = string.split('/')

    if (hash[0] == 'ibc') {
        try {
            // Request
            await fetch(`${store.networks.global[currentNetwork].lcd_api}/ibc/apps/transfer/v1/denom_traces/${hash[1]}`)
                .then(response => response.json())
                .then(response => result = response.denom_trace)
        } catch (error) {
            console.error(error)
        }
    } else if (hash[0] == 'factory') {
        result.ingnoreTraces = true
        result.base_denom = hash[hash.length - 1]
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

    // RPC endpoint
    let rpcEndpoint = store.networks.multisend[chain].rpc_api

    // Fee currencies
    let chainInfos = await window.keplr.getChainInfosWithoutEndpoints(),
        chainInfo = chainInfos.find(item => item.chainId === store.networks.multisend[chain].chainId),
        feeCurrencies = chainInfo.feeCurrencies[0]

    // Gas price
    let gasPrice = new GasPrice(Decimal.fromUserInput(feeCurrencies.gasPriceStep?.average.toString() || '0', 3), feeCurrencies?.coinMinimalDenom)

    // Client
    let client = await SigningStargateClient.connectWithSigner(rpcEndpoint, store.Keplr.offlineSinger, {
        gasPrice
    })

    // MENO
    let memo = 'bro.multisend'

    // Sign transaction
    let result = await client.signAndBroadcast(store.Keplr.account.address, msg, 'auto', memo)

    return result
}



// Get metwork logo
export const getNetworkLogo = chainId => {
    let store = useGlobalStore(),
        logos = null

    if (chainId) {
        if (chainId === 'space-pussy') {
            logos = store.networks.ibc_recovery.space_pussy.images
        } else {
            let chain = chains.find(el => el.chain_id === chainId),
                storeNetwork = chain ? store.networks.global[chain.chain_name] : null

            storeNetwork && storeNetwork.images
                ? logos = storeNetwork.images
                : logos = chain.images
        }

        return logos[logos.length - 1].svg ? logos[logos.length - 1].svg : logos[logos.length - 1].png
    }
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