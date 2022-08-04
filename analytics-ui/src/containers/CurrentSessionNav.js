import React, { Component } from 'react';
import { Icon, Menu, Divider, Message } from 'semantic-ui-react';
//import { NavLink } from 'react-router-dom';
import { getCSVResultsPath } from '../helpers/pathHelpers';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as csvSelectors from '../store/csvs/reducers';
import { fetchErrorsCsv } from '../store/csvs/actions';

class CurrentSessionNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navDisabled: true
    };
  }
  componentDidMount() {
    const sessionId = this.props.location.pathname.split('/')[2];
    this.setState({ sessionId: sessionId });
     this.setState({ errorsCsv: getCSVResultsPath('errors.csv', sessionId) });
    const csvErrorsPath = `/errors/${sessionId}`;
    const comparePath = `/compare/${sessionId}`;
    const responsesPath = `/responses/${sessionId}`;
    this.setState({ comparePath: comparePath });
    this.setState({ errorsPath: csvErrorsPath });
    this.setState({ responsesPath: responsesPath });
    this.props.fetchCsvResults(sessionId);
  }

  render() {
    return (
      <div>
        <Menu stackable pointing secondary>

           {!this.props.retrieveCsvError && (
            <Menu.Item target="_blank" href={this.state.errorsCsv}>
              <Icon name="download" color="red" />Test errors.csv
            </Menu.Item>
          )}
        </Menu>

        <Message negative hidden={!this.props.retrieveCsvError}>
          <Message.Header>Cannot get CSV results</Message.Header>
          <p>Did the test finish running?</p>
        </Message>
        <Divider />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sessionErrors: csvSelectors.getSessionErrors(state),
    retrieveCsvError: csvSelectors.getCsvErrorStatus(state),
    sessionResponses: csvSelectors.getSessionResponses(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCsvResults(sessionId) {
      dispatch(fetchErrorsCsv(sessionId));
    }
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CurrentSessionNav)
);
