import { useEffect } from 'react'
import { SITE, metaForPath, canonicalFor, jsonLdFor } from '../routeMeta'

/**
 * Keep <head> in sync with routeMeta on client-side navigation. The prerender
 * writes the same tags into each route's HTML for crawlers.
 */
export default function useSEO(path) {
  useEffect(() => {
    const meta = metaForPath(path)
    if (!meta) return
    const url = canonicalFor(meta.path)

    document.title = meta.title
    setMeta('name', 'description', meta.description)
    setMeta('property', 'og:title', meta.title)
    setMeta('property', 'og:description', meta.description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', SITE.ogImage)
    setMeta('name', 'twitter:title', meta.title)
    setMeta('name', 'twitter:description', meta.description)
    setMeta('name', 'twitter:image', SITE.ogImage)

    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', url)

    let script = document.querySelector('script[data-seo-jsonld]')
    if (!script) {
      script = document.createElement('script')
      script.setAttribute('type', 'application/ld+json')
      script.setAttribute('data-seo-jsonld', '')
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLdFor(meta))
  }, [path])
}

function setMeta(attr, key, value) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}
