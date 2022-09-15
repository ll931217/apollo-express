import { merge } from 'lodash'

import { types as AccountTypes, resolvers as AccountTypeResolvers } from './AccountType'
import { types as UserTypes, resolvers as UserResolvers } from './User'

export const typeDefs = [
  UserTypes,
  AccountTypes,
]

export const resolvers = merge(
  UserResolvers,
  AccountTypeResolvers,
)
