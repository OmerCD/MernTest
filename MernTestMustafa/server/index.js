const { GraphQLServer } = require('graphql-yoga')
const { UserError } = require('graphql-errors')
const mongoose = require('mongoose');
mongoose.connect('mongodb://ohm:741895623ohm@35.231.112.9:27017/cool_db');

const Todo = mongoose.model('Todo', {
    text: String,
    complete: Boolean
});

const Person = mongoose.model('Person', {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: String,
    gender: String,
    birthDate: Date
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
    persons: [Person]
  }
  type Todo {
    id: ID!
    text: String!
    complete: Boolean!
  }

  type Mutation {
      createTodo(text: String!): Todo
      createPerson(userName: String!,email: String!,password: String!,gender: String,birthDate: String ): [String]
      checkIfUserNameUnique(userName:String!): Boolean
      updateTodo(id: ID!,complete: Boolean!): Boolean
      removeTodo(id: ID!): Boolean
  }
  type Person{
      id: ID!
      userName: String!
      email : String!
      password: String!
      gender: String
      birthDate:String
  }
`
const resolvers = {
    Query: {
        hello: (_, { name }) => `Hellos ${name || 'World'}`,
        todos: () => Todo.find(),
        persons: () => Person.find()
    },
    Mutation: {
        createTodo: async (_, { text }) => {
            const todo = new Todo({ text, complete: false });
            await todo.save();
            return todo;
        },
        updateTodo: async (_, { id, complete }) => {
            await Todo.findByIdAndUpdate(id, { complete });
            return true;
        },
        removeTodo: async (_, { id, }) => {
            await Todo.findByIdAndRemove(id);
            return true;
        },
        createPerson: async (_, { userName, email, password, gender, birthDate }) => {
            var errors = [];
            const person = new Person({
                userName: userName,
                email: email,
                password: password,
                gender: gender,
                birthDate: birthDate
            });
            await person.save((err, person) => {
                if (err) {
                    throw new Error(err.errmsg);
                }
            });
            return errors;
        },
        checkIfUserNameUnique: async (_, { userName }) => {
            var result = true;
            var person = await Person.findOne({ userName: userName }).then((res) => {
                if (res) result = false;
            });
            return result;
        }
    }
}
const server = new GraphQLServer({ typeDefs, resolvers })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    server.start(() => console.log('Server is running on localhost:4000'))
});


