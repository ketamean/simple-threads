let controller = {}

controller.showLoginPage = function(req, res) {
    res.render('login', {layout: 'layoutWelcome'})
}

controller.login = function (req, res) {
    res.render('newsfeed')
}