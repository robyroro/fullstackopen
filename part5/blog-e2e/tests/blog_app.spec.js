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

  test('Login form can be opened', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright makes e2e testing easy', 'Test Writer', 'https://playwright.dev/')
      await expect(page.locator('.blog').getByText('Playwright makes e2e testing easy Test Writer')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likeable blog', 'Test Writer', 'https://example.com/like')

      await page.getByRole('link', { name: 'Likeable blog Test Writer' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('the creator can delete a blog', async ({ page }) => {
      await createBlog(page, 'Blog to be removed', 'Test Writer', 'https://example.com/remove')

      await page.getByRole('link', { name: 'Blog to be removed Test Writer' }).click()

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('removed blog Blog to be removed')).toBeVisible()
      await expect(page.locator('.blog').filter({ hasText: 'Blog to be removed' })).toHaveCount(0)
    })
  })
})
