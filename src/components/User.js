import React, {Component} from 'react';

import Button from './Button';
import UserAddAddress from './UserAddAddress';
import removeAddressFromUserMutation from '../mutations/removeAddressFromUserMutation';

import './User.css';

class User extends Component {

  renderAddress(address) {
    return ([
      ['postalCode', 'Индекс'], 
      ['country', 'Страна'], 
      ['region', 'Регион'], 
      ['area', 'Область'],
      ['locality', 'Насел. пункт'], 
      ['street', 'Улица'], 
      ['house', 'Дом'], 
      ['block', 'Корпус'], 
      ['flat', 'Квартира']
    ].map(([key, name]) => (
      <div key={key} className='User__field'>
        <span>{name}</span>
        <span>{address[key]}</span>
      </div>
    )))
  };

  render() {
    const {user, relay} = this.props;

    return (
      <div className='User'>
        <div className='User__header'>
          <div className='User__image'></div>
          <div className='User__name'>{user.name}</div>
        </div>
        <div className='User__page'>
          <div className='User__fieldName'>
            Адрес
            {user.address && <Button 
              onClick={() => removeAddressFromUserMutation.commit(
                relay.environment,
                user.id,
                user.address.id
              )}
              modific='User__delButton'
              theme='danger'
              size='sm'
              text='Удалить'
            />}
          </div>
          {user.address 
            ? this.renderAddress(user.address)
            : <UserAddAddress user={user} relay={relay} />
          }
        </div>            
      </div>
    );
  }
}

export default User;