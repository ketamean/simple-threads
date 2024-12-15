# Layouts
- LayoutWelcome (no footer): Log in, Sign up, Reset password.
- LayoutSurfing: others.
- Remember to pass in css files (filename, extension included) as an array.
```js
app.get('login', (req, res) => {
    res.locals.css = ['login.css', 'password.css']
})
```
- All `.css` file must be put in `/static/css`
- When invoking *layoutSurfing*, we must give the page name so that it can active the icon on the footer: *tab_feed*, *tab_createPost*, *tab_notifications*, *tab_profile*.
```js
app.get('/feed', (req, res) => {
  res.locals.tab_feed = true
  res.render('feed')
})

app.get('/notifications', (req, res) => {
  res.locals.tab_notifications = true
  res.render('notifications')
})
```
# Post
Essential metadata for 1 post
- username
- userId
- avatarImagePath
- date
- content
- postImagePaths (iterative, if exists): `['1.png', 'hehe.png']` | not given
- nLikes: str
- nComments: str
- liked:
  - 'true' if the user has reacted to the post
  - otherwise, not given
# Feeds
Metadata for posts to be displayed ([Post](#post))
```js
res.locals.metadata = [
  {
    username,
    userId,
    avatarImagePath,
    date,
    content,
    postImagePaths: ['aldl.png', 'kjkd.jpg'],
    nLikes,
    liked: true
  },
  {
    username,
    userId,
    avatarImagePath,
    date,
    content,
    nLikes // has not liked, 0 images
  },
  {
    username,
    userId,
    avatarImagePath,
    date,
    content,
    postImagePaths: ['1312.png'],
    nLikes
  },
]
```
# Profile
- Use for both cases:
  - User views their own profile
  - User views other users' profile
- Essential metadata:
  - username
  - avatarImagePath
  - posts:
    ```js
      posts = [
        {
          username,
          avatarImagePath,
          date,
          content,
          postImagePaths: `['1.png', 'hehe.png']`,
          nLikes,
          nComments,
          liked: true
        },
        {
          username,
          avatarImagePath,
          date,
          content,
          nLikes,
          nComments,
          // has not been liked yet, has no images
        },
      ]
    ```
  <!-- - personal: true if a user see their own profile; false, otherwise. -->
  - bio
# Comments
## Comment
Essential metadata for 1 comment
- avatarImagePath
- username
- userId
- date
- content
## Show all comments in a post
- Passed in as an array of objects
```js
app.get('/comments', (req, res) => {
  res.locals.post = {username, avatarImagePath, date,...}
  res.locals.comments = [
    {avatarImagePath, username, userId, date, content},
    {avatarImagePath, username, userId, date, content},
    {avatarImagePath, username, userId, date, content},
  ]
})
```
# Notifications
## One notification
- username: the user (other than this user) who relates to this comment 
- userId: userId of the above username
- avatarImagePath
- one of the followings:
  - comment: `true` if this notification is "${username} commented on your post"; otherwise, it will not be given
  - like: `true` if this notification is "${username} liked your post"; otherwise, it will not be given
  - follow: `true` if this notification is "${username} started to follow you"; otherwise, it will not be given
- link:
  - if the notification relates to a post, this attribute will contain the link to the post-comment page. In case the notification relates to commenting, the comment will be bublled to the top of the list of comments
  - if the noti relates to a user, this attribute will contain the link to the user profile
- date
- read: `true` or `false`
## List of notifications
- params to passed to `views/notifications.hbs`.
```js
notifications = [
  {
    username, userId, avatarImagePath, follow: true, link: '/profile/4', date, read: false
  },
  {
    username, userId, avatarImagePath, like: true, link: '/post/13395', date, read: false
  },
  {
    username, userId, avatarImagePath, comment: true, link: '/post/2930', date, read: false
  },
]
```
# Create post
```js
res.locals.username = 'ketamean'
```