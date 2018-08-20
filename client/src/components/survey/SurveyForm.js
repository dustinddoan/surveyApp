import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form'
import {Link} from 'react-router-dom'
import SurveyField from './SurveyField'
import formFields from './formFields'
import validateEmails from '../../utils/validateEmails'
import _ from 'lodash'



class SurveyForm extends Component {
  renderFileds() {
    return _.map(formFields, ({label, name}) => {
      return <Field key={name} component={SurveyField} type="text" label={label} name={name} />
    })
  }
  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)} >
          {this.renderFileds()}
          <Link to="/surveys" className="red btn-flat left white-text">
            Cancel
            <i className="material-icons right">cancel</i>
          </Link>
          <button className="teal btn-flat right white-text" type="submit">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    )
  }
}

function validate(values) {
  const errors = {};
  
  errors.recipients = validateEmails(values.recipients || '')

  _.each(formFields, ({name}) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value'
    }
  })


  return errors;
}

// reduxForm as connect function
export default reduxForm({
  validate: validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm)