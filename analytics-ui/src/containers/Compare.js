import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import ComparePagination from '../components/ComparePagination';
import CompareScreens from '../components/CompareScreens';
import CurrentSessionNav from './CurrentSessionNav';
import { connect } from 'react-redux';
import { fetchCompareResults } from '../store/compareResults/actions';
import * as sessionsSelectors from '../store/compareResults/reducers';
import {
  Divider,
  Segment,
  Grid,
  Icon,
  Dimmer,
  Loader,
  Message,
  Menu
} from 'semantic-ui-react';
import {
  zoomIn,
  setDiffAfterAndBeforeBackgrounds,
  getFilename,
  getbaseDomainAndPageUrl,
  setTitles
} from './../helpers/compareHelpers';

const BROWSER = 'Chrome (Puppeteer)';

class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: '',
      firstLoadComplete: false,
      dataLoaded: false
    };
  }

  componentDidMount() {
    const sessionId = this.props.location.pathname.split('/')[2];
    this.setState({ sessionId: sessionId });
    // console.log(this.props);
    // if (!this.props.compareResults) {
    this.props.fetchCompareResults(sessionId);
    // }
    const img = document.getElementsByClassName('pannable-image')[0];
    if (img) {
      img.addEventListener('mousemove', zoomIn);
    }
  }

  selectImage(imagesToCompare) {
    // None of this feels very 'react' could do with a re-write
    const beforeTitle = document.getElementById('beforeImageTitle');
    const afterTitle = document.getElementById('afterImageTitle');
    const diffImageSubTitle = document.getElementById('diffImageSubTitle');
    const diffImageTitle = document.getElementById('diffImageTitle');
    const diffUrl = imagesToCompare.diff.url;
    this.setState({ diffUrl: diffUrl });
    const fileName = getFilename(diffUrl);
    const imgUrlParts = fileName.split('__');
    const path = imagesToCompare.diff.pageUrl;

    setDiffAfterAndBeforeBackgrounds(imagesToCompare);

    // Split path into domain and url parts
    const urlInfo = getbaseDomainAndPageUrl(path);
    const pixels =
      imgUrlParts.length === 1
        ? imgUrlParts[0].replace('_', '')
        : imgUrlParts[1];
    beforeTitle.textContent = urlInfo.baseDomain;
    afterTitle.textContent = urlInfo.baseDomain;

    // set main title as path & link to page being tested
    const titleText = `${urlInfo.pageUrl} (${BROWSER} ${pixels}px) `;
    const titleLink = path;
    this.setState({ titleText: titleText });
    this.setState({ titleLink: titleLink });

    if (imagesToCompare.diff.misMatchPercentage) {
      const icon = `<i aria-hidden="true" class="desktop icon"></i>`;
      diffImageSubTitle.innerHTML = `${icon} ${
        imagesToCompare.diff.misMatchPercentage
      }% diff`;
      diffImageTitle.textContent = `Tolerance ${
        imagesToCompare.diff.tolerance
      }%`;
    }
    setTitles(imagesToCompare);
  }

  updateImage = index => {
    index = parseInt(index, 10);
    if (!this.props.compareResults.noResults) {
      this.selectImage(this.props.compareResults.data[index - 1]);
    }
  };
  getComparePagingation() {
    if (this.props.compareResults.noResults === false) {
      return (
        <ComparePagination
          compareCount={this.props.compareResults.data.length}
          updateImage={this.updateImage}
        />
      );
    }
  }
  render() {
    return (
      <Segment>
        <Dimmer active={this.props.compareResults.loading}>
          <Loader />
        </Dimmer>
        <CurrentSessionNav sessionId={this.state.sessionId} />
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column key={1}>
              <Header size="huge">
                <Icon name="law" />
                Compare Image Differences
              </Header>
            </Grid.Column>
            <Grid.Column key={2} textAlign="right">
              {this.getComparePagingation()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        {!this.props.compareResults.noResults && (
          <div>
            <Menu text>
              <Menu.Item
                data-url={this.state.diffUrl}
                href={this.state.titleLink}
                target="_blank"
              >
                <Icon name="linkify" /> {this.state.titleText}
              </Menu.Item>
            </Menu>
            <Divider />
          </div>
        )}
        <Message
          negative
          icon="warning sign"
          header="No results"
          content="No diff images found to compare"
          hidden={!this.props.compareResults.noResults}
        />
        <CompareScreens hidden={this.props.compareResults.noResults} />
      </Segment>
    );
  }
}

function mapStateToProps(state) {
  return {
    compareResults: sessionsSelectors.getCompareResults(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCompareResults(sessionId) {
      dispatch(fetchCompareResults(sessionId));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
