import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogView from './BlogView'

const blog = {
  id: '1',
  title: 'Component testing is done with react-testing-library',
  author: 'Test Author',
  url: 'https://testing-library.com/',
  likes: 7,
  user: { username: 'creator', name: 'Blog Creator', id: '42' }
}

describe('<BlogView />', () => {
  test('shows blog info and likes but no buttons to a user who is not logged in', () => {
    render(<BlogView blog={blog} user={null} />)

    expect(screen.getByText('Component testing is done with react-testing-library Test Author')).toBeVisible()
    expect(screen.getByText('https://testing-library.com/')).toBeVisible()
    expect(screen.getByText('likes 7')).toBeVisible()

    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('shows only the like button to a logged in user who is not the creator', () => {
    const otherUser = { username: 'someone', name: 'Someone Else' }
    render(<BlogView blog={blog} user={otherUser} />)

    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('shows like and remove buttons to the creator', () => {
    const creator = { username: 'creator', name: 'Blog Creator' }
    render(<BlogView blog={blog} user={creator} />)

    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
  })

  test('clicking like twice calls the event handler twice', async () => {
    const mockHandler = vi.fn()
    const loggedUser = { username: 'someone', name: 'Someone Else' }

    render(<BlogView blog={blog} user={loggedUser} handleLike={mockHandler} />)

    const user = userEvent.setup()
    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
