export const typeDefs = `#graphql
    type Drawing {
        id: ID!
        label: String!
        predictedLabel: String!
        correct: Boolean!
        user: String!
        user_id: ID!
        features: [Int!]!
    }

    type Query {
        drawings: [Drawing]
        drawing(id: ID, user_id: ID): String
    }

    type Mutation {
        # addNewUserDrawings(newDrawings: newDrawingsInput!): String
        addNewDrawings: String
    }

    input newDrawingsInput {
        session: String!
        student: String!
        newDrawings: newDrawingsType!
    }

    input newDrawingsType {
        car: [[Point]]
        clock: [[Point]]
        fish: [[Point]]
        house: [[Point]]
        pencil: [[Point]]
        tree: [[Point]]
        bicycle: [[Point]]
        guitar: [[Point]]
    }

    input Point {
        x: Int!
        y: Int!
    }

`;
