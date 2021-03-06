import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import MenuTitle from '../../widgets/Sidebar/MenuTitle';
import MenuItem from '../../widgets/Sidebar/MenuItem';

import withLinks from '../../../hoc/withLinks';

const Admin = ({ currentUrl, links: { ADMIN_INSTANCES_URI, USERS_URI } }) => (
  <ul className="sidebar-menu">
    <MenuTitle
      title={
        <FormattedMessage
          id="app.sudebar.menu.admin.title"
          defaultMessage="Administration"
        />
      }
    />
    <MenuItem
      icon="university"
      title={
        <FormattedMessage
          id="app.sidebar.menu.admin.instances"
          defaultMessage="Instances"
        />
      }
      currentPath={currentUrl}
      link={ADMIN_INSTANCES_URI}
    />
    <MenuItem
      icon="users"
      title={
        <FormattedMessage
          id="app.sidebar.menu.admin.users"
          defaultMessage="Users"
        />
      }
      currentPath={currentUrl}
      link={USERS_URI}
    />
  </ul>
);

Admin.propTypes = {
  currentUrl: PropTypes.string.isRequired,
  links: PropTypes.object.isRequired
};

export default withLinks(Admin);
