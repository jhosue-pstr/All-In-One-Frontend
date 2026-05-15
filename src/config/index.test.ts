import { describe, it, expect } from 'vitest'
import { getApiUrl } from './index'

describe('getApiUrl', () => {
  it('should return the configured API URL', () => {
    const url = getApiUrl()
    expect(url).toBe('http://localhost:8000/api')
  })
})
