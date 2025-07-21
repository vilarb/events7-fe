import { test, expect } from '@playwright/test'

let eventId: number | null = null
const testRandomId = Math.random().toString(36).substring(2, 15)

/**
 * Test the app root url
 */
test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-test-id="header-logo"]')).toHaveText('Events7')
})

/**
 * Test the create event flow
 */
test('create event', async ({ page }) => {
  await page.goto('/')

  // Wait for events to load
  await expect(page.locator('[data-test-id="events-table"]')).toBeVisible({ timeout: 10000 })

  // Click the create event button
  await page.locator('[data-test-id="create-event-button"]').click()

  // Check if the create event dialog is visible
  await expect(page.locator('[data-test-id="create-event-dialog"]')).toBeVisible()

  // Fill in the form
  await page.locator('#title').fill(`Test event ${testRandomId}`)
  await page.locator('#description').fill('Test description')
  await page.locator('#priority input').fill('1')

  // Click the create button
  await page.locator('[data-test-id="createButton"]').click()

  // Check if the event is created
  await expect(page.locator('[data-p-index="0"] td:nth-child(2)')).toHaveText(
    `Test event ${testRandomId}`,
    {
      timeout: 5000,
    },
  )

  // Get the event id
  eventId = Number(
    (await page.locator('[data-p-index="0"] td:nth-child(1) span').textContent())?.replace('#', ''),
  )
})

/**
 * Test the delete event flow
 */
test('delete event', async ({ page }) => {
  await page.goto('/')

  // Wait for events to load
  await expect(page.locator('[data-test-id="events-table"]')).toBeVisible({ timeout: 10000 })

  // Click the delete button
  await page.locator('[data-p-index="0"]').click()

  // Check if the new route is the event page
  console.log('eventId', eventId)
  await expect(page).toHaveURL(`/event/${eventId}`)

  // Click the delete button
  await page.locator('[data-test-id="delete-event-button"]').click()

  // Wait for the confirmation modal to open
  await expect(page.locator('[data-test-id="confirm-button"]')).toBeVisible({ timeout: 500 })

  // Confirm the delete
  await page.locator('[data-test-id="confirm-button"]').click()

  // Wait for the confirmation modal to close
  await expect(page.locator('[data-test-id="confirm-popup"]')).toBeHidden({ timeout: 3000 })

  // Check if the event is deleted
  expect(Number(await page.locator('[data-p-index="0"] td:nth-child(1)').textContent())).not.toBe(
    eventId,
  )
})
