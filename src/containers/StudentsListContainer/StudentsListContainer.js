import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import ResourceRenderer from '../../components/ResourceRenderer';
import StudentsList from '../../components/Users/StudentsList';

import { readyUsersDataSelector } from '../../redux/selectors/users';
import { groupSelector, studentsOfGroup } from '../../redux/selectors/groups';
import { createGroupsStatsSelector } from '../../redux/selectors/stats';
import { fetchGroupIfNeeded } from '../../redux/modules/groups';
import { fetchStudents } from '../../redux/modules/users';

class StudentsListContainer extends Component {

  componentWillMount = () => this.props.loadAsync();
  componentWillReceiveProps = (newProps) => {
    if (newProps.groupId !== this.props.groupId) {
      newProps.loadAsync();
    }
  };

  render() {
    const { group, students, stats, ...props } = this.props;
    return (
      <ResourceRenderer resource={group}>
        {(group) => (
          <StudentsList
            {...props}
            users={students}
            isLoaded={students.length === group.students.length}
            stats={stats} />
        )}
      </ResourceRenderer>
    );
  }
}

StudentsListContainer.propTypes = {
  groupId: PropTypes.string.isRequired,
  group: PropTypes.object.isRequired,
  students: PropTypes.array,
  stats: ImmutablePropTypes.map,
  loadAsync: PropTypes.func.isRequired
};

export default connect(
  (state, { groupId }) => {
    const group = groupSelector(groupId)(state);
    const studentsIds = studentsOfGroup(groupId)(state);
    const readyUsers = readyUsersDataSelector(state);
    const students = readyUsers.filter(user => studentsIds.includes(user.id));

    return {
      group,
      students,
      stats: createGroupsStatsSelector(groupId)(state)
    };
  },
  (dispatch, { groupId }) => ({
    loadAsync: () => Promise.all([
      dispatch(fetchGroupIfNeeded(groupId)),
      dispatch(fetchStudents(groupId))
    ])
  })
)(StudentsListContainer);