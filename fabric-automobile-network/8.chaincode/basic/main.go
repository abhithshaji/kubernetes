/*
 * SPDX-License-Identifier: Apache-2.0
 */

package main

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"os"
	"log"
	"github.com/hyperledger/fabric-chaincode-go/shim"
)

type serverConfig struct {
	CCID    string
	Address string
}


func main() {
	carContract := new(CarContract)
	orderContarct := new(OrderContract)

	// See chaincode.env.example
	config := serverConfig{
		CCID:    os.Getenv("CHAINCODE_ID"),
		Address: os.Getenv("CHAINCODE_SERVER_ADDRESS"),
	}
	//

	chaincode, err := contractapi.NewChaincode(carContract, orderContarct)

	if err != nil {
		log.Panicf("error create automobile chaincode: %s", err)
	}

	server := &shim.ChaincodeServer{
		CCID:    config.CCID,
		Address: config.Address,
		CC:      chaincode,
		TLSProps: shim.TLSProperties{
			Disabled: true,
		},
	}


	if err := server.Start(); err != nil {
		log.Panicf("error starting automobile chaincode: %s", err)
	}
}
