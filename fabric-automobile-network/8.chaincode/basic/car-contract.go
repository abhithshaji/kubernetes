/*
 * SPDX-License-Identifier: Apache-2.0
 */

 package main

 import (
	 "encoding/json"
	 "fmt"
	 "time"
	 "github.com/golang/protobuf/ptypes"
	 "github.com/hyperledger/fabric-chaincode-go/shim"
	 "github.com/hyperledger/fabric-contract-api-go/contractapi"
 )
 
 type Car struct {
	 AsssetType        string `json:"AssetType"`
	 CarId             string `json:"CarId"`
	 Color             string `json:"Color"`
	 DateOfManufacture string `json:"DateOfManufacture"`
	 OwnedBy           string `json:"OwnedBy"`
	 Make              string `json:"Make"`
	 Model             string `json:"Model"`
	 Status            string `json:"Status"`
 }
 
 
 // CarContract contract for managing CRUD for Car
 type CarContract struct {
	 contractapi.Contract
 }
 
 type HistoryQueryResult struct {
	 Record    *Car      `json:"record"`
	 TxId      string    `json:"txId"`
	 Timestamp time.Time `json:"timestamp"`
	 IsDelete  bool      `json:"isDelete"`
 }
 
 type PaginatedQueryResult struct {
	 Records             []*Car `json:"records"`
	 FetchedRecordsCount int32  `json:"fetchedRecordsCount"`
	 Bookmark            string `json:"bookmark"`
 }
 
 // CarExists returns true when asset with given ID exists in world state
 func (c *CarContract) CarExists(ctx contractapi.TransactionContextInterface, carID string) (bool, error) {
	 data, err := ctx.GetStub().GetState(carID)
 
	 if err != nil {
		 return false, err
	 }
 
	 return data != nil, nil
 }
 
 // CreateCar creates a new instance of Car
 func (c *CarContract) CreateCar(ctx contractapi.TransactionContextInterface, carID string, make string, model string, color string, manufacturerName string, dateOfManufacture string) (string, error) {
	 clientOrgID, err := ctx.GetClientIdentity().GetMSPID()
	 if err != nil {
		 return "", err
	 }
 
	 if clientOrgID == "ManufacturerMSP" {
 
		 exists, err := c.CarExists(ctx, carID)
		 if err != nil {
			 return "", fmt.Errorf("Could not read from world state. %s", err)
		 } else if exists {
			 return "", fmt.Errorf("The asset %s already exists", carID)
		 }
 
		 car := Car{
			 AsssetType:        "car",
			 CarId:             carID,
			 Color:             color,
			 DateOfManufacture: dateOfManufacture,
			 Make:              make,
			 Model:             model,
			 OwnedBy:           manufacturerName,
			 Status:            "In Factory",
		 }
 
		 bytes, _ := json.Marshal(car)
		 err = ctx.GetStub().PutState(carID, bytes)
		 if err != nil {
			 return "", err
		 } else {
			 return fmt.Sprintf("successfully added car %v", carID), nil
		 }
 
	 } else {
		 return "", fmt.Errorf("User under following MSPID: %v cannot able to perform this action", clientOrgID)
	 }
 }
 
 // ReadCar retrieves an instance of Car from the world state
 func (c *CarContract) ReadCar(ctx contractapi.TransactionContextInterface, carID string) (*Car, error) {
	 exists, err := c.CarExists(ctx, carID)
	 if err != nil {
		 return nil, fmt.Errorf("Could not read from world state. %s", err)
	 } else if !exists {
		 return nil, fmt.Errorf("The asset %s does not exist", carID)
	 }
 
	 return ReadState(ctx, carID)
 
	 // bytes, _ := ctx.GetStub().GetState(carID)
 
	 // car := new(Car)
 
	 // err = json.Unmarshal(bytes, &car)
 
	 // if err != nil {
	 // 	return nil, fmt.Errorf("Could not unmarshal world state data to type Car")
	 // }
 
	 // return car, nil
 }
 
 func ReadState(ctx contractapi.TransactionContextInterface, carID string) (*Car, error) {
	 bytes, _ := ctx.GetStub().GetState(carID)
 
	 car := new(Car)
 
	 err := json.Unmarshal(bytes, &car)
 
	 if err != nil {
		 return nil, fmt.Errorf("Could not unmarshal world state data to type Car")
	 }
 
	 return car, nil
 }
 
 func (c *CarContract) DeleteCar(ctx contractapi.TransactionContextInterface, carID string) (string, error) {
 
	 clientOrgID, err := ctx.GetClientIdentity().GetMSPID()
	 if err != nil {
		 return "", err
	 }
	 if clientOrgID == "ManufacturerMSP" {
 
		 exists, err := c.CarExists(ctx, carID)
		 if err != nil {
			 return "", fmt.Errorf("Could not read from world state. %s", err)
		 } else if !exists {
			 return "", fmt.Errorf("The asset %s does not exist", carID)
		 }
 
		 err = ctx.GetStub().DelState(carID)
		 if err != nil {
			 return "", err
		 } else {
			 return fmt.Sprintf("Car with id %v is deleted from the world state.", carID), nil
		 }
 
	 } else {
		 return "", fmt.Errorf("User under following MSP:%v cannot able to perform this action", clientOrgID)
	 }
 }
 
 func (c *CarContract) GetAllCars(ctx contractapi.TransactionContextInterface) ([]*Car, error) {
	 queryString := `{"selector":{"AssetType":"car"}, "sort":[{ "CarId": "desc"}]}`
 
	 resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	 if err != nil {
		 return nil, err
	 }
	 defer resultsIterator.Close()
	 return carResultIteratorFunction(resultsIterator)
 }
 
 func (c *CarContract) GetCarsByRange(ctx contractapi.TransactionContextInterface, startKey, endKey string) ([]*Car, error) {
	 resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)
	 if err != nil {
		 return nil, err
	 }
	 defer resultsIterator.Close()
 
	 return carResultIteratorFunction(resultsIterator)
 }
 
 func (c *CarContract) GetMatchingOrders(ctx contractapi.TransactionContextInterface, carID string) ([]*Order, error) {
	 exists, err := c.CarExists(ctx, carID)
	 if err != nil {
		 return nil, fmt.Errorf("Could not read from world state. %s", err)
	 } else if !exists {
		 return nil, fmt.Errorf("The asset %s does not exist", carID)
	 }
 
	 car, err := c.ReadCar(ctx, carID)
	 if err != nil {
		 return nil, fmt.Errorf("Error reading car %v", err)
	 }
	 queryString := fmt.Sprintf(`{"selector":{"assetType":"Order","make":"%s", "model": "%s", "color":"%s"}}`, car.Make, car.Model, car.Color)
	 resultsIterator, err := ctx.GetStub().GetPrivateDataQueryResult(getCollectionName(), queryString)
 
	 if err != nil {
		 return nil, err
	 }
	 defer resultsIterator.Close()
 
	 return orderResultIteratorFunction(resultsIterator)
 
 }
 
 func (c *CarContract) MatchOrder(ctx contractapi.TransactionContextInterface, carID string, orderID string) (string, error) {
	 order, err := ReadPrivateState(ctx, orderID)
 
	 if err != nil {
		 return "", err
	 }
 
	 car, err := c.ReadCar(ctx, carID)
	 if err != nil {
		 return "", err
	 }
 
	 if car.Make == order.Make && car.Color == order.Color && car.Model == order.Model {
		 car.OwnedBy = order.DealerName
		 car.Status = "assigned to a dealer"
		 bytes, _ := json.Marshal(car)
		 collectionName := getCollectionName()
		 ctx.GetStub().DelPrivateData(collectionName, orderID)
		 err = ctx.GetStub().PutState(carID, bytes)
		 if err != nil {
			 return "", err
		 } else {
			 return fmt.Sprintf("Deleted order %v and Assigned %v to %v", orderID, car.CarId, order.DealerName), nil
		 }
	 } else {
		 return "", fmt.Errorf("order is not matching")
	 }
 }
 
 func (c *CarContract) RegisterCar(ctx contractapi.TransactionContextInterface, carID string, ownerName string, registrationNumber string) (string, error) {
	 clientOrgID, err := ctx.GetClientIdentity().GetMSPID()
	 if err != nil {
		 return "", err
	 }
 
	 if clientOrgID == "MvdMSP" {
 
		 exists, err := c.CarExists(ctx, carID)
		 if err != nil {
			 return "", fmt.Errorf("Could not read from world state. %s", err)
		 }
		 if exists {
			 car, _ := c.ReadCar(ctx, carID)
			 car.Status = fmt.Sprintf("Registered to  %v with plate number %v", ownerName, registrationNumber)
			 car.OwnedBy = ownerName
 
			 bytes, _ := json.Marshal(car)
			 err = ctx.GetStub().PutState(carID, bytes)
			 if err != nil {
				 return "", err
			 } else {
				 return fmt.Sprintf("Car %v successfully registered to %v", carID, ownerName), nil
			 }
 
		 } else {
			 return "", fmt.Errorf("Car %v does not exist!", carID)
		 }
 
	 } else {
		 return "", fmt.Errorf("User under following MSPID: %v cannot able to perform this action", clientOrgID)
	 }
 
 }
 
 func (c *CarContract) GetCarsWithPagination(ctx contractapi.TransactionContextInterface, pageSize int32, bookmark string) (*PaginatedQueryResult, error) {
	 queryString := `{"selector":{"AssetType":"car"}}`
	 resultsIterator, responseMetadata, err := ctx.GetStub().GetQueryResultWithPagination(queryString, pageSize, bookmark)
	 if err != nil {
		 return nil, err
	 }
	 defer resultsIterator.Close()
 
	 cars, err := carResultIteratorFunction(resultsIterator)
	 if err != nil {
		 return nil, err
	 }
 
	 return &PaginatedQueryResult{
		 Records:             cars,
		 FetchedRecordsCount: responseMetadata.FetchedRecordsCount,
		 Bookmark:            responseMetadata.Bookmark,
	 }, nil
 }
 
 func (c *CarContract) GetCarHistory(ctx contractapi.TransactionContextInterface, carID string) ([]*HistoryQueryResult, error) {
 
	 resultsIterator, err := ctx.GetStub().GetHistoryForKey(carID)
	 if err != nil {
		 return nil, err
	 }
	 defer resultsIterator.Close()
 
	 var records []*HistoryQueryResult
	 for resultsIterator.HasNext() {
		 response, err := resultsIterator.Next()
		 if err != nil {
			 return nil, err
		 }
 
		 var car Car
		 if len(response.Value) > 0 {
			 err = json.Unmarshal(response.Value, &car)
			 if err != nil {
				 return nil, err
			 }
		 } else {
			 car = Car{
				 CarId: carID,
			 }
		 }
 
		 timestamp, err := ptypes.Timestamp(response.Timestamp)
		 if err != nil {
			 return nil, err
		 }
 
		 record := HistoryQueryResult{
			 TxId:      response.TxId,
			 Timestamp: timestamp,
			 Record:    &car,
			 IsDelete:  response.IsDelete,
		 }
		 records = append(records, &record)
	 }
 
	 return records, nil
 }
 
 func carResultIteratorFunction(resultsIterator shim.StateQueryIteratorInterface) ([]*Car, error) {
	 var cars []*Car
	 for resultsIterator.HasNext() {
		 queryResult, err := resultsIterator.Next()
		 if err != nil {
			 return nil, err
		 }
		 var car Car
		 err = json.Unmarshal(queryResult.Value, &car)
		 if err != nil {
			 return nil, err
		 }
		 cars = append(cars, &car)
	 }
 
	 return cars, nil
 }
 