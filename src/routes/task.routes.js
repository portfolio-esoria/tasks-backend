const express = require('express')
const router = express.Router()
const Task = require('../models/task.models');
const taskModels = require('../models/task.models');

//Middleware
const getTask = async(req, res, next) => {
  let task;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: 'Task ID is not valid'
    })
  }

  try {
    task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }

  res.task = task;
  next();
}

//Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await taskModels.find();
    console.log('GET ALL', tasks);
    if(tasks.length === 0){
      return res.status(204).json([])
    }
    res.json(tasks)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

//Create a new task
router.post('/', async (req, res) => {
  const {name, status, detail, creation_date, deadline_date} = req?.body
  if (!name || !status || !detail || !creation_date || !deadline_date) {
    return res.status(400).json({
      message: 'name, status, detail, creation_date, deadline_date fields are mandatory'
    })
  }
  
  const task = new Task ({
    name, 
    status, 
    detail, 
    creation_date, 
    deadline_date
  })

  try {
    const newTask = await task.save()
    console.log('POST', newTask);
    res.status(201).json(newTask)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

//Get one task by Id
router.get('/:id', getTask, async (req, res) => {
  res.json(res.task)
})


router.put('/:id', getTask, async (req, res) => {
  try {    
    const task = res.task;
    task.name = req.body.name || task.name;
    task.status = req.body.status || task.status;
    task.detail = req.body.detail || task.detail;
    task.creation_date = req.body.creation_date || task.creation_date;
    task.deadline_date = req.body.deadline_date || task.deadline_date;

    const updatedTask = await task.save();
    
    res.json(updatedTask);

  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch('/:id', getTask, async (req, res) => {

  if (!req.body.name && !req.body.status && !req.body.detail && !req.body.creation_date && !req.body.deadline_date) {
    res.status(400).json({
      message: `At least one of the fields has to be sent: name, status, detail, creation_date, deadline_date`
    })
  }

  try {    
    const task = res.task;
    task.name = req.body.name || task.name;
    task.status = req.body.status || task.status;
    task.detail = req.body.detail || task.detail;
    task.creation_date = req.body.creation_date || task.creation_date;
    task.deadline_date = req.body.deadline_date || task.deadline_date;

    const updatedTask = await task.save();
    
    res.json(updatedTask);

  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete('/:id', getTask, async (req, res) => {
  try {
    const task = res.task;
    await task.deleteOne({
      _id : task._id
    });
    res.json({
      message: `Task <${task.name}> was removed correctly`
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }

})

module.exports = router