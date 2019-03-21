import * as express from 'express'
import document from './document'

const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!!');
})

app.get('/pdf', function (req, res) {
    res.setHeader('Content-disposition', 'inline; filename="hello.pdf"')
    res.setHeader('Content-Type', 'application/pdf')
    document(res)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});