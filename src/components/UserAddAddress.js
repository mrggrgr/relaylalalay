import React, {Component} from 'react';
import {ReactDadata} from 'react-dadata';

import Button from './Button';
import addAddressToUserMutation from '../mutations/addAddressToUserMutation';

import './UserAddAddress.css';

class UserAddAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSuggestion: null,
      error: null
    };
  }

  render() {
    const {user, relay} = this.props;
    const {selectedSuggestion, error} = this.state;

    return (
      <div className='UserAddAddress'>
        <ReactDadata 
          onChange={suggestion => {
            if (!suggestion || !suggestion.data) return;
            const {
              postal_code: postalCode, 
              country, 
              region, 
              area_with_type: area, 
              street, 
              house, 
              block, 
              flat
            } = suggestion.data;
            const locality = suggestion.data.city || suggestion.data.settlement_with_type;
            this.setState({
              selectedSuggestion: {postalCode, country, region, area, locality, street, house, block, flat},
              error: null
            })
          }}
          token='4d1b8a665e132653e6a92f83e250bc8e9f13fde6'
          placeholder='Введите Ваш адрес'
        />
        {!!error && <div className='UserAddAddress__error'>
          {error}
        </div>}
        <Button 
          onClick={() => {
            addAddressToUserMutation.commit({
              environment: relay.environment,
              addressData: {
                userId: user.id,
                ...selectedSuggestion
              },
              onError: () => {
                this.setState({error: 'Что-то пошло не так. Попробуйте указать другой адрес'});
              }
            })
          }}
          modific='UserAddAddress__saveButton'
          text='Сохранить'
        />
      </div>
    );
  }
}

export default UserAddAddress;