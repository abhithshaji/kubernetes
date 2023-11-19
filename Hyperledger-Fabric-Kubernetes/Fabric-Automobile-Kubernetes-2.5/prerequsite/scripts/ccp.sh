#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        connection-profile/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        connection-profile/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=1
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/manufacturer.auto.com/tlsca/tlsca.manufacturer.auto.com-cert.pem
CAPEM=organizations/peerOrganizations/manufacturer.auto.com/ca/ca.manufacturer.auto.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > connection-profile/connection-manufacturer.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > connection-profile/connection-manufacturer.yaml

ORG=2
P0PORT=9051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/dealer.auto.com/tlsca/tlsca.dealer.auto.com-cert.pem
CAPEM=organizations/peerOrganizations/dealer.auto.com/ca/ca.dealer.auto.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > connection-profile/connection-dealer.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > connection-profile/connection-dealer.yaml




ORG=3
P0PORT=11051
CAPORT=9054
PEERPEM=organizations/peerOrganizations/mvd.auto.com/tlsca/tlsca.mvd.auto.com-cert.pem
CAPEM=organizations/peerOrganizations/mvd.auto.com/ca/ca.mvd.auto.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > connection-profile/connection-mvd.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > connection-profile/connection-mvd.yaml