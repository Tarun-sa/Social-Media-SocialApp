const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')

// to access the content inside req.body using this middleware
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("<h1>hello world</h1>")
})

// for using route we write app.use(initail path, location of the file)

// for post
app.use("/api/v1", require('./routes/post'))
// for user
app.use('/api/v1', require('./routes/user'))




module.exports = app;