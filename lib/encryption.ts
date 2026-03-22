// lib/encryption.ts
// ─────────────────────────────────────────────────────────────
// We never store API keys as plain text in the database.
// This file encrypts them before insert and decrypts them
// before sending to the LLM.
//
// Algorithm: AES-256-GCM
// - AES-256: industry standard symmetric encryption
// - GCM mode: authenticated encryption — detects tampering
// - Each encryption uses a random IV so the same key encrypted
//   twice produces different ciphertext (no pattern leakage)
//
// The ENCRYPTION_KEY env var is the master secret.
// If this key leaks, all stored API keys are compromised.
// Keep it out of git, out of logs, out of chat messages.
// ─────────────────────────────────────────────────────────────

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex') // 32 bytes = 256 bits

export function encrypt(plaintext: string): string {
  // Random 12-byte IV — different every time
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])

  // Auth tag verifies the data wasn't tampered with on decryption
  const authTag = cipher.getAuthTag()

  // Store iv + authTag + encrypted together as one hex string
  // We need all three to decrypt later
  return [
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted.toString('hex'),
  ].join(':')
}

export function decrypt(ciphertext: string): string {
  const [ivHex, authTagHex, encryptedHex] = ciphertext.split(':')

  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)

  return decipher.update(encrypted) + decipher.final('utf8')
}