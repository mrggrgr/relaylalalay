import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation addAddressToUserMutation($input: AddAddressToUserInput!) {
    addAddressToUser(input: $input) {
      address {
        id
      }
      user {
        id
        name
        address {
          id
          postalCode
          country
          region
          locality
          area
          street
          house
          block
          flat
        }
      }
    }
  }
`;

let tempID = 0;

function commit({environment, addressData, onError}) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        ...addressData,
        clientMutationId: String(tempID++),
      },
    },
    onCompleted: (resp, err) => {
      if (err) onError();
    },
    onError
  });
}

export default {commit};
