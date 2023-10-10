/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

class LandContract extends Contract {
  async landExists(ctx, landId) {
    const buffer = await ctx.stub.getState(landId);
    return !!buffer && buffer.length > 0;
  }

  //SRO

  async createLand(
    ctx,
    landId,
    district,
    subRegistrarOffice,
    taluk,
    village,
    blockNo,
    resurveyNo,
    areaAcres,
    areaCent,
    eastBoundary,
    northBoundary,
    westBoundary,
    southBoundary,
    remarks,
    presentOwner,
    oldsurveyNo,
    mongoDBId
  ) {
    const mspID = ctx.clientIdentity.getMSPID();
    console.log(mspID);

    if (mspID === "SroMSP") {
      const exists = await this.landExists(ctx, landId);
      if (exists) {
        throw new Error(`The land ${landId} already exists`);
      }

      const landAsset = {
        district,
        subRegistrarOffice,
        taluk,
        village,
        blockNo,
        resurveyNo,
        areaAcres,
        areaCent,
        eastBoundary,
        northBoundary,
        westBoundary,
        southBoundary,
        remarks,
        presentOwner,
        oldsurveyNo,
        mongoDBId,
        status:
          "Registration is completed and Land Mutation is pending",
        isLandMortgaged: false,
        isLandMutated: false,
      };
      console.log(`land Asset inside land contract - creatLand`, landAsset);

      const buffer = Buffer.from(JSON.stringify(landAsset));
      console.log(buffer);
      await ctx.stub.putState(landId, buffer);

      let addLandEventData = { Type: "Land creation", Model: landId };
      await ctx.stub.setEvent(
        "addLandEvent",
        Buffer.from(JSON.stringify(addLandEventData))
      );
    } else {
      return `User with MSP ID : ${mspID} cannot perform this action`;
    }
  }

  async readLand(ctx, landId) {
    const exists = await this.landExists(ctx, landId);
    if (!exists) {
      throw new Error(`The land ${landId} does not exist`);
    }
    const buffer = await ctx.stub.getState(landId);
    console.log(buffer);
    const asset = JSON.parse(buffer.toString());
    console.log(asset);
    return asset;
  }

  async updateLand(
    ctx,
    landId,
    district,
    subRegistrarOffice,
    taluk,
    village,
    blockNo,
    resurveyNo,
    areaAcres,
    areaCent,
    eastBoundary,
    northBoundary,
    westBoundary,
    southBoundary,
    remarks,
    presentOwner,
    oldsurveyNo,
    status,
    isLandMortgaged,
    isLandMutated,
    mongoDBId
  ) {
    const mspID = ctx.clientIdentity.getMSPID();

    if (mspID === "SroMSP") {
      const exists = await this.landExists(ctx, landId);
      if (!exists) {
        throw new Error(`The land ${landId} does not exist`);
      }

      const landAsset = {
        district,
        subRegistrarOffice,
        taluk,
        village,
        blockNo,
        resurveyNo,
        areaAcres,
        areaCent,
        eastBoundary,
        northBoundary,
        westBoundary,
        southBoundary,
        remarks,
        presentOwner,
        oldsurveyNo,
        status,
        isLandMortgaged,
        isLandMutated,
        mongoDBId,
      };

      // const asset = { value: newValue };
      // console.log(newValue);
      const buffer = Buffer.from(JSON.stringify(landAsset));
      console.log(buffer);
      await ctx.stub.putState(landId, buffer);
    } else {
      return `User with MSP ID : ${mspID} cannot perform this action`;
    }
  }

