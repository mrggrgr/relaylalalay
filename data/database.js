export class User {
  constructor (args) {
    return Object.assign(this, args)
  }
}
export class Address {
  constructor (args) {
      return Object.assign(this, args);
  }
}

// Mock authenticated ID
export const USER_ID = 'me';

// Mock user data
const viewer = new User({id: USER_ID, name: 'Крупельницкий Иван'});
const usersById = {
  [USER_ID]: viewer,
};

// Mock address data
const addressById = {};
let nextAddressId = 0;
addAddress({
  userId: USER_ID,
  postalCode: '644099',
  country: 'Россия',
  region: 'Омский',
  locality: 'Омск',
  street: 'Ленина',
  house: '12',
  flat: '1',
});

export function addAddress(obj) {
  const {userId} = obj;
  const address = new Address({
    ...obj,
    id: `${nextAddressId++}` 
  });

  addressById[address.id] = address;
  getUser(userId).address = address;

  return {newAddressId: address.id, userId};
}

export function getAddress(id) {
  return addressById[id];
}

export function getUser(id) {
  return usersById[id];
}

export function getViewer() {
  return getUser(USER_ID);
}

export function removeAddress({userId, addressId}) {
  getUser(userId).address = null;
  delete addressById[addressId];
  return {deletedAddressId: addressId, userId};
}