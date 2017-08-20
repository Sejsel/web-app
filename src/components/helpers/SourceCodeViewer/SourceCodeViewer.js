import React from 'react';
import PropTypes from 'prop-types';

const SourceCodeViewer = ({
  name,
  content = '',
  lineNumbers = true,
  lines = 20
}) =>
  <div>
    <code width="100%">
      {content}
    </code>
  </div>;

SourceCodeViewer.propTypes = {
  name: PropTypes.string.isRequired,
  content: PropTypes.string,
  lineNumbers: PropTypes.bool,
  lines: PropTypes.number
};

export default SourceCodeViewer;
