const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const agentsController = require('../controllers/agentsController');
const AgentController = new agentsController();

const upload = multer({
    dest: 'uploads/', // folder to store temporary uploads
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const filetypes = /xlsx|xls|csv/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Only Excel files (.xlsx or .xls) are allowed.'));
    }
});

router.post(
    '/upload',
    upload.single('file'), // field name in your <input type="file" name="file" />
     AgentController.uploadAgentsFromExcel.bind(AgentController)
);

router.get(
    '/report', // field name in your <input type="file" name="file" />
     AgentController.getAllAgents.bind(AgentController)
);

router.get(
    '/agents', // field name in your <input type="file" name="file" />
     AgentController.getFilteredResults.bind(AgentController)
);

module.exports = router;