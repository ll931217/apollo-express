import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginInlineTrace,
} from 'apollo-server-core'
import { config } from 'dotenv'
import { connect } from 'mongoose'
import consola from 'consola'
import express from 'express'
import http from 'http'

config()

import { typeDefs, resolvers } from './schema';
import logger from './plugins/logger'

async function startApolloServer() {
  const app = express()

  try {
    const { DB_DIALECT, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_REPLICAS } = process.env

    let URI = `${DB_DIALECT}://${DB_HOST}:${DB_PORT}`
    if (DB_REPLICAS) URI += `,${DB_REPLICAS}`
    URI += `/${DB_NAME}`

    consola.info({ badge: true, message: `Database URI: ${URI}` })

    await connect(URI, { user: DB_USER, pass: DB_PASS, dbName: DB_NAME })

    consola.success({
      badge: true,
      message: '🆗 Connection has been established successfully.'
    })
  } catch (error) {
    consola.error({
      badge: true,
      message: `🚨 Unable to connect to the database: ${error}`,
    })
    console.log(error)
  }

  app.get('/', (_req, res) => {
    res.send('Yay! 😃')
  })

  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginInlineTrace(),
      logger
    ]
  })

  await server.start()

  let cors: (boolean|{ origin: string, credentials: boolean }) = true
  if (process.env.NODE_ENV == 'development') {
    cors = { origin: 'https://studio.apollographql.com', credentials: true }
  }

  server.applyMiddleware({ app, cors })

  await new Promise<void>((resolve) => httpServer.listen({
    host: process.env.HOST,
    port: process.env.PORT
  }, resolve))

  consola.success({
    badge: true,
    message: `🚀 Server listening on http://${process.env.HOST}:${process.env.PORT}/graphql`,
  })

  return { server, app }
}

startApolloServer()
