import { Schema, model } from 'mongoose'

import { accountTypeSchema, IAccountType } from './AccountType'

export interface IUser {
  name: string
  username: string
  passwordHash: string

  createdAt?: Date
  updatedAt?: Date

  accountType: IAccountType
}

export const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  accountType: accountTypeSchema
}, { timestamps: true })

export const User = model<IUser>('User', userSchema)
