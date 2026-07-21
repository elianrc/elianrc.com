import { describe, expect, it } from 'vitest'
import pkg from '../package.json'

describe('Astro build config', () => {
  it('uses Astro build scripts and Cloudflare Pages output directory', () => {
    expect(pkg.scripts.build).toContain('astro build')
    expect(pkg.scripts['pages:build']).toBe('astro build')
    expect(pkg.dependencies).toHaveProperty('astro')
    expect(pkg.dependencies).not.toHaveProperty('next')
  })
})
