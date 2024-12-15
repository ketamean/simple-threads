const express = require('express')
const expHbs = require('express-handlebars')
const app = express()
const port =  3000
const { md_login, md_signup, md_resetPassword, md_feed } = require('./metadata.js')

app.engine(
    "hbs",
    expHbs.engine({
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
        extname: "hbs",
        defaultLayout: 'layoutSurfing',
        defaultView: __dirname + '/views/pages'
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
    res.locals.css = md_login.css
    res.render('login', {layout: 'layoutWelcome'})
})

app.get('/signup', (req, res) => {
    res.locals.css = md_signup.css
    res.render('signup', {layout: 'layoutWelcome'})
})

// app.get('/signup', (req, res) => {
//     res.render('signup', {layout: 'layoutWelcome'})
// })

app.get('/reset-password', (req, res) => {
    res.locals.css = md_resetPassword.css
    res.render('reset-password-set', {layout: 'layoutWelcome'})
})

app.get('/feed', (req, res) => {
    res.locals.css = md_feed.css
    res.locals.metadata = [
        {
            username: 'A',
            avatarImagePath: '',
            date: '1/1/2024',
            content: 'hello',
            nLikes: '30',
            nComments: '20'
        },
        {
            username: 'K',
            avatarImagePath: '',
            date: '1/1/2024',
            content: 'hello',
            postImagePaths: ['1.png', 'hehe.png'],
            nLikes: '30',
            nComments: '20'
        },
        {
            username: 'B',
            avatarImagePath: '',
            date: '1/1/2024',
            content: 'hello',
            postImagePaths: ['1.png', 'hehe.png'],
            nLikes: '30',
            nComments: '20'
        }
    ]
    res.locals.tab_feed = true
    res.render('feed')
})

app.get('/notifications', (req, res) => {
    res.locals.notifications = []

    res.locals.tab_notifications = true

    res.render('notifications')
})

app.listen(port, () => {
    console.log('Server is listening on port ', port)
})