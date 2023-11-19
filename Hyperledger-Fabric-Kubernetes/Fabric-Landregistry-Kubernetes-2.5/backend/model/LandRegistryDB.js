const mongoose = require('mongoose');

try {
    mongoose.connect('mongodb+srv://kbalandregistryproject2023:Login123@cluster0.kadygun.mongodb.net/landRegistry?retryWrites=true&w=majority', () => {
        console.log("connected");
        //     let db = mongoose.connection.db;
        //     return db.collection('landRegistrations').rename('landregistrations');
        // }).then(() => {
        //     console.log('rename successful');
        // }).catch(e => {
        //     console.log('rename failed:', e.message);
    })
}
catch (e) {
    console.log(e);
    console.log('could not connect');
}

// let db = mongoose.connection.db;

// return db.collection('test').rename('foobar');
// }).then(() => {
//     console.log('rename successful');
// }).catch(e => {
//     console.log('rename failed:', e.message);
// })

const Schema = mongoose.Schema;

const landDetailsSchema = new Schema({
    district: String,
    subRegistrarOffice: String,
    taluk: String,
    village: String,
    blockNo: String,
    resurveyNo: String,
    // resurveySubdivNo: String,
    areaAcres: Number,
    areaCent: Number,
    eastBoundary: String,
    northBoundary: String,
    westBoundary: String,
    southBoundary: String,
    remarks: String,
    presentOwner: String,
    oldSurveyNo: String,
    landId: String
    // surveySubdivNo: String,
    // isLandMortgaged: Boolean
});

const landRegistrationsSchema = new Schema({
    uniqueLandId: String,
    registrationDate: Date,
    registrationValue: Number,
    deedType: String,
    sellerName: String,
    sellerAddress: String,
    buyerName: String,
    buyerAddress: String,
    registrationDocumentVolumePageNumber: String,
    sequenceNo: String
});


const LandDetailsInfo = mongoose.model('landdetails', landDetailsSchema);
const LandRegistrationsInfo = mongoose.model('landregistrations', landRegistrationsSchema);
module.exports = { LandDetailsInfo, LandRegistrationsInfo };