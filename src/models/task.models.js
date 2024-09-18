const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    name: String,
    status: String,
    detail: String,
    creation_date:  String,
    deadline_date: String
  }
)


module.exports = mongoose.model('Task', taskSchema)