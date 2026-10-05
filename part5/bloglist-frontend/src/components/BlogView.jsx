const BlogView = ({ blog, user, handleLike, handleRemove }) => {
  if (!blog) {
    return null
  }

  const isCreator = user && blog.user && blog.user.username === user.username

  return (
    <div className="blogView">
      <h2>{blog.title} {blog.author}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes}{' '}
        {user && <button onClick={() => handleLike(blog)}>like</button>}
      </div>
      <div>added by {blog.user?.name}</div>
      {isCreator && (
        <button onClick={() => handleRemove(blog)}>remove</button>
      )}
    </div>
  )
}

export default BlogView
