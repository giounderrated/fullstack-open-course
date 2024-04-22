import { useState } from 'react'

export const BlogForm = ({ createBlog }) => {
  const [createBlogForm, setCreateBlogForm] = useState({
    title: '',
    author: '',
    url: '',
    likes: 0,
  })

  const onCreateBlog = async (event) => {
    event.preventDefault()
    createBlog(createBlogForm)
    setCreateBlogForm({
      title: '',
      author: '',
      url: '',
      likes: 0,
    })
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setCreateBlogForm({
      ...createBlogForm,
      [name]: value,
    })
  }

  return (
    <form className='formDiv'  onSubmit={onCreateBlog}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={createBlogForm.title}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={createBlogForm.author}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="url">URL:</label>
        <input
          type="text"
          id="url"
          name="url"
          value={createBlogForm.url}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="likes">Likes:</label>
        <input
          type="number"
          id="likes"
          name="likes"
          value={createBlogForm.likes}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
