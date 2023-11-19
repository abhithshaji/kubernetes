  set -x
mkdir -p /organizations/peerOrganizations/bank.land.com/
export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/bank.land.com/

fabric-ca-client enroll -u https://admin:adminpw@ca-bank:8054 --caname ca-bank --tls.certfiles "/organizations/fabric-ca/bank/tls-cert.pem"

echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca-bank-8054-ca-bank.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca-bank-8054-ca-bank.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca-bank-8054-ca-bank.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca-bank-8054-ca-bank.pem
    OrganizationalUnitIdentifier: orderer' > "/organizations/peerOrganizations/bank.land.com/msp/config.yaml"



fabric-ca-client register --caname ca-bank --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "/organizations/fabric-ca/bank/tls-cert.pem"

fabric-ca-client register --caname ca-bank --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "/organizations/fabric-ca/bank/tls-cert.pem"

fabric-ca-client register --caname ca-bank --id.name bankadmin --id.secret bankadminpw --id.type admin --tls.certfiles "/organizations/fabric-ca/bank/tls-cert.pem"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-bank:8054 --caname ca-bank -M "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/msp" --csr.hosts peer0.bank.land.com --csr.hosts  peer0-bank --tls.certfiles "/organizations/fabric-ca/bank/tls-cert.pem"

cp "/organizations/peerOrganizations/bank.land.com/msp/config.yaml" "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/msp/config.yaml"

fabric-ca-client enroll -u https://peer0:peer0pw@ca-bank:8054 --caname ca-bank -M "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/tls" --enrollment.profile tls --csr.hosts peer0.bank.land.com --csr.hosts  peer0-bank --csr.hosts ca-bank --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/bank/tls-cert.pem"


cp "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/tls/tlscacerts/"* "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/tls/ca.crt"
cp "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/tls/signcerts/"* "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/tls/server.crt"
cp "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/tls/keystore/"* "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/bank.land.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/tls/tlscacerts/"* "/organizations/peerOrganizations/bank.land.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/bank.land.com/tlsca"
cp "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/tls/tlscacerts/"* "/organizations/peerOrganizations/bank.land.com/tlsca/tlsca.bank.land.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/bank.land.com/ca"
cp "/organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/msp/cacerts/"* "/organizations/peerOrganizations/bank.land.com/ca/ca.bank.land.com-cert.pem"


fabric-ca-client enroll -u https://user1:user1pw@ca-bank:8054 --caname ca-bank -M "/organizations/peerOrganizations/bank.land.com/users/User1@bank.land.com/msp" --tls.certfiles "/organizations/fabric-ca/bank/tls-cert.pem"

cp "/organizations/peerOrganizations/bank.land.com/msp/config.yaml" "/organizations/peerOrganizations/bank.land.com/users/User1@bank.land.com/msp/config.yaml"

fabric-ca-client enroll -u https://bankadmin:bankadminpw@ca-bank:8054 --caname ca-bank -M "/organizations/peerOrganizations/bank.land.com/users/Admin@bank.land.com/msp" --tls.certfiles "/organizations/fabric-ca/bank/tls-cert.pem"

cp "/organizations/peerOrganizations/bank.land.com/msp/config.yaml" "/organizations/peerOrganizations/bank.land.com/users/Admin@bank.land.com/msp/config.yaml"

  { set +x; } 2>/dev/null