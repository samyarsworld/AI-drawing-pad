export const typeDefs = `#graphql
    type Drawing {
        id: ID!
        label: String!
        predictedLabel: String!
        correct: Boolean!
        user: String!
        user_id: String!
        features: [Int!]!
    }

    type Query {
        drawings: [Drawing]
        drawing(id: ID, user_id: String): Drawing
    }

    type Mutation {
        addNewUserDrawings(newUserDrawings: newDrawingsInput!): String
    }

    input newDrawingsInput {
        user_id: String!
        user: String!
        newDrawings: newDrawingsType!
    }

    input newDrawingsType {
        car: [[[[Int!]]]]
        clock: [[[[Int!]]]]
        fish: [[[[Int!]]]]
        house: [[[[Int!]]]]
        pencil: [[[[Int!]]]]
        tree: [[[[Int!]]]]
        bicycle: [[[[Int!]]]]
        guitar: [[[[Int!]]]]
    }

`;
