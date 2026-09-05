import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { PrismaClient } from '@prisma/client'

// Run only against the isolated preview database/server described in docs/deployment.md.
const base = process.env.TEST_BASE_URL || 'http://localhost:3100/DuoMaoFF'
assert.ok(
  ['localhost', '127.0.0.1'].includes(new URL(base).hostname),
  'Use a local isolated test server'
)
const cookies = new Map()
async function request(url, options = {}) {
  const response = await fetch(base + url, {
    ...options,
    headers: {
      Cookie: [...cookies].map(([k, v]) => k + '=' + v).join('; '),
      ...options.headers,
    },
    redirect: 'manual',
  })
  for (const cookie of response.headers.getSetCookie()) {
    const [name, ...value] = cookie.split(';')[0].split('=')
    cookies.set(name, value.join('='))
  }
  return response
}
const unauthenticated = await request('/api/media/upload', { method: 'POST' })
assert.equal(unauthenticated.status, 401)
const adminPage = await request('/admin')
assert.equal(adminPage.status, 307)
assert.ok(adminPage.headers.get('location').endsWith('/DuoMaoFF/admin/login'))
const csrf = await (await request('/api/auth/csrf')).json()
const login = await request('/api/auth/callback/credentials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    csrfToken: csrf.csrfToken,
    username: 'preview-admin',
    password: 'preview-local-only',
    callbackUrl: base + '/admin',
    json: 'true',
  }),
})
assert.equal(login.status, 200)
const session = await (await request('/api/auth/session')).json()
assert.equal(session.user.name, 'preview-admin')
const original = await readFile(new URL('../doc/img/icon.png', import.meta.url))
const form = new FormData()
form.set(
  'file',
  new Blob([original], { type: 'image/png' }),
  'smoke-test-paw.png'
)
form.set('catId', 'duoduo')
form.set('description', '本地上传验证 · 猫爪原文件')
const uploaded = await request('/api/media/upload', {
  method: 'POST',
  body: form,
})
const result = await uploaded.json()
assert.equal(uploaded.status, 201, JSON.stringify(result))
const media = result.data
const publicFile = await fetch(base + media.filePath)
assert.equal(publicFile.status, 200)
const fetched = Buffer.from(await publicFile.arrayBuffer())
const sha = (value) => createHash('sha256').update(value).digest('hex')
assert.equal(sha(fetched), sha(original), 'Original file checksum must match')
const thumbnail = await fetch(base + media.thumbnailPath)
assert.equal(thumbnail.status, 200)
assert.equal(thumbnail.headers.get('content-type'), 'image/webp')
assert.ok(Number(thumbnail.headers.get('content-length')) < original.length)
const first = await fetch(base + media.filePath, {
  headers: { Range: 'bytes=0-15' },
})
assert.equal(first.status, 206)
assert.equal(
  first.headers.get('content-range'),
  'bytes 0-15/' + original.length
)
assert.deepEqual(
  Buffer.from(await first.arrayBuffer()),
  original.subarray(0, 16)
)
const suffix = await fetch(base + media.filePath, {
  headers: { Range: 'bytes=-12' },
})
assert.equal(suffix.status, 206)
assert.deepEqual(
  Buffer.from(await suffix.arrayBuffer()),
  original.subarray(-12)
)
const invalid = await fetch(base + media.filePath, {
  headers: { Range: 'bytes=' + (original.length + 10) + '-' },
})
assert.equal(invalid.status, 416)
assert.equal(
  (await fetch(base + media.filePath, { method: 'HEAD' })).status,
  200
)
const corrupt = new FormData()
corrupt.set('file', new Blob(['not an image']), 'corrupt.png')
assert.equal(
  (await request('/api/media/upload', { method: 'POST', body: corrupt }))
    .status,
  400
)
const missingCat = new FormData()
missingCat.set('file', new Blob([original]), 'test.png')
missingCat.set('catId', 'missing-cat-smoke-test')
assert.equal(
  (await request('/api/media/upload', { method: 'POST', body: missingCat }))
    .status,
  400
)
const list = await (await request('/api/media?pageSize=1&catId=duoduo')).json()
assert.equal(list.data.items.length, 1)
assert.equal(list.data.items[0].cat.name, '多多')
assert.equal((await request('/api/media?page=1.5')).status, 400)
const database = new PrismaClient({ datasources: { db: { url: 'file:' + new URL('../.test-data/preview.db', import.meta.url).pathname.replace(/^\/(\w:)/, '$1') } } })
const uploadDir = new URL('../.test-data/uploads/', import.meta.url)
const before = (await readdir(uploadDir)).sort()
try {
  await database.$executeRawUnsafe("CREATE TEMP TRIGGER IF NOT EXISTS unused_smoke_trigger AFTER INSERT ON Media BEGIN SELECT 1; END")
  // A persistent, narrowly scoped test trigger is visible to the server's connection.
  await database.$executeRawUnsafe("CREATE TRIGGER smoke_reject_media BEFORE INSERT ON Media WHEN NEW.originalName = 'smoke-rollback.png' BEGIN SELECT RAISE(ABORT, 'simulated database failure'); END")
  const rollback = new FormData()
  rollback.set('file', new Blob([original]), 'smoke-rollback.png')
  const response = await request('/api/media/upload', { method: 'POST', body: rollback })
  assert.equal(response.status, 500)
  assert.deepEqual((await readdir(uploadDir)).sort(), before, 'Failed DB writes must clean their files')
} finally {
  await database.$executeRawUnsafe('DROP TRIGGER IF EXISTS smoke_reject_media')
  await database.$disconnect()
}
const deleting = new FormData()
deleting.set('file', new Blob([original]), 'smoke-delete.png')
const deletionMedia = (await (await request('/api/media/upload', { method: 'POST', body: deleting })).json()).data
assert.equal((await request('/api/media/' + deletionMedia.id, { method: 'DELETE' })).status, 200)
assert.equal((await fetch(base + deletionMedia.filePath)).status, 404)
assert.equal((await fetch(base + deletionMedia.thumbnailPath)).status, 404)
assert.deepEqual((await readdir(uploadDir)).sort(), before, 'Delete removes both original and thumbnail')
console.log('PASS: authentication, upload, original SHA-256, thumbnail, public reads, HEAD, byte ranges, corrupt image rejection, cat validation, pagination, DB failure cleanup, deletion cleanup.')
console.log(
  'Retained in isolated test data for restart verification: ' + media.filePath
)
