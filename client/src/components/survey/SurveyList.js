import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchSurveys()
  }

  renderSurveys() {
    return this.props.surveys.reverse().map( survey => {
      return (
        <div className="card darken-1" key={survey._id}>
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title"><i className="material-icons">title</i> {survey.title}</span>
              <p>{survey.body}</p>
              <p className="right">
                Sent On: { new Date(survey.dateSent).toLocaleDateString() }
              </p>
            </div>
            <div className="card-action">
              <a><i className="material-icons">thumb_up</i>  {survey.yes} </a>
              <a><i className="material-icons">thumb_down</i>  {survey.no} </a>
            </div>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div>{this.renderSurveys()}</div>
    )
  }
}

function mapStateToProp(state) {
  return {
    surveys: state.surveys
  }
}

export default connect(mapStateToProp, { fetchSurveys})(SurveyList);
