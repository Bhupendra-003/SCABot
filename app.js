// Import required modules
const express = require('express');
const path = require('path');
const app = express();
const log = console.log;
const User = require('./models/user');

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
app.post('/create',async (req, res)=>{
    console.log(req.body);
    if(await User.findOne({email: req.body.email})){
        return res.status(409).json({ message: 'Email already exists' });
    }
    let {name, email, password} = req.body;
    await User.create({
        name,
        email,
        password
    });
    res.status(201).json({ message: 'User created successfully' });
});

app.listen(3000, ()=>{
    log('Server is running on port 3000');
});