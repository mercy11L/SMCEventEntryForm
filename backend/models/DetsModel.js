const mongoose=require("mongoose");
const detSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    num: { type: String, required: true },
    name: { type: String, required: true },
    nc: { type: String, required: true },
    lvl: { type: String, required: true },
    mode: { type: String, required: true },
    eventDate: { type: String, required: true },
    endDate: { type: String, required: true },
    organisedBy: { type: String, required: true },
    selectedOptions: { type: [String], required: true },
    sc: { type: String, required: true },
    isOrganised: { type: String, required: true },
    categories: { type: [String], required: true },
    nofpart: { type: Number, required: true },
    theme: { type: String, required: true },
    desc: { type: String, required: true },
    obj: { type: String, required: true },
    outcome: { type: String, required: true },
    geocap: { type: String, required: true },
    signcap: { type: String, required: true },
    GeoFilePaths: { type: [String], required: true },
    inviteFilePaths: { type: [String], required: true },
    ptlistFilePaths: { type: [String], required: true },
    signatureFilePath: { type: String, required: true },
    // certFilePath: { type: String },
    // feedbackPath: { type: [String], required: true },
  });

const detModel = new mongoose.model('Event_details', detSchema);

module.exports=detModel;