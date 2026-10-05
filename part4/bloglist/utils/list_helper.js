const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav))
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = {}
  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  const author = Object.keys(counts).reduce((a, b) => (counts[b] > counts[a] ? b : a))
  return { author, blogs: counts[author] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
