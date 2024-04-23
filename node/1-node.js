const express = require('express')
const app = express()
const cors = require('cors')

let { notes } = require('../data/data')
const logger = require('../middlewares/logger')
const miduLogger = require('../middlewares/miduLogger')

app.use(cors())

// parse json
app.use(express.json())

app.use([logger, miduLogger])

app.get('/', logger, (req, res) => {
  res.send('<h1>Hello People</h1>')
})

app.get('/api/notes', logger, (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const note = notes.find(note => note.id === Number(id))
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
  console.log('my req.params:', req.params)
})

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params
  notes = notes.filter(note => note.id !== Number(id))
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const { content, important } = req.body
  if (!content) {
    return res
      .status(400)
      .json({ success: false, msg: 'please provide the content of the note' })
  }

  const newNote = {
    id: notes.length + 1,
    content,
    date: new Date().toISOString(),
    important: typeof important === 'undefined' ? important : false
  }

  notes = [...notes, newNote]

  res.status(201).send({ success: true, note: newNote })
})

app.patch('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const { content } = req.body

  const note = notes.find((note) => note.id === Number(id))

  if (!note) {
    return res
      .status(404)
      .json({ success: false, msg: `no person with id ${id}` })
  }

  const newNotes = notes.map(note => {
    if (note.id === Number(id)) {
      note.content = content
    }
    return note
  })

  res.status(200).json({ success: true, data: newNotes })
})

app.use((req, res) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
