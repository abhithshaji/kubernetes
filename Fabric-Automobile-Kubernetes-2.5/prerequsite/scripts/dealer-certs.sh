  set -x
mkdir -p /organizations/peerOrganizations/dealer.auto.com/
export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/dealer.auto.com/

fabric-ca-client enroll -u https://admin:adminpw@ca-dealer:8054 --caname ca-dealer --tls.certfiles "/organizations/fabric-ca/dealer/tls-cert.pem"

echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-dealer-8054-ca-dealer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-dealer-8054-ca-dealer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-dealer-8054-ca-dealer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-dealer-8054-ca-dealer.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/dealer.auto.com/msp/config.yaml"



fabric-ca-client register --caname ca-dealer --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/dealer/tls-cert.pem"

fabric-ca-client register --caname ca-dealer --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/dealer/tls-cert.pem"

fabric-ca-client register --caname ca-dealer --id.name dealeradmin --id.secret dealeradminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/dealer/tls-cert.pem"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-dealer:8054 --caname ca-dealer -M "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/msp" --csr.hosts peer0.dealer.auto.com --csr.hosts  peer0-dealer --tls.certfiles "/organizations/fabric-ca/dealer/tls-cert.pem"

cp "/organizations/peerOrganizations/dealer.auto.com/msp/config.yaml" "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/msp/config.yaml"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-dealer:8054 --caname ca-dealer -M "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/tls" --enrollment.profile tls --csr.hosts peer0.dealer.auto.com --csr.hosts  peer0-dealer --csr.hosts ca-dealer --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/dealer/tls-cert.pem"


cp "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/tls/tlscacerts/"* "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/tls/ca.crt"
cp "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/tls/signcerts/"* "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/tls/server.crt"
cp "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/tls/keystore/"* "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/dealer.auto.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/tls/tlscacerts/"* "/organizations/peerOrganizations/dealer.auto.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/dealer.auto.com/tlsca"
cp "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/tls/tlscacerts/"* "/organizations/peerOrganizations/dealer.auto.com/tlsca/tlsca.dealer.auto.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/dealer.auto.com/ca"
cp "/organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/msp/cacerts/"* "/organizations/peerOrganizations/dealer.auto.com/ca/ca.dealer.auto.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-dealer:8054 --caname ca-dealer -M "/organizations/peerOrganizations/dealer.auto.com/users/User1@dealer.auto.com/msp" --tls.certfiles "/organizations/fabric-ca/dealer/tls-cert.pem"

cp "/organizations/peerOrganizations/dealer.auto.com/msp/config.yaml" "/organizations/peerOrganizations/dealer.auto.com/users/User1@dealer.auto.com/msp/config.yaml"

fabric-ca-client enroll -u https://dealeradmin:dealeradminpw@ca-dealer:8054 --caname ca-dealer -M "/organizations/peerOrganizations/dealer.auto.com/users/Admin@dealer.auto.com/msp" --tls.certfiles "/organizations/fabric-ca/dealer/tls-cert.pem"

cp "/organizations/peerOrganizations/dealer.auto.com/msp/config.yaml" "/organizations/peerOrganizations/dealer.auto.com/users/Admin@dealer.auto.com/msp/config.yaml"

  { set +x; } 2>/dev/null