import { gql } from 'apollo-server-express'
import bcrypt from 'bcrypt'
import consola from 'consola'
import jwt from 'jsonwebtoken'

import { User, IUser } from '../../models/User';
import { IAccountType } from '../../models/AccountType';

import { generateTokens } from '../../utils/jwt'

import { QIUser } from '../../types'

export const types = gql`
  type User {
    name: String!
    username: String!
    createdAt: String
    updatedAt: String
    accountType: AccountType!
  }

  type Query {
    users: [User]!
    user(username: String!): User
  }

  type Mutation {
    login(username: String!, password: String!): String!
    register(username: String!, name: String!, password: String!, accountType: AccountTypeInput!): User!
    deleteUser(username: String!): String!
  }
`

export const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (parent: any, { username }: QIUser) => {
      const user = await User.findOne({ username }) 

      if (!user) {
        throw new Error('User not found')
      }

      return user
    }
  },
  Mutation: {
    login: async (parent: any, { username, password }: QIUser) => {
      const user = await User.findOne({ username })

      if (!user) throw new Error('User not found')

      const { passwordHash, ...userDetails }: IUser = user

      const result = await bcrypt.compare(password, passwordHash)

      if (!result) throw new Error('Username and password don\'t match')

      return generateTokens(userDetails)
    },
    register: async (parent: any, { username, name, password, accountType }: QIUser) => {
      const userExists = await User.findOne({ username })

      if (userExists) throw new Error('User already exists')

      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS || '10'))
      const hash = await bcrypt.hash(password, salt)

      const user = new User({
        username,
        name,
        accountType,
        passwordHash: hash
      })
      await user.save()

      return user
    },
    deleteUser: async (parent: any, { username }: { username: string }) => {
      const userExists = await User.findOne({ username })

      if (!userExists) throw new Error(`User "${username}" does not exist`)

      await User.deleteOne({ username })
      return `${username} deleted`
    }
  },
}
