import { Link } from 'react-router-dom'
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'

const BlogList = ({ blogs }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
            <TableRow key={blog.id} className="blog">
              <TableCell>
                <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
              </TableCell>
              <TableCell align="right">{blog.likes} likes</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BlogList
