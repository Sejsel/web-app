import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { Alert } from 'react-bootstrap';
import FormBox from '../../AdminLTE/FormBox';
import SubmitButton from '../SubmitButton';

import { TextField, MarkdownTextAreaField } from '../Fields';

const EditInstanceForm = ({
  submitting,
  handleSubmit,
  submitFailed = false,
  submitSucceeded = false,
  invalid
}) => (
  <FormBox
    title={<FormattedMessage id='app.editInstanceForm.title' defaultMessage='Edit instance' />}
    type={submitSucceeded ? 'success' : undefined}
    isOpen
    collapsable
    footer={
      <div className='text-center'>
        <SubmitButton
          handleSubmit={handleSubmit}
          submitting={submitting}
          hasSucceeded={submitSucceeded}
          hasFailed={submitFailed}
          invalid={invalid}
          messages={{
            submit: <FormattedMessage id='app.editInstanceForm.set' defaultMessage='Update instance' />,
            submitting: <FormattedMessage id='app.editInstanceForm.processing' defaultMessage='Saving ...' />,
            success: <FormattedMessage id='app.editInstanceForm.success' defaultMessage='Instance was updated.' />
          }} />
      </div>
    }>
    {submitFailed && (
      <Alert bsStyle='danger'>
        <FormattedMessage id='app.editInstanceForm.failed' defaultMessage='Cannot update instance.' />
      </Alert>)}

    <Field name='name' component={TextField} label={<FormattedMessage id='app.editInstanceForm.name' defaultMessage='Name:' />} />
    <Field name='description' component={MarkdownTextAreaField} label={<FormattedMessage id='app.editInstanceForm.description' defaultMessage='Description:' />} />
  </FormBox>
);

EditInstanceForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitFailed: PropTypes.bool,
  submitSucceeded: PropTypes.bool,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool
};

const validate = ({ bonusPoints }) => {
  const errors = {};

  return errors;
};

export default reduxForm({
  form: 'editInstance',
  validate
})(EditInstanceForm);
