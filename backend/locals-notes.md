# Layouts
- LayoutWelcome (khong co footer): Log in, Sign up, Reset password.
- LayoutSurfing (co ca heade & footer): others.
- Remember to pass in css files (filename, extension included) as an array.
```js
app.get('login', (req, res) => {
    res.locals.css = ['login.css', 'password.css']
})
```
- All `.css` file must be put in `/static/css`
# Post
Essential metadata for 1 post
- username: str
- avatarImagePath: str
- date: str
- content: str
- postImagePaths (iterative, if exists): `['1.png', 'hehe.png']` | not given
- nLikes: str
- nComments: str
- liked:
  - 'true' if the user has reacted to the post
  - otherwise, not given
# Comment
Essential metadata for 1 comment
- avatarImagePath
- username
- date
- content
- nLikes
# Feeds
Metadata for posts to be displayed ([Post](#post))
```js
res.locals.metadata = [
  {username, avatarImagePath, date,...},
  {username, avatarImagePath, date,...},
  {username, avatarImagePath, date,...}
]
```
# Profile
- Use for both cases:
  - User views their own profile
  - User views other users' profile