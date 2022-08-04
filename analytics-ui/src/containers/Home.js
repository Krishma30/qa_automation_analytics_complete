import React, { Component } from 'react';
import { Header, Message, Form, Radio } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { fetchBeforeSessions } from '../store/beforeSessions/actions';
import * as beforeSessionsSelectors from '../store/beforeSessions/reducers';
import '../new.css';
import axios from 'axios';

const JIRA_URL =
  'https://jira.unileversolutions.com/secure/RapidBoard.jspa?rapidView=980&projectKey=D2QA&selectedIssue=D2QA-246';

const testhit =
   'http://52.29.78.250:8080/jenkins/buildByToken/buildWithParameters?job=visual-run-analytics-dashboard&token=analyticscid2qa&CSV_FILES=LBP-FEBuild-Domain.csv&BRAND=TEST&TEST_TYPE=before&AUTHENTICATION_PROFILE_ID=generic&OPTIONAL_IP=&OPTIONAL_DNS=&COMPARE_WITH_CSV=&COMPARE_WITH_AUTH_PROFILE=generic';
  

const jenkinsCall =
  'http://52.29.78.250:8080/jenkins/buildByToken/buildWithParameters?job=AnalyticsAutomation&token=analyticsAutomation1234&url=${this.state.value}&env=Prod';


  
class Home extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      jiraUrl: JIRA_URL,
      // TestHit: testhit,
      // submithit: jenkinsCall,
      // urlData: this.state.value,
      name:'',
    
    };
  }
 
handleChange = event =>{
  this.setState({ name: event.target.value });

} 


  handleSubmit = event => {
    event.preventDefault();
    const url = {
       name: this.state.name
    }
    axios.post(`http://52.29.78.250:8080/jenkins/buildByToken/buildWithParameters?job=AnalyticsAutomation&token=analyticsAutomation1234`)
    //axios.post(`https://jsonplaceholder.typicode.com/users`,{ url })
    .then(res => {
      console.log(res);
      //console.log(res.data);
      

     })
  }
  render() {
    return (
      <div>
        <Header size="large">Welcome to Unilever Analytics Testing !! </Header>
        <Message positive>
          <Message.Header>Updates coming soon </Message.Header>
          <p>
            This page will be used to display latest stats on Analytics Testing,
            as well as details on new features.
          </p>
          <p>
            Please raise any issues / feature requestsby clicking the link
            below, and make sure the issue is raised with an issue type of
            `Analytics Testing`
          </p>
          <a
            href={this.state.jiraUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Analytics Testing Regression Jira board
          </a>
        </Message>
        <div id="main_form">
          <br></br>
        <span id="vspace"> </span>
          <Form>
            <Form.Field>
              <Radio toggle label="UAT" enabled id="togglemargin" />
              <Radio toggle label="Production" enabled />
            </Form.Field>
          </Form>
          <div id="vspace"> </div>

          <form className="ui label label" id="ui_label" onSubmit ={this.handleSubmit}>
            <a>URL:</a>

            <div id="vspace"> </div>

            <label>
              <input
                id="inputurl"
                 name="name"
                 type="url"
                          required="required"
                onChange={this.handleChange}
                placeholder="  Please Enter your URL/ SiteMap"
                />
            </label>
            
            <div id="vspace"> </div>

            <button
              id="inputsubmit"
              type="submit"
            >Submit Your URL</button>
           
          </form>
          <div id="vspace2"> </div>
          <a
            href={this.state.TestHit}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here for test click
          </a>
          <div id="vspace"> </div>
          <div className="ui labeled input" id="Url_p10_center" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    beforeSessions: beforeSessionsSelectors.getBeforeSessions(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchResults() {
      dispatch(fetchBeforeSessions());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
