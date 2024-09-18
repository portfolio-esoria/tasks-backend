const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const taskRoutes = require('./routes/task.routes')
const { config } = require('dotenv')
config()

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;

app.use('/tasks', taskRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server started in port ${port}`)
})