// Import required modules
const express = require('express');
const path = require('path');
const app = express();
const log = console.log;
const User = require('./models/user');
const { spawn } = require('child_process');

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
app.get('/login', (req, res)=>{
    res.render('login');
});
app.post('/validate', async (req, res)=>{
    console.log(req.body);
    let {email, password} = req.body;
    let user = await User.findOne({email});
    if(user){
        if(user.password === password){
            res.status(200).json({ message: 'Login successful' });
        }
        else{
            res.status(401).json({ message: 'Invalid password' });
        }
    }
    else{
        res.status(404).json({ message: 'User not found' });
    }
});

app.get('/chat', (req, res)=>{
    console.log('Chat page accessed');
    res.render('chat');
});

app.post('/chat/process', (req, res)=>{
    const userInput = req.body.prompt;
    const pythonProcess = spawn('python3', ['app.py']);

    // Send user input to Python
    pythonProcess.stdin.write(JSON.stringify({ prompt: userInput }));
    pythonProcess.stdin.end();

    // Collect Python's output
    let data = '';
    pythonProcess.stdout.on('data', chunk => (data += chunk));
    pythonProcess.stdout.on('end', () => {
        const response = JSON.parse(data).response;
        res.json({ response });
    });

    pythonProcess.stderr.on('data', err => {
        console.error('Python Error:', err.toString());
        res.status(500).json({ error: 'Error in chatbot process' });
    });
    pythonProcess.on('close', code => {
        console.log(`Python process exited with code ${code}`);
    });
});

app.listen(3000, ()=>{
    log('Server is running on port 3000');
});