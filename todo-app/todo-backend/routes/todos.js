const redis = require('../redis')
const express = require('express')
const { Todo } = require('../mongo')
const router = express.Router()

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos)
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  })
  const savedTodo = await todo.save()
  const currentCount = await redis.get('added_todos')
  const newCount = Number(currentCount || 0) + 1
  await redis.set('added_todos', newCount)

  res.send(savedTodo)
})

const singleRouter = express.Router()

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.deleteOne()
  res.sendStatus(200)
})

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo) // Implement this
})

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  req.todo.text = req.body.text
  req.todo.done = req.body.done

  const updatedTodo = await req.todo.save()
  res.send(updatedTodo) // Implement this
})

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router
