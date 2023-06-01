const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Tag {
        _id: ID!
        title: String!
        slug: String!
        content: String!
        createdAt: String!
        updatedAt: String!
    }

    type TagData {
        tags: [Tag!]!
        totalTags: Int!
    }

    input TagInputData {
        title: String!
        content: String!
        slug: String!
    }

    type RootQuery {
        tags(page: Int): TagData!
        tag(id: ID!): Tag!
        hello:String!
    }

    type RootMutation {
        createTag(tagInput: TagInputData): Tag!
        updateTag(id: ID!, tagInput: TagInputData): Tag!
        deleteTag(id: ID!): Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
