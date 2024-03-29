const User = require('../models/User.model')

const initialBlogs = [
  {
    id:"5a422a851b54a676234d17f7",
    title:"React patterns",
    author:"Michael Chan",
    url:"https://reactpatterns.com/",
    likes:7
  },
  {
    id:"5a422aa71b54a676234d17f8",
    title:"Go To Statement Considered Harmful",
    author:"Edsger W. Dijkstra",
    url:"http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes:5
  }
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
  const max =blogs.reduce((prev,current)=>{
    return prev.likes>current.likes ? prev:current
  },{})
  return max
}

const mostBlogs = (blogs) => {
  const groupByAuthor = blogs.reduce((group, blog) => {
    const { author } = blog;
      if (!group[author]) {
        group[author] = { author, blogs: 0 };
      }
    group[author].blogs++;
    return group;
  }, []);
  const authors = Object.values(groupByAuthor)
  const max = authors.reduce((prev, current)=>{
    return prev.blogs > current.blogs ? prev : current
  },{})
  return max;  
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  initialBlogs,
  usersInDb
};
