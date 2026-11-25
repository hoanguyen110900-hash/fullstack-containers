const redis = require('../redis')
const express = require('express')
const router = express.Router()

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  res.send('Hello from Docker development!')
  //visits++
  //res.send({
  //  ...configs,
  //  visits,
  //})
})

router.get('/statistics', async (req, res) => {
  const count = await redis.get('added_todos')

  res.json({
    added_todos: Number(count || 0),
  })
})

module.exports = router
