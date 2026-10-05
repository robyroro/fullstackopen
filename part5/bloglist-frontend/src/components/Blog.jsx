import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const showRemove = currentUser && blog.user && blog.user.username === currentUser.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className="blogDetails">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {showRemove && (
            <button onClick={() => handleRemove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
