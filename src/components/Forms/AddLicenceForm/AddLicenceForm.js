import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Alert } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

// import isInt from 'validator/lib/isInt';
import FormBox from '../../AdminLTE/FormBox';
import SubmitButton from '../SubmitButton';
import { TextField, DatetimeField } from '../Fields';

const AddLicenceForm = ({
  submitting,
  handleSubmit,
  submitFailed = false,
  submitSucceeded = false,
  invalid
}) => (
  <FormBox
    title={<FormattedMessage id='app.addLicence.addLicenceTitle' defaultMessage='Add new licence' />}
    type={submitSucceeded ? 'success' : undefined}
    isOpen={false}
    collapsable={true}
    footer={
      <div className='text-center'>
        <SubmitButton
          handleSubmit={handleSubmit}
          submitting={submitting}
          hasSucceeded={submitSucceeded}
          hasFailed={submitFailed}
          invalid={invalid}
          messages={{
            submit: <FormattedMessage id='app.addLicence.set' defaultMessage='Add licence' />,
            submitting: <FormattedMessage id='app.addLicence.processing' defaultMessage='Adding ...' />,
            success: <FormattedMessage id='app.addLicence.success' defaultMessage='Licence was added.' />
          }} />
      </div>
    }>
    {submitFailed && (
      <Alert bsStyle='danger'>
        <FormattedMessage id='app.addLicence.failed' defaultMessage='Cannot add the licence.' />
      </Alert>)}

    <Field name='note' component={TextField} label={<FormattedMessage id='app.addLicence.note' defaultMessage='Note:' />} />
    <Field name='validUntil' component={DatetimeField} label={<FormattedMessage id='app.addLicence.validUntil' defaultMessage='Valid until:' />} />
  </FormBox>
);

AddLicenceForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitFailed: PropTypes.bool,
  submitSucceeded: PropTypes.bool,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool
};

const validate = ({ note, validUntil }) => {
  const errors = {};

  if (!note || note.length === 0) {
    errors['note'] = <FormattedMessage id='app.addLicence.validation.note' defaultMessage='Note cannot be empty.' />;
  }

  if (!validUntil) {
    errors['validUntil'] = <FormattedMessage id='app.addLicence.validation.validUntilEmpty' defaultMessage="End of licence's valid period must be set." />;
  } else if (validUntil.isBefore(Date.now())) {
    errors['validUntil'] = <FormattedMessage id='app.addLicence.validation.validUntilInThePast' defaultMessage="End of licence's valid period must be in the future." />;
  }

  return errors;
};

export default reduxForm({
  form: 'addLicence',
  validate
})(AddLicenceForm);