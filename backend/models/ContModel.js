const mongoose=require("mongoose");

const conSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dname: { type: String, required: true },
    mail: { type: String, required: true },
    mob:{type: String, required: true},
    msg:{ type: String, required: true}
});

const conModel = mongoose.model('Contact', conSchema);

module.exports = conModel;