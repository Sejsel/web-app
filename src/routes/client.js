import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { linksFactory, extractLanguageFromUrl, changeLanguage } from '../links';
import { isAvailable, defaultLanguage } from '../locales';
import { isLoggedIn } from '../redux/selectors/auth';

/* container components */
import LayoutContainer from '../containers/LayoutContainer';
import App from '../containers/App';

/**
 * Asynchronously load a given page - for code splitting.
 * @param {string} name
 * @returns {Promise}
 */
const load = name => (_, cb) =>
  import(`../pages/${name}/${name}`)
    .then(module => module.default)
    .then(page => cb(null, page))
    .catch(e => cb(e, null));

const createRoutes = getState => {
  const getLang = state => state.params.lang;
  const getLinks = state => linksFactory(getLang(state));

  const requireAuth = (nextState, replace) => {
    if (!isLoggedIn(getState())) {
      replace(getLinks(nextState).LOGIN_URI);
    }
  };

  const onlyUnauth = (nextState, replace) => {
    if (isLoggedIn(getState())) {
      replace(getLinks(nextState).DASHBOARD_URI);
    }
  };

  const checkLanguage = (nextState, replace) => {
    const url = nextState.location.pathname;
    const lang = extractLanguageFromUrl(url);
    if (!isAvailable(lang)) {
      replace(changeLanguage(url, defaultLanguage));
    }
  };

  return (
    <Route path="/" component={App} onEnter={checkLanguage}>
      <Route path="/:lang" component={LayoutContainer}>
        <IndexRoute getComponent={load('Home')} />
        <Route path="login" getComponent={load('Login')} onEnter={onlyUnauth} />
        <Route
          path="registration"
          getComponent={load('Registration')}
          onEnter={onlyUnauth}
        />
        <Route
          path="email-verification"
          getComponent={load('EmailVerification')}
        />
        <Route path="app" onEnter={requireAuth}>
          <IndexRoute getComponent={load('Dashboard')} />
          <Route path="assignment/:assignmentId">
            <IndexRoute getComponent={load('Assignment')} />
            <Route path="user/:userId" getComponent={load('Assignment')} />
            <Route path="edit" getComponent={load('EditAssignment')} />
            <Route path="stats" getComponent={load('AssignmentStats')} />
            <Route
              path="submission/:submissionId"
              getComponent={load('Submission')}
            />
          </Route>
          <Route path="exercises">
            <IndexRoute getComponent={load('Exercises')} />
            <Route path=":exerciseId">
              <IndexRoute getComponent={load('Exercise')} />
              <Route path="edit" getComponent={load('EditExercise')} />
              <Route
                path="reference-solution/:referenceSolutionId"
                getComponent={load('ReferenceSolution')}
              />
            </Route>
          </Route>
          <Route path="group/:groupId">
            <IndexRoute getComponent={load('Group')} />
            <Route path="edit" getComponent={load('EditGroup')} />
          </Route>
          <Route path="instance/:instanceId" getComponent={load('Instance')} />
          <Route path="user/:userId">
            <IndexRoute getComponent={load('User')} />
            <Route path="edit" getComponent={load('EditUser')} />
          </Route>
        </Route>
        <Route path="forgotten-password">
          <IndexRoute getComponent={load('ResetPassword')} />
          <Route path="change" getComponent={load('ChangePassword')} />
        </Route>
        <Route path="admin">
          <Route path="instances">
            <IndexRoute getComponent={load('Instances')} />
            <Route path=":instanceId">
              <Route path="edit" getComponent={load('EditInstance')} />
            </Route>
          </Route>
        </Route>
        <Route path="*" getComponent={load('NotFound')} />
      </Route>
    </Route>
  );
};

export default createRoutes;
