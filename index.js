const express = require("express")
const app = express()
const db = require('./db')
const authRoutes = require('./Routes/authRoutes')
const userRoutes = require('./Routes/userRoutes')
const examRoutes = require('./Routes/examRoues')
const parserRoutes = require('./Routes/parserRoutes')
// const cors = require('cors');

// const corsOptions = {
//     origin: 'http://localhost:8080',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));
app.use(express.json());

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/parser', parserRoutes)
app.use('/exam', examRoutes)

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(3000, (err) => {
    if (err) {
        console.error("Error starting server:", err);
        return;
    }
    console.log(`Server is running on port 3000`);
});
