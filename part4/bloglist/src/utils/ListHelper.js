const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer,0);
};

const favoriteBlog = (blogs) =>{
  const max = Math.max(...blogs.map(blog=> blog.likes))
  const favorite = blogs.find(blog=>blog.likes==max);
  return {
    title:favorite.title,
    author:favorite.author,
    likes:favorite.likes
  }
}

const mostBlogs = (blogs) => {
  const groupByAuthor = blogs.reduce((group, blog) => {
    const { author } = blog;
      group[author] = group[author] ?? {};
      const blogs = group[author].blogs ?? 0;
      group[author].author = author;
      group[author].blogs = blogs +1;
    return group;
  }, []);
  const authors = Object.values(groupByAuthor)
  const max = authors.reduce((prev, current)=>{
    return prev.blogs > current.blogs ? prev : current
  },{})
  return max;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  initialBlogs
};
