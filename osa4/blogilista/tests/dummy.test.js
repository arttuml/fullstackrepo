const listHelper = require('../utils/list_helper')

test('dummy return on', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})