CORE_PEER_LOCALMSPID=$1
peer channel update -o orderer:7050  -c landchannel -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls  --cafile $ORDERER_CA 