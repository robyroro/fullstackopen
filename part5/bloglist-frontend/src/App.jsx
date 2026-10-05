import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useNavigate, useMatch } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography, Box } from '@mui/material'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      navigate('/')
    } catch (error) {
      notify(error.response?.data?.error || 'creating the blog failed', 'error')
    }
  }

  const likeBlog = async (blog) => {
    const updatedBlog = {
      user: blog.user?.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    // keep the user info, the response might only contain the user id
    setBlogs(blogs.map(b => b.id !== blog.id ? b : { ...returnedBlog, user: blog.user }))
  }

  const removeBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      notify(`removed blog ${blog.title}`)
      navigate('/')
    } catch (error) {
      notify(error.response?.data?.error || 'removing the blog failed', 'error')
    }
  }

  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/create">
              create new
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {user
            ? <>
              <Typography component="em" sx={{ mr: 1 }}>{user.name} logged in</Typography>
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                logout
              </Button>
            </>
            : <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          }
        </Toolbar>
      </AppBar>

      <Typography variant="h4" sx={{ my: 2 }}>blogs</Typography>
      <Notification notification={notification} />

      <Routes>
        <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
        <Route path="/blogs/:id" element={
          <BlogView
            blog={blog}
            user={user}
            handleLike={likeBlog}
            handleRemove={removeBlog}
          />
        } />
        <Route path="/create" element={
          user ? <BlogForm createBlog={addBlog} /> : <Navigate replace to="/login" />
        } />
        <Route path="/" element={<BlogList blogs={blogs} />} />
      </Routes>
    </Container>
  )
}

export default App
