// Import required modules
const express = require('express');
const path = require('path');
const app = express();
const log = console.log;

// Set up Express middleware and configurations
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    res.render('index');
});
app.get('/register', (req, res)=>{
    res.render('register');
});

app.listen(3000, ()=>{
    log('Server is running on port 3000');
});