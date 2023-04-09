set -x

mkdir -p /organizations/peerOrganizations/mvd.auto.com/
export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/mvd.auto.com/

fabric-ca-client enroll -u https://admin:adminpw@ca-mvd:9054 --caname ca-mvd --tls.certfiles "/organizations/fabric-ca/mvd/tls-cert.pem"

echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-mvd-9054-ca-mvd.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-mvd-9054-ca-mvd.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-mvd-9054-ca-mvd.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-mvd-9054-ca-mvd.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/mvd.auto.com/msp/config.yaml"



fabric-ca-client register --caname ca-mvd --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/mvd/tls-cert.pem"

fabric-ca-client register --caname ca-mvd --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/mvd/tls-cert.pem"

fabric-ca-client register --caname ca-mvd --id.name mvdadmin --id.secret mvdadminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/mvd/tls-cert.pem"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-mvd:9054 --caname ca-mvd -M "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/msp" --csr.hosts peer0.mvd.auto.com --csr.hosts  peer0-mvd --tls.certfiles "/organizations/fabric-ca/mvd/tls-cert.pem"

cp "/organizations/peerOrganizations/mvd.auto.com/msp/config.yaml" "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/msp/config.yaml"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-mvd:9054 --caname ca-mvd -M "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/tls" --enrollment.profile tls --csr.hosts peer0.mvd.auto.com --csr.hosts  peer0-mvd --csr.hosts ca-mvd --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/mvd/tls-cert.pem"


cp "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/tls/tlscacerts/"* "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/tls/ca.crt"
cp "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/tls/signcerts/"* "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/tls/server.crt"
cp "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/tls/keystore/"* "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/mvd.auto.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/tls/tlscacerts/"* "/organizations/peerOrganizations/mvd.auto.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/mvd.auto.com/tlsca"
cp "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/tls/tlscacerts/"* "/organizations/peerOrganizations/mvd.auto.com/tlsca/tlsca.mvd.auto.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/mvd.auto.com/ca"
cp "/organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/msp/cacerts/"* "/organizations/peerOrganizations/mvd.auto.com/ca/ca.mvd.auto.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-mvd:9054 --caname ca-mvd -M "/organizations/peerOrganizations/mvd.auto.com/users/User1@mvd.auto.com/msp" --tls.certfiles "/organizations/fabric-ca/mvd/tls-cert.pem"

cp "/organizations/peerOrganizations/mvd.auto.com/msp/config.yaml" "/organizations/peerOrganizations/mvd.auto.com/users/User1@mvd.auto.com/msp/config.yaml"

fabric-ca-client enroll -u https://mvdadmin:mvdadminpw@ca-mvd:9054 --caname ca-mvd -M "/organizations/peerOrganizations/mvd.auto.com/users/Admin@mvd.auto.com/msp" --tls.certfiles "/organizations/fabric-ca/mvd/tls-cert.pem"

cp "/organizations/peerOrganizations/mvd.auto.com/msp/config.yaml" "/organizations/peerOrganizations/mvd.auto.com/users/Admin@mvd.auto.com/msp/config.yaml"

{ set +x; } 2>/dev/null