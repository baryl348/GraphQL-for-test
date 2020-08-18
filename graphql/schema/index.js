const { buildSchema } = require("graphql");

module.exports = buildSchema(`
        input EventInput {
            title: String!
            completed: String!
            executionTime: String!
            activeTime: String!
            employeesInProcess: String!
            scriptsInProcess: String!
            start: String!
            end: String!
            loading: String!
        }
        
        input UserInput {
            email: String!
            password: String!
            firstName: String!
            secondName: String!
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
            firstName: String!
            secondName: String!
        }
    
        type Event {
            _id: ID!
            title: String!
            completed: String!
            executionTime: String!
            activeTime: String!
            employeesInProcess: String!
            scriptsInProcess: String!
            start: String!
            end: String!
            loading: String!
        }
        
        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
            firstName: String!
            secondName: String!
        }
        
        type RootQuery {
            events: [Event!]!
            login(email: String!, password: String!): AuthData!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
            updateUser(userInput:UserInput, id:String!): User
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);
