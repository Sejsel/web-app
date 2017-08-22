import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { TextField } from '../Fields';
import { FormattedMessage } from 'react-intl';

const PipelineVariablesField = ({ input, label, variables }) =>
  <div>
    <h4>
      {label}
    </h4>
    {variables.length === 0 &&
      <FormattedMessage
        id="app.portsField.empty"
        defaultMessage="There are no ports."
      />}
    {variables.map(({ name }) =>
      <Field
        key={name}
        name={`${input.name}.${name}`}
        component={TextField}
        label={`${name}: `}
      />
    )}
  </div>;

PipelineVariablesField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ type: PropTypes.oneOf([FormattedMessage]) }),
    PropTypes.element
  ]).isRequired,
  variables: PropTypes.array
};

export default PipelineVariablesField;