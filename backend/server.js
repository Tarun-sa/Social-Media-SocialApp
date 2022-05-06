const app = require('./app');
var cloudinary = require('cloudinary').v2;
require("dotenv").config({ path: "backend/config/config.env" });

cloudinary.config({
    cloud_name: "tarunmern",
    api_key: "235234422972233",
    api_secret: "eKnVfVh7YCkN8mnhTbzj2Q5d8Cg",
});


// connection to database
const connectToMongo = require('./config/database');
connectToMongo();


app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
})