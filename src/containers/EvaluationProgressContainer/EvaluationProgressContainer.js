import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {
  init,
  addMessage,
  completedTask,
  skippedTask,
  failedTask
} from '../../redux/modules/evaluationProgress';

import {
  getExpectedTasksCount,
  getCompletedPercent,
  getSkippedPercent,
  getFailedPercent,
  getMessages,
  isFinished
} from '../../redux/selectors/evaluationProgress';

import { finishProcessing } from '../../redux/modules/submission';

import EvaluationProgress from '../../components/EvaluationProgress';
import randomMessages, { lastMessage } from './randomMessages';

class EvaluationProgressContainer extends Component {

  state = { realTimeProcessing: true };
  componentWillMount = () => this.init(this.props);
  componentWillReceiveProps = (props) => this.init(props);

  init = (props) => {
    const {
      submissionId,
      port = 443,
      url = 'recodex.projekty.ms.mff.cuni.cz',
      path = 'ws',
      isOpen,
      secure = true
    } = props;

    if (!this.socket && submissionId !== null) {
      if (typeof WebSocket === 'function') {
        const schema = secure ? 'wss' : 'ws';
        this.socket = new WebSocket(`${schema}://${url}:${port}/${path}/`);
        this.socket.onopen = () => this.socket.send(submissionId);
        this.socket.onmessage = this.onMessage;
        this.socket.onerror = () => this.setState({ realTimeProcessing: false });
      } else {
        this.setState({ realTimeProcessing: false });
      }
    }
  };

  onMessage = (msg) => {
    const data = JSON.parse(msg.data);
    const { addMessage } = this.props;

    switch (data.command) {
      case 'TASK':
        this.updateProgress(data);
        break;
      case 'FINISHED':
        addMessage(this.formatMessage(data));
        this.closeSocket();
        break;
    }
  };

  formatMessage = ({ command, task_id = false, task_state = 'OK', text = null }) => ({    // eslint-disable-line camelcase
    wasSuccessful: command !== 'TASK' || task_state === 'COMPLETED',      // eslint-disable-line camelcase
    text: text || this.getRandomMessage(),
    status: task_state // eslint-disable-line camelcase
  });

  getRandomMessage = () => {
    if (!this.availableMessages || this.availableMessages.length === 0) {
      this.availableMessages = Object.assign([], randomMessages);
    }

    const randomIndex = Math.floor(Math.random() * this.availableMessages.length);
    return this.availableMessages.splice(randomIndex, 1).pop();
  };

  updateProgress = task => {
    const { completedTask, skippedTask, failedTask } = this.props;
    const msg = this.formatMessage(task);
    switch (task.task_state) {
      case 'COMPLETED':
        completedTask(msg);
        break;
      case 'SKIPPED':
        skippedTask(msg);
        break;
      case 'FAILED':
        failedTask(msg);
        break;
    }
  };

  closeSocket = () => {
    const {
      addMessage,
      goToEvaluationDetails
    } = this.props;

    this.socket.close();
    this.isClosed = true;
    addMessage({ wasSuccessful: true, status: 'OK', text: lastMessage });
  };

  finish = () => {
    const { link, finishProcessing } = this.props;
    const { router } = this.context;
    finishProcessing();
    router.push(link);
  };

  render = () => {
    const {
      isOpen,
      expectedTasksCount,
      messages,
      progress,
      isFinished
    } = this.props;

    return this.state.realTimeProcessing === true
      ? <EvaluationProgress
          isOpen={isOpen}
          messages={messages}
          completed={progress.completed}
          skipped={progress.skipped}
          failed={progress.failed}
          finished={isFinished}
          showContinueButton={isFinished || this.isClosed}
          finishProcessing={this.finish} />
      : <EvaluationProgress
          isOpen={isOpen}
          completed={0}
          skipped={100}
          failed={0}
          finished={false}
          showContinueButton={true}
          finishProcessing={this.finish}
          messages={List([
            this.formatMessage({
              command: 'TASK',
              task_state: 'SKIPPED',
              text: <FormattedMessage
                      id='app.evaluationProgress.noWebSockets'
                      defaultMessage='Your browser does not support realtime progress monitoring or the connection to the server could not be estabelished or was lost. The evaluation has already started and you will be able to see the results soon.' />
            })
          ])} />;
  };

}

EvaluationProgressContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  assignmentId: PropTypes.string,
  submissionId: PropTypes.string,
  port: PropTypes.number,
  url: PropTypes.string,
  path: PropTypes.string,
  finishProcessing: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired
};

EvaluationProgressContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(
  state => ({
    expectedTasksCount: getExpectedTasksCount(state),
    progress: {
      completed: getCompletedPercent(state),
      skipped: getSkippedPercent(state),
      failed: getFailedPercent(state)
    },
    isFinished: isFinished(state),
    messages: getMessages(state)
  }),
  {
    finishProcessing,
    completedTask,
    skippedTask,
    failedTask,
    addMessage
  }
)(EvaluationProgressContainer);
