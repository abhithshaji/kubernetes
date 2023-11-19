let profile = {
    sro: {
        "cryptoPath": "/organizations/peerOrganizations/sro.land.com",
        "keyDirectoryPath": "/organizations/peerOrganizations/sro.land.com/users/User1@sro.land.com/msp/keystore",
        "certPath": "/organizations/peerOrganizations/sro.land.com/users/User1@sro.land.com/msp/signcerts/cert.pem",
        "tlsCertPath": "/organizations/peerOrganizations/sro.land.com/tlsca/tlsca.sro.land.com-cert.pem",
        "peerEndpoint": "peer0-sro:7051",
        "peerHostAlias": "peer0.sro.land.com",
        "mspId": "SroMSP"
    },
    bank: {
        "cryptoPath": "/organizations/peerOrganizations/bank.land.com",
        "keyDirectoryPath": "/organizations/peerOrganizations/bank.land.com/users/User1@bank.land.com/msp/keystore",
        "certPath": "/organizations/peerOrganizations/bank.land.com/users/User1@bank.land.com/msp/signcerts/cert.pem",
        "tlsCertPath": "/organizations/peerOrganizations/bank.land.com/tlsca/tlsca.bank.land.com-cert.pem",
        "peerEndpoint": "peer0-bank:7051",
        "peerHostAlias": "peer0.bank.land.com",
        "mspId": "BankMSP"
    },
    revenue: {
        "cryptoPath": "/organizations/peerOrganizations/revenue.land.com",
        "keyDirectoryPath": "/organizations/peerOrganizations/revenue.land.com/users/User1@revenue.land.com/msp/keystore",
        "certPath": "/organizations/peerOrganizations/revenue.land.com/users/User1@revenue.land.com/msp/signcerts/cert.pem",
        "tlsCertPath": "/organizations/peerOrganizations/revenue.land.com/tlsca/tlsca.revenue.land.com-cert.pem",
        "peerEndpoint": "peer0-revenue:7051",
        "peerHostAlias": "peer0.revenue.land.com",
        "mspId": "RevenueMSP"
    }
}
module.exports = { profile }
