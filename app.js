const express = require('express');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const agentRoutes = require('./routes/agentRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('View', path.join(__dirname, 'views'))

app.get('/', (req, res)=> {
    res.render('upload');
})

app.get('/report', (req, res)=> {
    res.render('report');
})

app.use('/agent', agentRoutes);

const PORT = process.env.PORT || 3009;

app.listen(PORT, () =>{
    console.log(`Application is running on http://localhost:3000`)
});