import { handleActions } from 'redux-actions';
import factory, {
  initialState,
  createRecord,
  resourceStatus
} from '../helpers/resourceManager';
import { createApiAction } from '../middleware/apiMiddleware';

const resourceName = 'additionalExerciseFiles';
const { actions, reduceActions } = factory({ resourceName });

/**
 * Actions
 */

export const actionTypes = {
  ADD_FILES: 'recodex/additionalExerciseFiles/ADD_FILES',
  ADD_FILES_PENDING: 'recodex/additionalExerciseFiles/ADD_FILES_PENDING',
  ADD_FILES_FULFILLED: 'recodex/additionalExerciseFiles/ADD_FILES_FULFILLED',
  ADD_FILES_FAILED: 'recodex/additionalExerciseFiles/ADD_FILES_REJECTED'
};

export const fetchAdditionalExerciseFiles = exerciseId =>
  actions.fetchMany({
    endpoint: `/exercises/${exerciseId}/additional-files`
  });

export const addAdditionalExerciseFiles = (exerciseId, files) =>
  createApiAction({
    type: actionTypes.ADD_FILES,
    endpoint: `/exercises/${exerciseId}/additional-files`,
    method: 'POST',
    body: {
      files: files.map(uploaded => uploaded.file.id)
    },
    meta: {
      exerciseId,
      files: files.map(uploaded => ({
        tmpId: Math.random().toString(),
        file: uploaded.file
      }))
    }
  });

/**
 * Reducer
 */

const reducer = handleActions(
  Object.assign({}, reduceActions, {
    [actionTypes.ADD_FILES_FULFILLED]: (state, { payload, meta: { files } }) =>
      payload.reduce(
        (state, data) =>
          state.setIn(
            ['resources', data.id],
            createRecord({ data, state: resourceStatus.FULFILLED })
          ),
        state
      )
  }),
  initialState
);

export default reducer;
