import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '../../widgets/FlatButton';
import Icon from 'react-fontawesome';

const RemoveSupervisorButton = ({ onClick, ...props }) => (
  <Button {...props} onClick={onClick} bsStyle="warning" className="btn-flat">
    <Icon name="user-times" />
    {' '}
    <FormattedMessage
      id="app.groups.removeSupervisorButton"
      defaultMessage="Remove supervisor"
    />
  </Button>
);

RemoveSupervisorButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default RemoveSupervisorButton;
