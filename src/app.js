const express = require('express')
const expHbs = require('express-handlebars')
// const {route} = require('./routes')
const app = express()
const port = 3000
const domainname = 'localhost'

app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/src/static'))
app.engine(
    'hbs',
    expHbs.engine({
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
        extname: 'hbs',
        defaultLayout: 'layout'
    })
)
// console.log(__dirname + '/src/views/layouts')
app.get('/', (req, res) => {
    res.render(__dirname + '/views/index', {
        layout: ''
    })
})

app.listen(port, () => {
    console.log(`Server is listening on ${domainname}:${port}`)
})