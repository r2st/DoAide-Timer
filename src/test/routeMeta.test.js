import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { metaForPath, pathForPage, routes } from '../routeMeta'

const root = process.cwd()
const appSrc = readFileSync(resolve(root, 'src/App.jsx'), 'utf-8')
const pages = routes.filter((r) => r.prerender !== false)
const posts = routes.filter((r) => r.prerender === false)

describe('routeMeta', () => {
  it('has unique paths, titles and descriptions', () => {
    for (const key of ['path', 'title', 'description']) {
      const values = pages.map((r) => r[key])
      expect(new Set(values).size).toBe(values.length)
    }
  })

  it('maps every routed path to a view App renders', () => {
    for (const r of pages) expect(appSrc).toContain(`case '${r.page}':`)
    expect(pathForPage('stats')).toBeUndefined()
  })

  it('lists only blog posts that ship as static HTML', () => {
    for (const r of posts) expect(existsSync(resolve(root, `public${r.path}.html`)), r.path).toBe(true)
    expect(metaForPath(posts[0].path)).toBeUndefined()
  })

  it('keeps titles within 70 chars and descriptions within 160', () => {
    for (const r of pages) {
      expect(r.title.length, r.path).toBeLessThanOrEqual(70)
      expect(r.description.length, r.path).toBeLessThanOrEqual(160)
    }
  })
})
