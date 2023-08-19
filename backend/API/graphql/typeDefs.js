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
    type RawDrawing {
        user_id: String!
        user: String!
        userDrawings: RawDrawingsType!
    }
    type RawDrawingsType {
        car: [[[[Int!]]]]
        clock: [[[[Int!]]]]
        fish: [[[[Int!]]]]
        house: [[[[Int!]]]]
        pencil: [[[[Int!]]]]
        tree: [[[[Int!]]]]
        bicycle: [[[[Int!]]]]
        guitar: [[[[Int!]]]]
    }


    type Query {
        drawings: [Drawing]
        rawDrawings: [RawDrawing]
        drawing(id: ID, user_id: String): Drawing
    }

    type Mutation {
        addUserDrawings(input: DrawingsInput!): String
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
