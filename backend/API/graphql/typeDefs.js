export const typeDefs = `#graphql
    type Drawing {
        id: ID!
        label: String!
        predictedLabel: String!
        correct: Boolean!
        user: String!
        user_id: String!
        features: [Float!]!
    }

    type Query {
        drawings: [Drawing]
        drawing(id: ID, user_id: String): Drawing
    }

    type Mutation {
        addUserDrawings(userDrawings: DrawingsInput!): String
    }

    input DrawingsInput {
        user_id: String!
        user: String!
        userDrawings: DrawingsType!
    }

    input DrawingsType {
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
