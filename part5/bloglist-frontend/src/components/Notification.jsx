import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <Alert severity={notification.type} sx={{ my: 2 }}>
      {notification.message}
    </Alert>
  )
}

export default Notification
