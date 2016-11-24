import React, { PropTypes } from 'react';

/**
 * Used on many places for displaying a round profile picture of a user.
 * LoadingAvatar and FailedAvatar are used to mock the visual appearance
 * of the avatar while the image is being downloaded or if the download
 * failed for some reason.
 */
const Avatar = ({
  src,
  size = 45,
  title = 'avatar'
}) => (
  <img src={src} alt={title} width={size} className='img-circle' />
);

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  size: PropTypes.number
};

export default Avatar;