  // ReadAsset returns the asset stored in the world state with given id.
  async ReadAsset(ctx, landId) {
    const assetJSON = await ctx.stub.getState(landId); // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  async transferLand(ctx, landId, newOwner, newOwnerAadhaar) {
    const mspID = ctx.clientIdentity.getMSPID();

    if (mspID === "SroMSP") {
      const exists = await this.landExists(ctx, landId);
      if (!exists) {
        throw new Error(`The land ${landId} does not exist`);
      }

      const landAssetString = await this.ReadAsset(ctx, landId);
      const landAsset = JSON.parse(landAssetString);
      console.log(landAsset.isLandMutated);
      console.log(landAsset.isLandMortgaged);
      //TODO:
      if (
        landAsset.isLandMutated == "false" ||
        landAsset.isLandMutated == false
      ) {
        throw new Error(
          `Land Records are not yet updated with Revenue Department`
        );
      }

      if (landAsset.isLandMutated == "rejected") {
        throw new Error(
          `Land Mutation is rejected by Revenue Department; Please approach Revenue Department`
        );
      }

      if (
        landAsset.isLandMortgaged == "true" ||
        landAsset.isLandMortgaged == true
      ) {
        throw new Error(
          `Land is under Mortgage with Bank; Land transfer is permitted only after mortgage removal`
        );
      }

      landAsset.presentOwner = newOwner;
      landAsset.isLandMutated = false;
      landAsset.status =
        "Registration is completed and Land Mutation is pending";
      const buffer = Buffer.from(JSON.stringify(landAsset));
      return ctx.stub.putState(landId, buffer);
    } else {
      return `User with MSP ID : ${mspID} cannot perform this action`;
    }
  }

  async deleteLand(ctx, landId) {
    const mspID = ctx.clientIdentity.getMSPID();
    console.log(mspID);

    if (mspID === "SroMSP") {
      const exists = await this.landExists(ctx, landId);
      if (!exists) {
        throw new Error(`The land ${landId} does not exist`);
      }
      await ctx.stub.deleteState(landId);
    } else {
      return `User with MSP ID : ${mspID} cannot perform this action`;
    }
  }

  //TODO:
  // GetAssetHistory returns the chain of custody for an asset since issuance.
  async GetAssetHistory(ctx, assetName) {
    let resultsIterator = await ctx.stub.getHistoryForKey(assetName);
    let results = await this.GetAllResults(resultsIterator, true);

    return JSON.stringify(results);
  }

  async GetAllResults(iterator, isHistory) {
    let allResults = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString("utf8"));
        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString("utf8");
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString("utf8");
          }
        }
        allResults.push(jsonRes);
      }
      res = await iterator.next();
    }
    iterator.close();
    return allResults;
  }

  //revenue-mutationStatus
  async mutationUpdate(ctx, landId, newMutationStatus) {
    const mspID = ctx.clientIdentity.getMSPID();

    if (mspID === "RevenueMSP") {
      const exists = await this.landExists(ctx, landId);
      if (!exists) {
        throw new Error(`The land ${landId} does not exist`);
      }

      const landAssetString = await this.ReadAsset(ctx, landId);
      const landAsset = JSON.parse(landAssetString);
      landAsset.isLandMutated = newMutationStatus;
      landAsset.status =
        "Registration is completed and Land Mutation is completed";
      const buffer = Buffer.from(JSON.stringify(landAsset));
      return ctx.stub.putState(landId, buffer);
    } else {
      return `User with MSP ID : ${mspID} cannot perform this action`;
    }
  }

  //bank-mortgageStatus
  async mortgageUpdate(ctx, landId, newMortgageStatus) {
    const mspID = ctx.clientIdentity.getMSPID();

    if (mspID === "BankMSP") {
      const exists = await this.landExists(ctx, landId);
      if (!exists) {
        throw new Error(`The land ${landId} does not exist`);
      }

      const landAssetString = await this.ReadAsset(ctx, landId);
      const landAsset = JSON.parse(landAssetString);
      landAsset.isLandMortgaged = newMortgageStatus;
      const buffer = Buffer.from(JSON.stringify(landAsset));
      return ctx.stub.putState(landId, buffer);
    } else {
      return `User with MSP ID : ${mspID} cannot perform this action`;
    }
  }
}

module.exports = LandContract;
