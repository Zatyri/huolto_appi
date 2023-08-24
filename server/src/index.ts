import express from 'express';
const app = express()

const PORT = 3001

app.get('/api/v1/helloworld', (request, response) => {
  response.send("Hello world")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})