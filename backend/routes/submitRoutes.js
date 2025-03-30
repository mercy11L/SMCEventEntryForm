const express = require("express");
const multer=require("multer");
const detModel = require("../models/DetsModel");
const userModel = require("../models/UserModel");
const router = express.Router();
const path=require("path");

router.use(express.json()); // Ensure JSON is parsed
router.use(express.urlencoded({ extended: true }));


let storage= multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'public/images');
    },
    filename: (req,file,cb)=>{
        cb(null,file.fieldname + '_' + Date.now()+ path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,  // Use your custom storage configuration
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  });
  
  let uploadHandler = upload.fields([
    { name: 'geo', maxCount: 10 },
    { name: 'invite', maxCount: 10 },
    { name: 'ptlist', maxCount: 10 },
    { name: 'signature', maxCount: 1 }
]);

router.post('/submit', uploadHandler, async (req, res) => {
    try {
        const selectedOptions = req.body.selectedOptions ? JSON.parse(req.body.selectedOptions) : [];
        const categories = req.body.categories ? JSON.parse(req.body.categories) : [];
    
        const { user_id, num, name, lvl, mode, eventDate, organisedBy, nc, endDate, sc, isOrganised, nofpart, theme, desc, obj, outcome, geocap, signcap } = req.body;
        const files = req.files;

        if (!files) {
            return res.status(400).json({ message: "No files uploaded." });
        }
        const userExists = await userModel.findById(user_id);
        if (!userExists) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        const inviteFilePaths = files.invite ? files.invite.map(file => file.filename) : [];
        const ptlistFilePaths = files.ptlist ? files.ptlist.map(file => file.filename) : [];
        const signatureFilePath = files.signature ? files.signature[0].filename : null;
        const GeoFilePaths = files.geo ? files.geo.map(file => file.filename) : [];
        
        console.log(categories);
        const newDet = new detModel({
            user: user_id, num, name, lvl, mode, eventDate, organisedBy,selectedOptions, sc, nc,
            endDate,isOrganised,categories, nofpart, theme, desc, obj, outcome, geocap,signcap,
            GeoFilePaths, inviteFilePaths, ptlistFilePaths, signatureFilePath
        });
        
        await newDet.save();
        res.status(201).json({ message: "Data submitted successfully", id: newDet._id });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});


module.exports = router;