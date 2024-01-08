import { useState } from "react";
import blogs from "../services/blogs";
import PropTypes from "prop-types";

export const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? "" : "none" };

  const buttonLabel = visible ? "Hide Details" : "Show Details"

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async (event) => {
    event.preventDefault();
    blog.likes++;
    const returned = await blogs.update(blog);
    onLike(returned);
  };

  const canDelete = () => {
    return blog.user.name === currentUser.name;
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const confirmation = window.confirm(
      "Are you sure you want to remove the blog" + blog.title
    );
    if (!confirmation) return;
    await blogs.remove(blog.id);
    onDelete(blog.id);
  };

  return (
    <div style={blogStyle}>
      <p className="blog-author">
        {blog.title} - {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {buttonLabel}
        </button>
      </p>

      <div className="blog-details" style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          {blog.likes} <button onClick={handleLike}>Like</button>
        </p>
        <p>{blog.user.name}</p>
      </div>
      {canDelete() && <button onClick={handleDelete}>Remove</button>}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
