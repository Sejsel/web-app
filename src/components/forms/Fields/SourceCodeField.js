import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import TextAreaField from './TextAreaField';

const SourceCodeField = (
  {
    input,
    mode,
    meta: { touched, error },
    type = 'text',
    label,
    tabIndex,
    ...props
  },
  { userSettings: { vimMode = false, darkTheme = false } }
) =>
  <TextAreaField
    {...input}
    meta={{ touched, error }}
    type={type}
    label={label}
    tabIndex={tabIndex}
    {...props}
  />;

SourceCodeField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  mode: PropTypes.string.isRequired,
  children: PropTypes.any,
  meta: PropTypes.shape({ error: PropTypes.any, touched: PropTypes.bool }),
  tabIndex: PropTypes.number,
  type: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ type: PropTypes.oneOf([FormattedMessage]) })
  ]).isRequired
};

SourceCodeField.contextTypes = {
  userSettings: PropTypes.object
};

export default SourceCodeField;
