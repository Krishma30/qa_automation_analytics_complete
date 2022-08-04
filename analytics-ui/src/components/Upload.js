import React, { Component } from 'react';
import AWS from 'aws-sdk';
import 'react-table/react-table.css';
import ReactTable from 'react-table';
import { uploadColumns } from '../helpers/tableHelpers';
import {
  Message,
  Form,
  Modal,
  Divider,
  Grid,
  Button,
  Header,
  Icon
} from 'semantic-ui-react';

const CSV_ENDPOINT = `${process.env.REACT_APP_TESTING_API_ENDPOINT}/bulkTests`;
const S3_BUCKET_REGION = process.env.REACT_APP_S3_REGION;
const IDENTITY_POOL_ID = process.env.REACT_APP_S3_IDENTITY_POOL_ID;
const S3_BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME;
const URL = `${process.env.REACT_APP_TESTING_API_ENDPOINT}/bulkAddBulkTestSet`;

AWS.config.update({
  region: S3_BUCKET_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID
  })
});

const S3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {
    Bucket: S3_BUCKET_NAME
  }
});

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      loading: true,
      errorMessage: 'Error',
      hideErrorBar: true,
      form: {
        csvFile: '',
        csvFileUpload: '',
        exclusions: '',
        csvFileError: false,
        showStatus: false,
        feedback: ''
      }
    };
  }
  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    this.setState({ loading: true });
    fetch(CSV_ENDPOINT)
      .then(results => {
        return results.json();
      })
      .then(data => {
        if (data && data.length > 0){
          data.sort((a, b) => new Date(b.date) - new Date(a.date));
          this.setState({ data: data });
          this.setState({ loading: false });
        }
      });
  };
  toggleModal = () => {
    const newState = this.state.modalOpen;
    this.setState({ modalOpen: !newState });
  };
  setFormState = (name, value) => {
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [name]: value
      }
    }));
  };
  uploadCsv = () => {
    const formData = this.state.form;

    if (formData.csvFileUpload !== '') {
      this.saveToDB(formData);
      this.uploadToS3(formData);
    } else {
      this.setFormState('showStatus', true);
      this.setFormState('csvFileError', true);
      this.setFormState('feedback', `Please fill in all the required fields`);
    }
  };
  saveToDB(formData) {
    const postData = {
      key: formData.csvFileUpload.name,
      exclusions: formData.exclusions
    };
    this.setFormState('showStatus', false);
    const fetchData = {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    fetch(URL, fetchData)
      .then(res => res.json())
      .catch(error => {
        this.setState({ errorMessage: `Error saving to db: ${error}` });
        this.setState({ hideErrorBar: false });
      })
      .then(() => {
        this.setState({ modalOpen: false });
        this.loadData();
      });
  }
  uploadToS3(formData) {
    const fileName = formData.csvFileUpload.name;
    const objectKey = fileName;
    const self = this;
    S3.upload(
      {
        Key: objectKey,
        Body: formData.csvFileUpload,
        ACL: 'public-read'
      },
      function(err) {
        if (err) {
          self.setState({
            errorMessage: `Error uploading file to s3: ${err.message}`
          });
          self.setState({ hideErrorBar: false });
        }
        // REFRESH TABLE
      }
    );
  }
  handleChange = event => {
    this.setFormState('showStatus', false);
    const name = event.target.name;
    const value = event.target.value;
    this.setFormState([name], value);

    if (event.target.files) {
      const csvFileUpload = event.target.files[0];

      if (csvFileUpload.name.endsWith('.csv')) {
        this.setFormState('csvFileUpload', csvFileUpload);
      } else {
        // not a csv file
        this.setFormState('showStatus', true);
        this.setFormState('csvFileError', true);
        this.setFormState('feedback', `File must have extension .csv`);
      }
    }
  };
  render() {
    const formData = this.state.form;
    return (
      <div>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column key={1}>
              <Header size="large">
                <Icon name="upload" />
                Upload CSV
              </Header>
            </Grid.Column>
            <Grid.Column key={2}>
              <Button
                size="small"
                onClick={this.loadData}
                animated="vertical"
                floated="right"
              >
                <Button.Content hidden>Refresh</Button.Content>
                <Button.Content visible>
                  <Icon name="refresh" />
                </Button.Content>
              </Button>
              <Button
                primary
                size="small"
                onClick={this.toggleModal}
                floated="right"
              >
                <Icon name="upload" />
                Upload new CSV file
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Message hidden={this.state.hideErrorBar} negative={true}>
          {this.state.errorMessage}
        </Message>

        <ReactTable
          data={this.state.data}
          columns={uploadColumns}
          filterable={true}
          className="-striped -highlight"
          loading={this.state.loading}
          // pivotBy={["siteName"]}
        />
        <Modal open={this.state.modalOpen} size="tiny">
          <Modal.Header>
            <Button
              onClick={this.toggleModal}
              floated="right"
              circular
              icon="close"
            />
            <Icon name="upload" />Upload new CSV file
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form onSubmit={this.uploadCsv}>
                <Form.Group>
                  <input
                    type="file"
                    name="csvFile"
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <Form.TextArea
                  label="List of elements to exclude from screenshots"
                  placeholder="A csv list of elements on the page to exclude, eg ('.banner, 'hero-header)"
                  name="exclusions"
                  value={formData.exclusions}
                  onChange={this.handleChange}
                  error={formData.exclusionsError}
                />

                <Form.Button primary>Upload CSV</Form.Button>
                <Message
                  hidden={!formData.showStatus}
                  negative={true}
                  positive={formData.successStatus}
                >
                  <Message.Header>Form validation error</Message.Header>
                  <p>{formData.feedback}</p>
                </Message>
              </Form>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default Upload;
