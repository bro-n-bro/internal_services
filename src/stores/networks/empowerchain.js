const network = {
    name: 'EmpowerChain',
    lcd_api: 'https://lcd.empowerchain-1.bronbro.io',
    rpc_api: 'https://rpc.empowerchain-1.bronbro.io',

    images: [{
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/empowerchain/images/mpwr.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/empowerchain/images/mpwr.svg"
    }],

    denom: 'umpwr',
    token_name: 'MPWR',
    chainId: 'empowerchain-1',
    prefix: 'empower',
    alias: 'empower',
    exponent: 6
}

export default network