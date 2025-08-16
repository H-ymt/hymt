#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const locale = process.argv[2]
const base = locale ? path.join('app', locale, 'content') : path.join('app', 'content')
const dir = path.join(process.cwd(), base)
if (!fs.existsSync(dir)) {
  console.error('NOT_FOUND', dir)
  process.exit(1)
}

function walk(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let results = []

  for (const e of entries) {
    const full = path.join(dir, e.name)
    const rel = basePath ? `${basePath}/${e.name}` : e.name
    if (e.isDirectory()) {
      results = results.concat(walk(full, rel))
    } else if (/\.mdx?$/.test(e.name)) {
      results.push(rel.replace(/\.mdx?$/, ''))
    }
  }

  return results
}

const slugs = walk(dir)
const meta = slugs.map((slug) => {
  const fp = path.join(dir, `${slug}.mdx`)
  const raw = fs.readFileSync(fp, 'utf8')
  const { data } = matter(raw)
  return { slug, data }
})

console.log(JSON.stringify({ baseDir: dir, count: meta.length, items: meta }, null, 2))
