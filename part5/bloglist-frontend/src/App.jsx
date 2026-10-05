import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()
  const navigate = useNavigate()

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
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(returnedBlog))
      notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
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
    } catch (error) {
      notify(error.response?.data?.error || 'removing the blog failed', 'error')
    }
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {user
          ? <span>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </span>
          : <Link style={padding} to="/login">login</Link>
        }
      </div>

      <h2>blogs</h2>
      <Notification notification={notification} />

      <Routes>
        <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
        <Route path="/" element={
          <div>
            {user && (
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
              </Togglable>
            )}

            {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={likeBlog}
                handleRemove={removeBlog}
                currentUser={user}
              />
            )}
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
