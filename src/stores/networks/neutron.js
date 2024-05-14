const network = {
    name: 'Neutron',
    lcd_api: 'https://lcd.neutron.bronbro.io',
    rpc_api: 'https://rpc.neutron.bronbro.io',

    images: [{
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.svg"
    }],

    denom: 'untrn',
    token_name: 'NTRN',
    chainId: 'neutron-1',
    prefix: 'neutron',
    alias: 'neutron',
    exponent: 6
}

export default network