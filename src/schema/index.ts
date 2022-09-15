import { merge } from 'lodash'

import { typeDefs as UserTypeDefs, resolvers as UserResolvers } from './user'

export const typeDefs = [
  ...UserTypeDefs,
]

export const resolvers = merge(
  UserResolvers,
)
