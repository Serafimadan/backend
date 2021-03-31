const { ApolloServer, PubSub, express } = require('apollo-server')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config()
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

const pubsub = new PubSub()

const PORT = process.env.PORT || 5000

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
})

mongoose
  .connect(process.env.MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB connected')
    return server.listen({ port: PORT })
  })
  .then((res) => {
    console.log(`Server is running at ${res.url}`)
  })
  .catch((err) => {
    console.error(err)
  })
