const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://mazhar518:mazhar518@atlascluster.gpt1hrj.mongodb.net/todoApp")
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err))

const db = mongoose.connection

db.on('Connected', () => {
    console.log('DB connected');

})
db.on("error", () => {
    console.log('error in DB');

})

db.on('Disconnected', () => {
    console.log('DB Disconnected');

})

module.exports = db