import { IAccountType } from './models/AccountType'

interface QIUser {
  username: string
  name: string
  password: string
  accountType: IAccountType
}