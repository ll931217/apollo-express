import { sign, verify } from 'jsonwebtoken'

import { QIUser } from '../types'

const { JWT_SECRET } = process.env

const defaultSecret: string = 'IAmVery_Secretive-ISwear'

export const generateTokens = (user: QIUser) => {
  const { JWT_SECRET, JWT_ACCESS_EXP, JWT_REFRESH_EXP } = process.env

  return {
    accessToken: sign(user, JWT_SECRET || defaultSecret, {
      expiresIn: JWT_ACCESS_EXP,
    }),
    refreshToken: sign(user, JWT_SECRET || defaultSecret, {
      expiresIn: JWT_REFRESH_EXP,
    })
  }
}

export const validateAccessToken = (token: string) => {
  try {
    return verify(token, JWT_SECRET || defaultSecret)
  } catch {
    return null
  }
}

export const validateRefreshToken = (token: string) => {
  try {
    return verify(token, JWT_SECRET || defaultSecret)
  } catch {
    return null
  }
}
