require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, '..//Project-DogHub')));

// Database connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
db.getConnection()
    .then(() => console.log('Connected to MySQL database!'))
    .catch(err => console.error('Database connection error:', err));
    
// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.redirect('/homepage')
});

app.get('/adminlogin',(req,res) => {
    res.render('adminlogin')
})
// app.get('/login', (req, res) => {
//     res.render('login');
// });

app.get('/login', (req, res) => {
    res.render('login')
});


app.post('/userlogin', async (req,res) =>{
    const { email,password } = req.body;
    try {
        const passcheck = await db.query('SELECT * FROM user WHERE username = ? AND password = ?', [email,password] );
        if (passcheck.length > 0) {
            res.render('login',{passcheck})
        } else {
            console.log("wrong")
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
})

app.post('/regis' ,(req,res) =>{
    email = req.body.email
    password = req.body.password

    console.log(email)

    db.query("INSERT INTO user SET username = ? , password = ?",[email,password]);
    res.redirect("/login")
})
app.post('/adminlogin' ,  async (req,res) =>{
    const { username,password } = req.body;
    try {
        const passcheck = await db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username,password] );
        if (passcheck.length > 0) {
            res.render('adminlogin',{passcheck})
        } else {
            console.log("wrong")
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

app.get('/registration', (req, res) => {
    res.render('registration');
});

app.get('/homepage', async (req, res) => {
    try {
        const [dogs] = await db.query('SELECT * FROM dogs');
        res.render('homepage', { dogs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});
app.get('/search', async (req, res) => {
    const name = req.query.query;
    try {
        const [results] = await db.query('SELECT * FROM dogs WHERE name LIKE ?', [`%${name}%`]);
        res.render('search', { dogs: results });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

app.get('/admin-panel', async (req, res) => {
    try {
        const [dogs] = await db.query('SELECT * FROM appointment');
        res.render('backendap', { dogs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});
app.delete('/Appove/:email', async (req, res) => {
    try {
        await db.query("Delete FROM appointment WHERE email = ?",[req.params.email])
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating appointment');
    }
    
});

app.get('/detail/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [dogDetails] = await db.query('SELECT * FROM dogs WHERE id = ?', [id]);
        if (dogDetails.length > 0) {
            res.render('details', { dog: dogDetails[0] });
        } else {
            res.status(404).send('Dog not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

app.get('/appointment/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [dogDetails] = await db.query('SELECT * FROM dogs WHERE id = ?', [id]);
        if (dogDetails.length > 0) {
            res.render('appoinment', { dog: dogDetails[0] });
        } else {
            res.status(404).send('Dog not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }   
});

app.post('/appointment-status/:id', async (req, res) => {
    const { name, email } = req.body;   // Get the email and name from the request body
    const { id } = req.params;           // Get the dog ID from the route parameters
    
    console.log(email);
    console.log(name);
    
    try {
        // Insert the appointment record into the appointment table
        await db.query(`
            INSERT INTO appointment (user ,email, name, age, breed, color, health_status, blood_type, medical_history, imageUrl)
            SELECT ?, ?, name, age, breed, color, health_status, blood_type, medical_history, imageUrl
            FROM dogs WHERE id = ?`, 
            [email, name, id]  // Bind the values: email, name, and id
        );
        
        // Send the success page after successful insert
        res.sendFile(path.join(__dirname, '/html', 'appointsucess.html'));
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating appointment');
    }
});


app.get('/approval-status', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/appstatus.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
