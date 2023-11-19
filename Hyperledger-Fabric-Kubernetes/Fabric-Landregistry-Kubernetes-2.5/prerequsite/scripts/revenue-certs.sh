set -x

mkdir -p /organizations/peerOrganizations/revenue.land.com/
export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/revenue.land.com/

fabric-ca-client enroll -u https://admin:adminpw@ca-revenue:9054 --caname ca-revenue --tls.certfiles "/organizations/fabric-ca/revenue/tls-cert.pem"

echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-revenue-9054-ca-revenue.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-revenue-9054-ca-revenue.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-revenue-9054-ca-revenue.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-revenue-9054-ca-revenue.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/revenue.land.com/msp/config.yaml"



fabric-ca-client register --caname ca-revenue --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/revenue/tls-cert.pem"

fabric-ca-client register --caname ca-revenue --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/revenue/tls-cert.pem"

fabric-ca-client register --caname ca-revenue --id.name revenueadmin --id.secret revenueadminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/revenue/tls-cert.pem"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-revenue:9054 --caname ca-revenue -M "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/msp" --csr.hosts peer0.revenue.land.com --csr.hosts  peer0-revenue --tls.certfiles "/organizations/fabric-ca/revenue/tls-cert.pem"

cp "/organizations/peerOrganizations/revenue.land.com/msp/config.yaml" "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/msp/config.yaml"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-revenue:9054 --caname ca-revenue -M "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/tls" --enrollment.profile tls --csr.hosts peer0.revenue.land.com --csr.hosts  peer0-revenue --csr.hosts ca-revenue --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/revenue/tls-cert.pem"


cp "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/tls/tlscacerts/"* "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/tls/ca.crt"
cp "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/tls/signcerts/"* "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/tls/server.crt"
cp "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/tls/keystore/"* "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/revenue.land.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/tls/tlscacerts/"* "/organizations/peerOrganizations/revenue.land.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/revenue.land.com/tlsca"
cp "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/tls/tlscacerts/"* "/organizations/peerOrganizations/revenue.land.com/tlsca/tlsca.revenue.land.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/revenue.land.com/ca"
cp "/organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/msp/cacerts/"* "/organizations/peerOrganizations/revenue.land.com/ca/ca.revenue.land.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-revenue:9054 --caname ca-revenue -M "/organizations/peerOrganizations/revenue.land.com/users/User1@revenue.land.com/msp" --tls.certfiles "/organizations/fabric-ca/revenue/tls-cert.pem"

cp "/organizations/peerOrganizations/revenue.land.com/msp/config.yaml" "/organizations/peerOrganizations/revenue.land.com/users/User1@revenue.land.com/msp/config.yaml"

fabric-ca-client enroll -u https://revenueadmin:revenueadminpw@ca-revenue:9054 --caname ca-revenue -M "/organizations/peerOrganizations/revenue.land.com/users/Admin@revenue.land.com/msp" --tls.certfiles "/organizations/fabric-ca/revenue/tls-cert.pem"

cp "/organizations/peerOrganizations/revenue.land.com/msp/config.yaml" "/organizations/peerOrganizations/revenue.land.com/users/Admin@revenue.land.com/msp/config.yaml"

{ set +x; } 2>/dev/null