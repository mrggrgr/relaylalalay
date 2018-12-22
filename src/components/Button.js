import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './Button.css';

class Button extends Component {

  render() {
    const {
      isDisabled,
      onClick,
      modific,  // any className parent component wants to add
      theme,    // 'danger'
      text,
      size      // 'sm'
    } = this.props;

    let modifiersStr = '';
    if (modific) modifiersStr += ` ${modific}`;
    if (theme) modifiersStr += ` -${theme}`;
    if (size) modifiersStr += ` -${size}`;

    return (
      <button 
        className={'Button' + modifiersStr}
        onClick={() => !isDisabled ? onClick() : null}
        disabled={isDisabled}
      >
        {text}
      </button>
    );
  }
}

Button.propTypes = {
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  modific: PropTypes.string,
  theme: PropTypes.string,
  text: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export default Button;