import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  id: '1',
  title: 'Component testing is done with react-testing-library',
  author: 'Test Author',
  url: 'https://testing-library.com/',
  likes: 7,
  user: { username: 'tester', name: 'Test User', id: '42' }
}

test('renders title and author but not url or likes by default', () => {
  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Component testing is done with react-testing-library')
  expect(div).toHaveTextContent('Test Author')

  expect(screen.queryByText('https://testing-library.com/')).toBeNull()
  expect(screen.queryByText('likes 7')).toBeNull()
  expect(container.querySelector('.blogDetails')).toBeNull()
})

test('shows url and likes after clicking the view button', async () => {
  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const details = container.querySelector('.blogDetails')
  expect(details).toHaveTextContent('https://testing-library.com/')
  expect(details).toHaveTextContent('likes 7')
})
