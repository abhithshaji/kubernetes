set -x

mkdir -p /organizations/peerOrganizations/manufacturer.auto.com/

export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/manufacturer.auto.com/



fabric-ca-client enroll -u https://admin:adminpw@ca-manufacturer:7054 --caname ca-manufacturer --tls.certfiles "/organizations/fabric-ca/manufacturer/tls-cert.pem"



echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-manufacturer-7054-ca-manufacturer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-manufacturer-7054-ca-manufacturer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-manufacturer-7054-ca-manufacturer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-manufacturer-7054-ca-manufacturer.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/manufacturer.auto.com/msp/config.yaml"



fabric-ca-client register --caname ca-manufacturer --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/manufacturer/tls-cert.pem"



fabric-ca-client register --caname ca-manufacturer --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/manufacturer/tls-cert.pem"




fabric-ca-client register --caname ca-manufacturer --id.name manufactureradmin --id.secret manufactureradminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/manufacturer/tls-cert.pem"



fabric-ca-client enroll -u https://peer0:peer0pw@ca-manufacturer:7054 --caname ca-manufacturer -M "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/msp" --csr.hosts peer0.manufacturer.auto.com --csr.hosts  peer0-manufacturer --tls.certfiles "/organizations/fabric-ca/manufacturer/tls-cert.pem"



cp "/organizations/peerOrganizations/manufacturer.auto.com/msp/config.yaml" "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/msp/config.yaml"



fabric-ca-client enroll -u https://peer0:peer0pw@ca-manufacturer:7054 --caname ca-manufacturer -M "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/tls" --enrollment.profile tls --csr.hosts peer0.manufacturer.auto.com --csr.hosts  peer0-manufacturer --csr.hosts ca-manufacturer --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/manufacturer/tls-cert.pem"




cp "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/tls/tlscacerts/"* "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/tls/ca.crt"
cp "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/tls/signcerts/"* "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/tls/server.crt"
cp "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/tls/keystore/"* "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/manufacturer.auto.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/tls/tlscacerts/"* "/organizations/peerOrganizations/manufacturer.auto.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/manufacturer.auto.com/tlsca"
cp "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/tls/tlscacerts/"* "/organizations/peerOrganizations/manufacturer.auto.com/tlsca/tlsca.manufacturer.auto.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/manufacturer.auto.com/ca"
cp "/organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/msp/cacerts/"* "/organizations/peerOrganizations/manufacturer.auto.com/ca/ca.manufacturer.auto.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-manufacturer:7054 --caname ca-manufacturer -M "/organizations/peerOrganizations/manufacturer.auto.com/users/User1@manufacturer.auto.com/msp" --tls.certfiles "/organizations/fabric-ca/manufacturer/tls-cert.pem"

cp "/organizations/peerOrganizations/manufacturer.auto.com/msp/config.yaml" "/organizations/peerOrganizations/manufacturer.auto.com/users/User1@manufacturer.auto.com/msp/config.yaml"

fabric-ca-client enroll -u https://manufactureradmin:manufactureradminpw@ca-manufacturer:7054 --caname ca-manufacturer -M "/organizations/peerOrganizations/manufacturer.auto.com/users/Admin@manufacturer.auto.com/msp" --tls.certfiles "/organizations/fabric-ca/manufacturer/tls-cert.pem"

cp "/organizations/peerOrganizations/manufacturer.auto.com/msp/config.yaml" "/organizations/peerOrganizations/manufacturer.auto.com/users/Admin@manufacturer.auto.com/msp/config.yaml"

{ set +x; } 2>/dev/null
