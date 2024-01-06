import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/loginService'
import { Notification } from './components/Notification'
import { Error } from './components/Error'
import { LoginForm } from './components/LoginForm'
import Toggable from './components/Toggable'
import { BlogForm } from './components/BlogForm'
import { Blog } from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const createBlogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.sort((a,b) => a.likes-b.likes)))
  }, [])

  const handleLogin = async (loginForm) => {
    try {
      const user = await loginService.login(loginForm)
      setUser(user)
      loginService.saveUserDetails(user)
      blogService.setToken(user.token)
    } catch (exception) {
      setError('Wrong credentials')
      setTimeout(() => setError(''), 5000)
    }
  }

  const onLogout = (event) => {
    event.preventDefault()
    loginService.logout()
    setUser(null)
  }

  const createBlog = async(newBlog) => {
    try {
      await blogService.create(newBlog)
      createBlogFormRef.current.toggleVisibility()
      setMessage(`Blog ${newBlog.title} added`)
      setTimeout(() => setMessage(''), 5000)
      await blogService.getAll().then((blogs) => setBlogs(blogs))
    } catch (exception) {
      setError('There was a problem during creation')
      setTimeout(() => setError(''), 5000)
    }
  }

  const onLike = (updatedBlog) => {
    setBlogs(prevBlogs => {
      const index = blogs.findIndex(blog => blog.id === updatedBlog.id)
      if (index !== -1) {
        const newBlogs = [...prevBlogs]
        newBlogs[index] = {
          ...newBlogs[index],
          likes:updatedBlog.likes
        }
        return newBlogs.sort((a,b) => a.likes-b.likes)
      }
      return prevBlogs
    })
  }

  const onDelete = (blogId) => {
    setBlogs(prevBlogs => {
      return prevBlogs.filter(blog => blog.id!==blogId)
    })
  }

  return (
    <div>
      <Notification message={message} />
      <Error error={error} />

      {!user && (
        <Toggable buttonLabel={'Login'}>
          <LoginForm login={handleLogin}/>
        </Toggable>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={(event) => onLogout(event)}>Logout</button>
          </p>
          <div>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} onLike={onLike} onDelete={onDelete} />
            ))}
          </div>
          <Toggable buttonLabel={'New Blog'} ref={createBlogFormRef}>
            <BlogForm
              createBlog={createBlog}
            />
          </Toggable>
        </div>
      )}
    </div>
  )
}

export default App
