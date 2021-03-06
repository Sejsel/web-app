import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FormGroup,
  FormControl,
  HelpBlock,
  ControlLabel
} from 'react-bootstrap';

class ExpandingSelectField extends Component {
  state = { texts: [''] };

  componentDidMount() {
    const { input: { value } } = this.props;
    const initialValue = Array.isArray(value) ? value.concat(['']) : [''];
    this.setState({ texts: initialValue });
  }

  changeText = (i, text, onChange) => {
    const { texts } = this.state;
    texts[i] = text.trim();
    if (i === texts.length - 1) {
      texts.push('');
    }
    this.setState({ texts });

    const texts2 = texts.slice(0, texts.length - 1);
    onChange(texts2);
  };

  removeIfEmpty = (i, onChange) => {
    const { texts } = this.state;
    if (i !== texts.length - 1 && texts[i] === '') {
      texts.splice(i, 1);
      this.setState({ texts });

      const texts2 = texts.slice(0, texts.length - 1);
      onChange(texts2);
    }
  };

  render() {
    const {
      label = '',
      input: { name, onChange },
      meta: { touched, error },
      options,
      style = {},
      ...props
    } = this.props;
    const { texts } = this.state;

    return (
      <FormGroup
        controlId={name}
        validationState={touched && error ? 'error' : undefined}
      >
        <ControlLabel>
          {label}
        </ControlLabel>
        <div style={style}>
          {texts.map((text, i) =>
            <FormControl
              key={i}
              onChange={e => this.changeText(i, e.target.value, onChange)}
              onBlur={() => this.removeIfEmpty(i, onChange)}
              value={text}
              componentClass="select"
              {...props}
            >
              {options.map(({ key, name }, o) =>
                <option value={key} key={o}>
                  {name}
                </option>
              )}
            </FormControl>
          )}
        </div>
        {touched &&
          error &&
          <HelpBlock>
            {error}
          </HelpBlock>}
      </FormGroup>
    );
  }
}

ExpandingSelectField.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  options: PropTypes.array,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ type: PropTypes.oneOf([FormattedMessage]) })
  ]).isRequired,
  style: PropTypes.object
};

export default ExpandingSelectField;
