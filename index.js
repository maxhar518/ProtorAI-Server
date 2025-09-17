const express = require("express")
const app = express()
const db = require('./db')
const authRoutes = require('./Routes/authRoutes')
const userRoutes = require('./Routes/userRoutes')
const examRoutes = require('./Routes/examRoues')
const parserRoutes = require('./Routes/parserRoutes')
const DetectRoute = require('./Routes/Detectlogs')
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/exam', examRoutes)
app.use('/user', userRoutes)
app.use('/detect', DetectRoute)
app.use('/parser', parserRoutes)

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(3000, () => {
    console.log('Server is active');

})