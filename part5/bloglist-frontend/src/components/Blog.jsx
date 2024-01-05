import { useState } from "react";
import blogs from "../services/blogs";
const Blog = ({ blog, onLike }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async(event) =>{
    event.preventDefault()
    blog.likes++;
    const returned = await blogs.update(blog)
    onLike(returned)
  }

  return (
    <div style={blogStyle}>
      <h3>
        {blog.title}
        <button onClick={() => setVisible(!visible)}>
          {visible ? "Hide Details" : "Show Details"}
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
    </div>
  );
};

export default Blog;
