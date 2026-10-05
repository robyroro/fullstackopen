import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    await handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <Box sx={{ maxWidth: 360 }}>
      <Typography variant="h5" gutterBottom>
        log in to application
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          fullWidth
          margin="dense"
        />
        <Button variant="contained" type="submit" sx={{ mt: 1 }}>
          login
        </Button>
      </form>
    </Box>
  )
}

export default LoginForm
