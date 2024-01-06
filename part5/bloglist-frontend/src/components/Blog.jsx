import { useState } from 'react'
import blogs from '../services/blogs'
import loginService from '../services/loginService'
export const Blog = ({ blog, onLike, onDelete }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = async(event) => {
    event.preventDefault()
    blog.likes++
    const returned = await blogs.update(blog)
    onLike(returned)
  }

  const canDelete = () => {
    const user = loginService.getLoggedUser()
    return blog.user.name === user.name
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    const confirmation =  window.confirm('Are you sure you want to remove the blog'+blog.title)
    if(!confirmation) return
    await blogs.remove(blog.id)
    onDelete(blog.id)
  }

  return (
    <div style={blogStyle}>
      <h3>
        {blog.title}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'Hide Details' : 'Show Details'}
        </button>
      </h3>
      {visible && (
        <div>
          <h5>Author: {blog.author}</h5>
          <p>Url: {blog.url}</p>
          <p>Likes: {blog.likes} <button onClick={handleLike}>Like</button></p>
          <p>Created by {blog.user.name}</p>

        </div>
      )}
      {canDelete() &&  <button onClick={handleDelete} >Remove</button>}
    </div>
  )
}

