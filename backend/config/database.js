const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;


let a = 10;
let b = 5;
let c = a + b;
console.log(c, "This is", a, b);
const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongoDB server successfully");
    })
}

module.exports = connectToMongo;