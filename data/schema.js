import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  USER_ID, // mocked user id
  Address,
  User,
  addAddress,
  getAddress,
  removeAddress,
  getUser,
} from './database';

const {nodeInterface, nodeField} = nodeDefinitions(
  globalId => {
    const {type, id} = fromGlobalId(globalId);
    
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Address') {
      return getAddress(id);
    } else if (globalId === USER_ID) { // little hack because of mocked User
      // to get rid of this we could get list of all users before ahead
      // and then query the one with fetched graphql id
      return getUser(globalId);
    } 

    return null;
  },
  obj => {  
    if (obj instanceof Address) {
      return AddressType;
    } else if (obj instanceof User) {
      return UserType;
    }
    return null;
  },
);

const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: {
    id: globalIdField('Address'),
    postalCode: {type: new GraphQLNonNull(GraphQLString)},
    country: {type: new GraphQLNonNull(GraphQLString)},
    region: {type: new GraphQLNonNull(GraphQLString)},
    area: {type: GraphQLString},
    locality: {type: new GraphQLNonNull(GraphQLString)},
    street: {type: GraphQLString},
    house: {type: GraphQLString},
    block: {type: GraphQLString},
    flat: {type: GraphQLString},
  },
  interfaces: [nodeInterface],
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    name: {type: new GraphQLNonNull(GraphQLString)},
    address: {type: AddressType},
  },
  interfaces: [nodeInterface],
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField,
  },
});

const AddAddressMutation = mutationWithClientMutationId({
  name: 'AddAddressToUser',
  inputFields: {
    userId: {type: new GraphQLNonNull(GraphQLID)}, 
    postalCode: {type: new GraphQLNonNull(GraphQLString)},
    country: {type: new GraphQLNonNull(GraphQLString)},
    region: {type: new GraphQLNonNull(GraphQLString)},
    area: {type: GraphQLString},
    locality: {type: new GraphQLNonNull(GraphQLString)},
    street: {type: GraphQLString},
    house: {type: GraphQLString},
    block: {type: GraphQLString},
    flat: {type: GraphQLString},
  },
  outputFields: {
    address: {
      type: new GraphQLNonNull(AddressType), 
      resolve: obj => getAddress(obj.newAddressId)
    },
    user: {
      type: new GraphQLNonNull(UserType), 
      resolve: obj => getUser(obj.userId)
    },
  },
  mutateAndGetPayload: obj => addAddress({
    ...obj, 
    userId: USER_ID // one more little hack because User is mocked
  })
});

const RemoveAddressMutation = mutationWithClientMutationId({
  name: 'RemoveAddressFromUser',
  inputFields: {
    userId: {type: new GraphQLNonNull(GraphQLID)}, 
    addressId: {type: new GraphQLNonNull(GraphQLID)},
  },
  outputFields: {
    addressId: {
      type: new GraphQLNonNull(GraphQLID), 
      resolve: obj => obj.deletedAddressId
    },
    user: {
      type: new GraphQLNonNull(UserType), 
      resolve: obj => getUser(obj.userId)
    },
  },
  mutateAndGetPayload: obj => removeAddress({
    ...obj, 
    userId: USER_ID // one more little hack because User is mocked
  })
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAddressToUser: AddAddressMutation,
    removeAddressFromUser: RemoveAddressMutation,
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
