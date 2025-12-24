import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-this'
const SALT_ROUNDS = 10

export interface JWTPayload {
  userId: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export function extractToken(event: H3Event): string | null {
  const authHeader = getHeader(event, 'authorization')

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

export async function requireAuth(event: H3Event): Promise<JWTPayload> {
  const token = extractToken(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Token não fornecido'
    })
  }

  const payload = verifyToken(token)

  if (!payload) {
    throw createError({
      statusCode: 401,
      message: 'Token inválido ou expirado'
    })
  }

  return payload
}
