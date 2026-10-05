import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Typography variant="h5" gutterBottom>
        create new
      </Typography>
      <form onSubmit={addBlog}>
        <TextField
          label="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="title"
          fullWidth
          margin="dense"
        />
        <TextField
          label="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="author"
          fullWidth
          margin="dense"
        />
        <TextField
          label="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder="url"
          fullWidth
          margin="dense"
        />
        <Button variant="contained" type="submit" sx={{ mt: 1 }}>
          create
        </Button>
      </form>
    </Box>
  )
}

export default BlogForm
