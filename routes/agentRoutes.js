const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const agentsController = require('../controllers/agentsController');
const verifyToken = require('../middleware/verifyToken');
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
    verifyToken,
    upload.single('file'), // field name in your <input type="file" name="file" />
    AgentController.uploadAgentsFromExcel.bind(AgentController)
);

router.get(
    '/report', // field name in your <input type="file" name="file" />
    verifyToken,
    AgentController.getAllAgents.bind(AgentController)
);

router.get(
    '/agents', // field name in your <input type="file" name="file" />
    verifyToken,
    AgentController.getFilteredResults.bind(AgentController)
);

router.post('/register', AgentController.register.bind(AgentController));
router.post('/login', AgentController.login.bind(AgentController));
router.post('/logout', verifyToken, AgentController.logout.bind(AgentController));
router.get('/upload', verifyToken, (req, res)=> {
    res.render('upload');
})

router.get('/report', verifyToken, (req, res)=> {
    res.render('report');
})

module.exports = router;