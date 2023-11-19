let profile = {
    manufacturer: {
        "cryptoPath": "/organizations/peerOrganizations/manufacturer.auto.com",
        "keyDirectoryPath": "/organizations/peerOrganizations/manufacturer.auto.com/users/User1@manufacturer.auto.com/msp/keystore",
        "certPath": "/organizations/peerOrganizations/manufacturer.auto.com/users/User1@manufacturer.auto.com/msp/signcerts/cert.pem",
        "tlsCertPath": "/organizations/peerOrganizations/manufacturer.auto.com/tlsca/tlsca.manufacturer.auto.com-cert.pem",
        "peerEndpoint": "peer0-manufacturer:7051",
        "peerHostAlias": "peer0.manufacturer.auto.com",
        "mspId": "ManufacturerMSP"
    },
    dealer: {
        "cryptoPath": "/organizations/peerOrganizations/dealer.auto.com",
        "keyDirectoryPath": "/organizations/peerOrganizations/dealer.auto.com/users/User1@dealer.auto.com/msp/keystore",
        "certPath": "/organizations/peerOrganizations/dealer.auto.com/users/User1@dealer.auto.com/msp/signcerts/cert.pem",
        "tlsCertPath": "/organizations/peerOrganizations/dealer.auto.com/tlsca/tlsca.dealer.auto.com-cert.pem",
        "peerEndpoint": "peer0-dealer:7051",
        "peerHostAlias": "peer0.dealer.auto.com",
        "mspId": "DealerMSP"
    },
    mvd: {
        "cryptoPath": "/organizations/peerOrganizations/mvd.auto.com",
        "keyDirectoryPath": "/organizations/peerOrganizations/mvd.auto.com/users/User1@mvd.auto.com/msp/keystore",
        "certPath": "/organizations/peerOrganizations/mvd.auto.com/users/User1@mvd.auto.com/msp/signcerts/cert.pem",
        "tlsCertPath": "/organizations/peerOrganizations/mvd.auto.com/tlsca/tlsca.mvd.auto.com-cert.pem",
        "peerEndpoint": "peer0-mvd:7051",
        "peerHostAlias": "peer0.mvd.auto.com",
        "mspId": "MvdMSP"
    }
}
module.exports = { profile }
