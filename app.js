const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieparser = require('cookie-parser');
const configureSession = require('./middleware/sessionMiddleware');
require('dotenv').config();
const agentRoutes = require('./routes/agentRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieparser());
configureSession(app);

app.set('view engine', 'ejs');
app.set('View', path.join(__dirname, 'views'))

app.get('/upload', (req, res)=> {
    res.render('upload');
})

app.get('/', (req, res) => {
    res.render('login', { error: null, success: null });
});

app.get('/register', (req, res) => {
    res.render('register', { error: null, success: null });
});

app.get('/report', (req, res)=> {
    res.render('report');
});

app.get('/session-data', (req, res) => {
    res.json(req.session);
});

app.get('/cookie-data', (req, res) => {
    res.json(req.cookies);
});

app.use('/agent', agentRoutes);

const PORT = process.env.PORT || 3009;

app.listen(PORT, () =>{
    console.log(`Application is running on http://localhost:${PORT}`)
});