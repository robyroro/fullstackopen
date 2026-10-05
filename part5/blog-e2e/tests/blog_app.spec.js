const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright makes e2e testing easy', 'Test Writer', 'https://playwright.dev/')
      await expect(page.locator('.blog').getByText('Playwright makes e2e testing easy Test Writer')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likeable blog', 'Test Writer', 'https://example.com/like')

      const blog = page.locator('.blog').filter({ hasText: 'Likeable blog' })
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByText('likes 0')).toBeVisible()

      await blog.getByRole('button', { name: 'like' }).click()
      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('the creator can delete a blog', async ({ page }) => {
      await createBlog(page, 'Blog to be removed', 'Test Writer', 'https://example.com/remove')

      const blog = page.locator('.blog').filter({ hasText: 'Blog to be removed' })
      await blog.getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'remove' }).click()

      await expect(page.locator('.blog').filter({ hasText: 'Blog to be removed' })).toHaveCount(0)
    })
  // end of when logged in
  })
})
