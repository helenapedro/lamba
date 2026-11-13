import { describe, expect, it } from 'vitest'
import { isOwnerUid } from './owner'

describe('isOwnerUid', () => {
  it('is true only for the exact owner uid', () => {
    expect(isOwnerUid('uid-1', 'uid-1')).toBe(true)
    expect(isOwnerUid('uid-1', 'uid-2')).toBe(false)
  })
  it('fails closed on a missing or unusable config value', () => {
    expect(isOwnerUid(undefined, 'uid-1')).toBe(false)
    expect(isOwnerUid(null, 'uid-1')).toBe(false)
    expect(isOwnerUid('', 'uid-1')).toBe(false)
    expect(isOwnerUid(123, 'uid-1')).toBe(false)
    expect(isOwnerUid('uid-1', null)).toBe(false)
    expect(isOwnerUid('uid-1', undefined)).toBe(false)
  })
})
