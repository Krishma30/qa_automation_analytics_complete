import React, { Component } from 'react';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import {
  Message,
  Grid,
  Button,
  Header,
  Icon,
  Card,
  Segment,  
  Menu, 
  Table
} from 'semantic-ui-react';
import { analyticsColumns } from '../helpers/tableHelpers';
import { connect } from 'react-redux';
import {  fetchPageLoad } from '../store/analyticsSessions/actions';
import * as sessionsSelectors from '../store/analyticsSessions/reducers';
import { NavLink } from 'react-router-dom';

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: null,
      failed: null,
      modalOpen: false
    };
  }

  componentDidMount() {
    this.loadData();
  }
  loadData = () => this.props.fetchPageLoad();
  
  showModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });

  updateStatus = domain => {
    var total = 0;
    var fails = 0;

     // console.log(domain)
    
    for (let i of this.props.analyticsSessions.data) {
      if (i.siteName == domain) {
        
        if (i.status == `failed`) {
          fails = fails + 1;
        }
        total = total + 1;
        }
    }
    this.setState({ total: total, failed: fails });
  };

  getOptions = data => {
    let options = [];
    let set = new Set();

    for (let i of data) {
      set.add(i);
    }
    for (let i of set) {
      let option = {
        text: i,
        key: i,
        value: i
      };
      options.push(option);
    }
    
    return options;
  };

  onChange = (e, data) => {
     
    if (data != undefined) {
      this.updateStatus(data.value);
      //console.log(data.value);
    }
  };



  render() {
    //console.table(this.props.analyticsSessions.data.map(i => i.siteName));
  console.table(this.props.analyticsSessions.data);
   //console.table("Suyash"+this.props.analyticsSessions.loading);
    
    //console.table(this.props.analyticsSessions.data.map(i => i.type));

    
    return (


      <div className="beforeSessions">
        <Grid columns="equal">
          <Grid.Column width={10}>
            <Header size="large">
              <Icon name="list" color="blue" />
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
        
        <br />
        
                { /* table Content Start */}
         <ReactTable
          getTrProps={(state, rowInfo) => {
            if (rowInfo && !rowInfo.aggregated) {
              if (rowInfo.original.duration === 0) {
                return { onClick: () => this.showModal() };
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
          
          data={this.props.analyticsSessions.data}
          columns={analyticsColumns}
          loading={this.props.analyticsSessions.loading}
          filterable={true}
          className="-striped -highlight"
          pivotBy={['siteName']}
          //pivotBy={['date']}
        /> 
      </div>
    );
    // >>>>>>> 3150eae2aad85c4c8d8e23b2410911bed851762b
  }
}
function mapStateToProps(state) {
  return {
    analyticsSessions: sessionsSelectors.getAnalyticsSessions(state)
    
    //AdobeValidation: sessionsSelectors.getAdobeValidation(state)
  };
}

function mapPageLoadDispatchToProps(dispatch) {
  return {
    fetchPageLoad(Id) {
      dispatch(fetchPageLoad(Id));
    }
  };
}
// function mapPageLoadDispatchToProps(dispatch) {
//   return {
//     fetchPageLoad(Id) {
//       dispatch(fetchPageLoad(Id));
//     }
//   };
// }
// function mapPageLoadDispatchToProps(dispatch) {
//   return {
//     fetchPageLoad(Id) {
//       dispatch(fetchPageLoad(Id));
//     }
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Analytics);
export default connect(mapStateToProps, mapPageLoadDispatchToProps)(Analytics);
