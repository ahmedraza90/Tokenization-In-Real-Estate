require('dotenv').config();
const connectToMongo = require('./db')
const path = require('path')
const express = require("express")
var cors = require('cors') 
const bodyParser = require("body-parser")
connectToMongo();

const app = express()
const PORT = process.env.PORT


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', '*')
    next()
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/property', require('./routes/addproperty'))
app.use('/api/upload',  require('./routes/uploadRoutes'))
app.use("/api", require('./routes/buyer'))
app.use("/search", require('./routes/searchRoute'))

app.use("/public", express.static('public'))

app.get("/",(req,res)=>{
    res.json("server start")
})

app.listen(PORT , ()=>{
    console.log(`app listening at http://localhost:${PORT}`)
})