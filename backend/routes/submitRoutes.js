const express = require("express");
const multer=require("multer");
//const sharp = require("sharp"); -> helps to convert one file type to another
const router = express.Router();
const path=require("path");
const db = require("../db");

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
    { name: 'signature', maxCount: 1 },
    { name: 'cert', maxCount: 1 },
    { name: 'fback', maxCount: 10 }
]);

router.post('/submit', uploadHandler, async (req, res) => {
    try {
        const selectedOptions = req.body.selectedOptions ? JSON.parse(req.body.selectedOptions) : [];
        const categories = req.body.categories ? JSON.parse(req.body.categories) : [];
    
        const {
            user_id, num, name, lvl, mode, eventDate, organisedBy, nc, endDate,
            venue, isOrganised, nofpart, theme, desc, obj, outcome, geocap, signcap
        } = req.body;

        const files = req.files;

        // Validate user ID
        const [user] = await db.query("SELECT idusers FROM users WHERE idusers = ?", [user_id]);
        if (user.length === 0) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        const data = {
            user_id,
            num,
            name,
            lvl,
            mode,
            eventDate,
            organisedBy,
            selectedOptions: JSON.stringify(selectedOptions),
            venue,
            nc,
            endDate,
            isOrganised,
            categories: JSON.stringify(categories),
            nofpart,
            theme,
            description: desc,
            objective: obj,
            outcome,
            geocap,
            signcap,
            geo_files: JSON.stringify(files.geo?.map(f => f.filename) || []),
            invite_files: JSON.stringify(files.invite?.map(f => f.filename) || []),
            ptlist_files: JSON.stringify(files.ptlist?.map(f => f.filename) || []),
            signature_file: files.signature?.[0]?.filename || null,
            cert_file: files.cert?.[0]?.filename || null,
            fback_files: JSON.stringify(files.fback?.map(f => f.filename) || [])
        };

        const insertQuery = `
            INSERT INTO event_details 
            (user_id, num, name, lvl, mode, eventDate, organisedBy, selectedOptions, venue, nc,
             endDate, isOrganised, categories, nofpart, theme, \`desc\`, obj, outcome,
             geocap, signcap, GeoFilePaths, inviteFilePaths, ptlistFilePaths, signatureFilePath, certFilePath, fbackFilePaths)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = Object.values(data);

        const [result] = await db.query(insertQuery, values);

        res.status(201).json({ message: "Data submitted successfully", id: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;