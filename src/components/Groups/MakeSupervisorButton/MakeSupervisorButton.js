import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '../../widgets/FlatButton';
import Icon from 'react-fontawesome';

const MakeSupervisorButton = ({ onClick, ...props }) => (
  <Button {...props} onClick={onClick} bsStyle="success" className="btn-flat">
    <Icon name="user-plus" />
    {' '}
    <FormattedMessage
      id="app.groups.makeSupervisorButton"
      defaultMessage="Make supervisor"
    />
  </Button>
);

MakeSupervisorButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default MakeSupervisorButton;
