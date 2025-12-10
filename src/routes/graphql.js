const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Note = require('../models/Note');

const typeDefs = gql`
  type User { id: ID! username: String! email: String! }
  type Note {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    user: User!
  }
  type Query {
    notes: [Note]
    note(id: ID!): Note
  }
  type Mutation {
    createNote(title: String!, content: String!): Note
    updateNote(id: ID!, title: String, content: String): Note
    deleteNote(id: ID!): Boolean
  }
`; 

const resolvers = {
  Query: {
    notes: async (parent, args, context) => {
      if (!context.user) throw new Error('Unauthorized');
      return Note.find({ user: context.user._id }).sort({ createdAt: -1 });
    },
    note: async (parent, { id }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      return Note.findOne({ _id: id, user: context.user._id });
    }
  },
  Mutation: {
    createNote: async (parent, { title, content }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      const note = await Note.create({ user: context.user._id, title, content });
      return note;
    },
    updateNote: async (parent, { id, title, content }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      const note = await Note.findOne({ _id: id, user: context.user._id });
      if (!note) throw new Error('Note not found');
      if (title !== undefined) note.title = title;
      if (content !== undefined) note.content = content;
      await note.save();
      return note;
    },
    deleteNote: async (parent, { id }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      const res = await Note.findOneAndDelete({ _id: id, user: context.user._id });
      return !!res;
    }
  },
  Note: {
    user: async (note) => {
      return User.findById(note.user).select('-password');
    }
  }
};

async function setupGraphQL(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Read token from Authorization header
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      if (!token) return { user: null };

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        return { user };
      } catch (err) {
        return { user: null };
      }
    },
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = { setupGraphQL };
