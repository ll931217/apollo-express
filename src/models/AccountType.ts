import { Schema, model } from 'mongoose'

export interface IAccountType {
  accountType: string
  name: string

  createdAt?: Date
  updatedAt?: Date
}

export const accountTypeSchema = new Schema<IAccountType>({
  accountType: { type: String, required: true },
  name: { type: String, required: true },
}, { timestamps: true })

export const AccountType = model<IAccountType>('AccountType', accountTypeSchema)
