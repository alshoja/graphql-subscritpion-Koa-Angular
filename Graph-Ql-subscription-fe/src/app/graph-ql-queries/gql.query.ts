import { gql } from "apollo-angular";

const CREATE_USER = gql`
mutation Mutation($createUserAge: Float!, $createUserLastName: String!, $createUserFirstName: String!) {
  createUser(age: $createUserAge, lastName: $createUserLastName, firstName: $createUserFirstName)
}
`;

const SubQuery = gql`subscription{
  subscribeUserCreation {
    firstName
    lastName
    age
  }
}`

export { CREATE_USER, SubQuery }