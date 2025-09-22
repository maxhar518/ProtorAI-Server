const express = require("express")
const app = express()
const db = require('./db')
const authRoutes = require('./Routes/authRoutes')
const userRoutes = require('./Routes/userRoutes')
// const examRoutes = require('./Routes/examRoues')
const parserRoutes = require('./Routes/parserRoutes')
// const imageMiddleware = require('./middleWares/imageMiddleware')
// const captureAndAnalyze = require('./middleWares/DetectMiddleware')
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:8080', // Allow only frontend domain
    methods: ['GET', 'POST'],       // Allow only specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only certain headers
};

app.use(cors(corsOptions));

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/parser', parserRoutes)
// app.use('/exam', captureAndAnalyze, examRoutes)

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
