let controller = {}

controller.show = function(req, res) {
    res.locals.css = ['login.css']
    res.render('login', {layout: 'layoutWelcome'})
}

controller.login = function (req, res) {
    res.locals.css = ['post.css', 'header.css', 'footer.css']
    res.render('feeds')
}

module.exports = controller