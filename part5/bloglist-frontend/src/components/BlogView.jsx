import { Card, CardContent, CardActions, Typography, Button, Link } from '@mui/material'

const BlogView = ({ blog, user, handleLike, handleRemove }) => {
  if (!blog) {
    return null
  }

  const isCreator = user && blog.user && blog.user.username === user.username

  return (
    <Card className="blogView" sx={{ maxWidth: 640 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {blog.title} {blog.author}
        </Typography>
        <Link href={blog.url} target="_blank" rel="noreferrer" sx={{ wordBreak: 'break-all' }}>
          {blog.url}
        </Link>
        <Typography sx={{ mt: 2 }}>likes {blog.likes}</Typography>
        <Typography variant="body2" color="text.secondary">
          added by {blog.user?.name}
        </Typography>
      </CardContent>
      {user && (
        <CardActions>
          <Button variant="contained" size="small" onClick={() => handleLike(blog)}>
            like
          </Button>
          {isCreator && (
            <Button color="error" size="small" onClick={() => handleRemove(blog)}>
              remove
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  )
}

export default BlogView
