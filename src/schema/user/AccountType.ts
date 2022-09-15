import { gql } from 'apollo-server-express'

import { AccountType, IAccountType } from '../../models/AccountType';

export const types = gql`
  type AccountType {
    accountType: String!
    name: String!
    createdAt: String
    updatedAt: String
  }

  input AccountTypeInput {
    accountType: String!
    name: String!
  }

  type Query {
    accountTypes: [AccountType]!
    accountType(accountType: String!): AccountType!
  }

  type Mutation {
    addAccountType(accountType: String!, name: String!): AccountType!
    deleteAccountType(accountType: String!): String!
  }
`

export const resolvers = {
  Query: {
    accountTypes: async () => await AccountType.find(),
    accountType: async (parent: any, { accountType }: IAccountType) => await AccountType.findOne({ accountType }),
  },
  Mutation: {
    addAccountType: async (parent: any, { accountType, name }: IAccountType) => {
      const accountTypeExist = await AccountType.findOne({ accountType })

      if (accountTypeExist) throw new Error(`Account Type "${accountType}" already exists`)

      const newAccountType = new AccountType({ accountType, name })
      await newAccountType.save()

      return newAccountType
    },
    deleteAccountType: async (parent: any, { accountType }: IAccountType) => {
      const accountTypeExist = await AccountType.findOne({ accountType })

      if (!accountTypeExist) throw new Error(`Account Type "${accountType}" does not exist`)

      await AccountType.deleteOne({ accountType })
      return `${accountType} deleted`
    }
  }
}
