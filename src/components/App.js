import React, {Component} from 'react';
import {createFragmentContainer, graphql} from 'react-relay';

import User from './User';

import './App.css';

class App extends Component {
  render() {
    const {user, relay} = this.props;

    return (
      <div className='App'>
        <div className='App__box'>
          <User user={user} relay={relay} />
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(App, {
  user: graphql`
    fragment App_user on User {
      id
      ...on User {
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
  `,
});