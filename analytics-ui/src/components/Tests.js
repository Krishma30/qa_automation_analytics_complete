import React, { Component } from 'react';
import {
  Table,
  Checkbox,
  Button,
  Icon,
  Modal,
  Header,
  Form,
  Message
} from 'semantic-ui-react';

const stubData = [
  {
    id: 1,
    name: 'Test test 123',
    dateBeforeLastRan: '2018-02-10T15:32',
    dateAfterLastRan: '2018-02-10T16:24',
    domain: 'https://www.unilever.com'
  }
];

class Tests extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      modalOpen: false,
      form: {
        csv: '',
        csvAfter: '',
        authProfileAfter: 'generic',
        authProfile: 'generic',
        testType: 'before',
        ip: '',
        dns: '',
        csvError: false,
        brandError: false,
        showStatus: false,
        errorStatus: false,
        successStatus: true,
        feedback: '',
        showAfter: false,
        authProfiles: [
          {
            key: 'notRequired',
            text: 'Not required',
            value: 'Not required'
          },
          {
            key: 'generic',
            text: 'generic',
            value: 'generic'
          }
        ]
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  setFormState(name, value) {
    this.setState(preState => ({
      form: {
        ...preState.form,
        [name]: value
      }
    }));
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setFormState([name], value);

    //Check if this is the csv or brand form to clear the error
    if (name === 'csv') {
      this.setFormState('csvError', value ? false : true);
    }
    if (name === 'testType') {
      this.setFormState('showAfter', value === 'compare' ? true : false);
    }
  }

  createTest = () => {
    const formData = this.state.form;
    const jenkinsCall = `http://52.29.78.250:8080/jenkins/buildByToken/buildWithParameters?job=deploy_node-screenshot-capture&token=ABCD1234&CSV_FILES=${
      formData.csv
    }&BRAND=TEST&TEST_TYPE=${formData.testType}&AUTHENTICATION_PROFILE_ID=${
      formData.authProfile
    }&OPTIONAL_IP=${formData.ip}&OPTIONAL_DNS=${
      formData.dns
    }&COMPARE_WITH_CSV=${formData.csvAfter}&COMPARE_WITH_AUTH_PROFILE=${
      formData.authProfileAfter
    }`;
    // const jenkinsCall = `http://52.29.78.250:8080/jenkins/buildByToken/buildWithParameters?job=deploy_node-screenshot-capture&token=ABCD12345&test=123&CSV_FILES=${formData.csv}&TEST_TYPE=${formData.testType}&AUTHENTICATION_PROFILE_ID=${formData.authProfile}&OPTIONAL_CSV_AFTER=${formData.csvAfter}&OPTIONAL_AUTHENTICATION_AFTER=${formData.authProfileAfter}&OPTIONAL_IP=${formData.ip}&OPTIONAL_DNS=${formData.dns}`;

    this.setFormState('showStatus', true);
    //Check form
    if (formData.csv) {
      this.setFormState('feedback', `Calling ${jenkinsCall}`);
      fetch(jenkinsCall)
        .then(() => {
          this.setFormState('errorStatus', false);
          this.setFormState('successStatus', true);
          this.setFormState('feedback', `Test Triggered`);
        })
        .catch(error => {
          //this.setFormState('feedback', `ERROR: ${error} - URL: ${jenkinsCall}`);
          //this.setFormState('errorStatus', true)
        });
    } else {
      this.setFormState('csvError', formData.csv ? false : true);
      this.setFormState('feedback', `Please fill in all the required fields`);
      this.setFormState('errorStatus', true);
    }
  };

  toggleModal = () => {
    const newState = this.state.modalOpen;
    this.setState({ modalOpen: !newState });
  };

  componentDidMount() {
    this.setState({ data: stubData });
  }

  render() {
    const formData = this.state.form;

    return (
      <div>
        <Header size="large">
          <Icon name="setting" />
          Manage tests
        </Header>
        <Button primary size="large" onClick={this.toggleModal}>
          Run Visual Regression tests
        </Button>
        <Message
          warning
          icon="warning"
          header="Work in progress!"
          content="Please note its not currently possible to run tests unless your are in a Sapient office. This will be a fixed in a future release."
        />

        <Table collapsing compact celled definition hidden>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>
                {' '}
                <Icon name="desktop" color="green" /> Before date last run
              </Table.HeaderCell>
              <Table.HeaderCell>
                {' '}
                <Icon name="desktop" color="red" /> After date last run
              </Table.HeaderCell>
              <Table.HeaderCell>Domain</Table.HeaderCell>
              <Table.HeaderCell>Domain</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.data.map(rowData => (
              <Table.Row key={rowData.id}>
                <Table.Cell collapsing>
                  <Checkbox slider />
                </Table.Cell>
                <Table.Cell>{rowData.name}</Table.Cell>
                <Table.Cell>{rowData.dateBeforeLastRan}</Table.Cell>
                <Table.Cell>{rowData.dateAfterLastRan}</Table.Cell>
                <Table.Cell>{rowData.domain}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell colSpan="4">
                <Button
                  floated="right"
                  icon
                  labelPosition="left"
                  primary
                  size="small"
                >
                  <Icon name="puzzle" /> Add Test
                </Button>
                <Button size="small">Run selected tests</Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>


      <Modal open={this.state.modalOpen}>
      <Modal.Header>
      <Form.Button onClick={this.toggleModal} floated="right"circular icon="close" />
        Run existing tests       
      </Modal.Header>
      <Modal.Content>              
        <Modal.Description>
          <Form onSubmit={this.createTest}> `
            
            <Form.Group widths="equal">
              <Form.Field label="Test type" control="select" name="testType" value={formData.testType} onChange={this.handleChange}>
                <option value="before">Before</option>
                <option value="after">After</option>
                <option value="compare">Compare</option>
                <option value="analytics">Analytics</option>
                <option value="prbefore">PrBefore</option>
                <option value="prafter">PrAfter</option>
              </Form.Field>
              <Form.Input label="CSV files or sitemap.xml" placeholder="Enter Csv file or sitemap xml" name="csv" value={formData.csv} onChange={this.handleChange} error={formData.csvError} />  
              <Form.Field label="Authentication profile" control="select" name="authProfile" value={formData.authProfile} onChange={this.handleChange}>
                <option value="na">Not required</option>
                <option value="generic">Generic</option>
                <option value="d2lite_qa">d2lite QA enviornment</option>
                <option value="pr">AEM Product Release enviornment</option>
                <option value="novostaging">novostaging</option>
                <option value="amaze">amaze</option>
                <option value="bws">bws</option>
                <option value="starterkit">starterkit</option>
                
              </Form.Field>
            </Form.Group>        
            <Message hidden={!formData.showAfter}>
              <Message.Header>Optional After settings</Message.Header>
              <p>(If blank the above settings will be used)</p>
              <Form.Group widths="equal">
              <Form.Input label="CSV files or sitemap.xml to use for After" placeholder="If blank the before will be used" name="csvAfter" value={formData.csvAfter} onChange={this.handleChange} hidden/>  
                <Form.Field label="Authentication profile" control="select" name="authProfileAfter" value={formData.authProfileAfter} onChange={this.handleChange}>
                <option value="na">Not required</option>
                <option value="generic">Generic</option>
                <option value="d2lite_qa">d2lite QA enviornment</option>
                <option value="pr">AEM Product Release enviornment</option>
                <option value="novostaging">novostaging</option>
                <option value="amaze">amaze</option>
                <option value="bws">bws</option>
                <option value="starterkit">starterkit</option>
                </Form.Field>
              </Form.Group>                
            </Message>   
            <Form.Group widths="equal">
              <Form.Input label="IP" placeholder="Enter the optional IP address"  name="ip" value={formData.ip} onChange={this.handleChange} />
              <Form.Input label="DNS" placeholder="Enter the optional DNS"  name="dns" value={formData.dns} onChange={this.handleChange} />                  
            </Form.Group>        
            
            <Form.Button primary>Trigger test</Form.Button>       
            <Message hidden={!formData.showStatus} negative={formData.errorStatus} positive={formData.successStatus}>
              <Message.Header>Status</Message.Header>
              <p>{formData.feedback}</p>
            </Message>   
          </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </div>
    )

  }
}
export default Tests;
