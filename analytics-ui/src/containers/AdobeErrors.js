import React, { Component } from 'react';
import { Header, Icon } from 'semantic-ui-react';
import ReactTable from 'react-table';
import CurrentSessionNav from './CurrentSessionNav';
import { connect } from 'react-redux';
import * as csvSelectors from '../store/csvs/reducers';
import { errorCsvColumns } from '../helpers/tableHelpers';

class ErrorsTable extends Component {
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
      <div className="errorsTable">
        <CurrentSessionNav sessionId={this.state.sessionId} />
        <Header size="huge">
          <Icon name="plane" color="red" />
          Adobe Errors
        </Header>

        <ReactTable
          data={this.props.csvErrors}
          columns={errorCsvColumns}
          filterable={true}
          className="-striped -highlight"
          pivotBy={['shortError']}
          SubComponent={row => {
            return <pre>{JSON.stringify(row.original, null, 2)}</pre>;
          }}
        />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    csvErrors: csvSelectors.getSessionErrors(state)
  };
}

export default connect(mapStateToProps)(ErrorsTable);
