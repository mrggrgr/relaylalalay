import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation removeAddressFromUserMutation($input: RemoveAddressFromUserInput!) {
    removeAddressFromUser(input: $input) {
      addressId
      user {
        id
        name
        address {
          id
        }
      }
    }
  }
`;

let tempID = 0;

function commit(environment, userId, addressId) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        userId, 
        addressId,
        clientMutationId: String(tempID++),
      },
    },
  });
}

export default {commit};
