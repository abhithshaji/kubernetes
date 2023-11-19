const fs = require("fs");
const path = require("path");

// const ccpPath = path.resolve(
//   __dirname,
//   "..",
//   "..",
//   "test-network",
//   "organizations",
//   "peerOrganizations",
//   "org1.example.com",
//   "connection-org1.json"
// );

// console.log(ccpPath);

// const walletPath = path.join(__dirname, "wallet");

// console.log(walletPath);
const fabricNetworkFolder = "Fabric-network0403";
const currentDirectory = path.resolve(__dirname);
console.log("currentDirectory", currentDirectory);
const walletPathSro = path.resolve(
  __dirname,
  "..",
  "..",
  fabricNetworkFolder,
  "Fabric-network",
  "organizations",
  "peerOrganizations",
  "sro.land.com"
);

console.log(walletPathSro);
