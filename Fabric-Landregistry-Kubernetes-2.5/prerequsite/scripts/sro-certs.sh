set -x

mkdir -p /organizations/peerOrganizations/sro.land.com/

export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/sro.land.com/



fabric-ca-client enroll -u https://admin:adminpw@ca-sro:7054 --caname ca-sro --tls.certfiles "/organizations/fabric-ca/sro/tls-cert.pem"



echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-sro-7054-ca-sro.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-sro-7054-ca-sro.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-sro-7054-ca-sro.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-sro-7054-ca-sro.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/sro.land.com/msp/config.yaml"



fabric-ca-client register --caname ca-sro --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/sro/tls-cert.pem"



fabric-ca-client register --caname ca-sro --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/sro/tls-cert.pem"




fabric-ca-client register --caname ca-sro --id.name sroadmin --id.secret sroadminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/sro/tls-cert.pem"



fabric-ca-client enroll -u https://peer0:peer0pw@ca-sro:7054 --caname ca-sro -M "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/msp" --csr.hosts peer0.sro.land.com --csr.hosts  peer0-sro --tls.certfiles "/organizations/fabric-ca/sro/tls-cert.pem"



cp "/organizations/peerOrganizations/sro.land.com/msp/config.yaml" "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/msp/config.yaml"



fabric-ca-client enroll -u https://peer0:peer0pw@ca-sro:7054 --caname ca-sro -M "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/tls" --enrollment.profile tls --csr.hosts peer0.sro.land.com --csr.hosts  peer0-sro --csr.hosts ca-sro --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/sro/tls-cert.pem"




cp "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/tls/tlscacerts/"* "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/tls/ca.crt"
cp "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/tls/signcerts/"* "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/tls/server.crt"
cp "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/tls/keystore/"* "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/sro.land.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/tls/tlscacerts/"* "/organizations/peerOrganizations/sro.land.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/sro.land.com/tlsca"
cp "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/tls/tlscacerts/"* "/organizations/peerOrganizations/sro.land.com/tlsca/tlsca.sro.land.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/sro.land.com/ca"
cp "/organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/msp/cacerts/"* "/organizations/peerOrganizations/sro.land.com/ca/ca.sro.land.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-sro:7054 --caname ca-sro -M "/organizations/peerOrganizations/sro.land.com/users/User1@sro.land.com/msp" --tls.certfiles "/organizations/fabric-ca/sro/tls-cert.pem"

cp "/organizations/peerOrganizations/sro.land.com/msp/config.yaml" "/organizations/peerOrganizations/sro.land.com/users/User1@sro.land.com/msp/config.yaml"

fabric-ca-client enroll -u https://sroadmin:sroadminpw@ca-sro:7054 --caname ca-sro -M "/organizations/peerOrganizations/sro.land.com/users/Admin@sro.land.com/msp" --tls.certfiles "/organizations/fabric-ca/sro/tls-cert.pem"

cp "/organizations/peerOrganizations/sro.land.com/msp/config.yaml" "/organizations/peerOrganizations/sro.land.com/users/Admin@sro.land.com/msp/config.yaml"

{ set +x; } 2>/dev/null
