import React, { Component } from 'react';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import { Message, Grid, Button, Header, Icon } from 'semantic-ui-react';
import { beforeColumns } from '../helpers/tableHelpers';
import { connect } from 'react-redux';
import { fetchBeforeSessions } from '../store/beforeSessions/actions';
import * as sessionsSelectors from '../store/beforeSessions/reducers';

class Before extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }
  componentDidMount() {
    this.loadData();
  }
  loadData = () => this.props.fetchBeforeSessions();
  showModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });
  render() {
    return (
      <div className="beforeSessions">
        <Grid columns="equal">
          <Grid.Column width={10}>
            <Header size="large">
              <Icon name="desktop" color="green" />
              Analytics Results
            </Header>
          </Grid.Column>
          <Grid.Column>
            <Button size="small" onClick={this.loadData} floated="right">
              <Button.Content visible>
                <Icon name="refresh" />
              </Button.Content>
            </Button>
          </Grid.Column>
        </Grid>
        <Message content="A list of all executions of analytics regression, click any row to review the resuts." />
        <ReactTable
          getTrProps={(state, rowInfo) => {
            if (rowInfo && !rowInfo.aggregated) {
              if (rowInfo.original.duration === 0) {
                return {
                  onClick: () => this.showModal()
                };
              } else {
                return {
                  onClick: () =>
                    (window.location.href = `/errors/${
                      rowInfo.original.sessionId
                    }`)
                };
              }
            }
            return {};
          }}
          data={this.props.beforeSessions.data}
          columns={beforeColumns}
          loading={this.props.beforeSessions.loading}
          filterable={true}
          className="-striped -highlight"
          pivotBy={['siteName']}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    beforeSessions: sessionsSelectors.getBeforeSessions(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBeforeSessions(sessionId) {
      dispatch(fetchBeforeSessions(sessionId));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Before);
