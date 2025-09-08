const express = require("express")
const app = express()
const db = require('./db')
const authRoute = require('./Routes/authRoutes')
const userRoute = require('./Routes/userRoutes')
app.use(express.json())

app.use('/auth', authRoute)
app.use('/users', userRoute)

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(3000, () => {
    console.log('Server is active');

})