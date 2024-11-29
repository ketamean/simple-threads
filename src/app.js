const express = require('express')
const expHbs = require('express-handlebars')
const app = express()
const port =  3000
const {loginMetadata} = require('./metadata.js')

app.engine(
    "hbs",
    expHbs.engine({
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
        extname: "hbs",
        defaultLayout: 'layoutSurfing'
    })
)
///////////////////////////
// Middlewares used for retrieving data from a POST request
app.use(express.json())
app.use(express.urlencoded({extended: false}))
///////////////////////////

app.set('view engine', 'hbs')
app.use(express.static(__dirname +  '/static'))

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login', {layout: 'layoutWelcome'})
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

// app.get('/signup', (req, res) => {
//     res.render('signup', {layout: 'layoutWelcome'})
// })

// app.get('/reset-password', (req, res) => {
//     res.render('reset-password', {layout: 'layoutWelcome'})
// })

app.get('/feeds', (req, res) => {
    res.locals.id = [1,2,3,4,5]
    res.render('feeds')
})

app.listen(port, () => {
    console.log('Server is listening on port ', port)
})