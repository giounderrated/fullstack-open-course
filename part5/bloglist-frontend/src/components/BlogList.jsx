import Blog from "./Blog";
export const BlogList = ({blogs, onLike}) => {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} onLike={onLike}/>
      ))}
    </div>
  );
};
