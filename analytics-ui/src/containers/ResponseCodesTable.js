import React, { Component } from 'react';
import { Header, Icon } from 'semantic-ui-react';
import ReactTable from 'react-table';
import CurrentSessionNav from './CurrentSessionNav';
import { connect } from 'react-redux';
import * as csvSelectors from '../store/csvs/reducers';
import { responseCsvColumns } from '../helpers/tableHelpers';

class ResponseCodesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      sessionId: ''
    };
  }

  componentDidMount() {
    const sessionId = this.props.location.pathname.split('/')[2];
    this.setState({ sessionId: sessionId });
  }
  render() {
    return (
      <div>
        <CurrentSessionNav sessionId={this.state.sessionId} />
        <Header size="huge">
          <Icon name="tasks" />
          Responses
        </Header>
        <ReactTable
          data={this.props.csvReponses}
          columns={responseCsvColumns}
          // loading={this.state.loading}
          filterable={true}
          className="-striped -highlight"
          pivotBy={['viewport', 'statusCode']}
        />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    csvReponses: csvSelectors.getSessionResponses(state)
  };
}

export default connect(mapStateToProps)(ResponseCodesTable);
