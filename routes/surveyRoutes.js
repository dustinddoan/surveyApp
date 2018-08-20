const _ = require('lodash')
const Path = require('path-parser').default
const { URL } = require('url')
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const requireCredits = require('../middlewares/requireCredits')
const Mailer = require('../services/Mailer')
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('surveys')

module.exports = app => {

  app.get('/api/surveys', async (req, res) => {
    const surveys = await Survey.find({ _createdUser: req.user.id})
      .select({ recipients: false});
    res.send(surveys)
  })


  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('thank for voting')
  })

  app.post('/api/surveys/webhooks', (req, res) => {
    // console.log(req.body)
    const p = new Path('/api/surveys/:surveyId/:choice');

    //update using mongo operator
    _.chain(req.body)
      .map( event => {
        const urlRoute = new URL(event.url).pathname
        const match = p.test(urlRoute)

        if ( match ) {
          return { email: event.email, surveyId: match.surveyId, choice: match.choice}
        }
      })
      .compact()
      .uniqBy('email', 'surveyId')
      .each( ({email, surveyId, choice}) => {
        // console.log('email: ', email)
        // console.log('surveyId: ', surveyId)
        // console.log('choice: ', choice)

        Survey.updateOne({
          _id: surveyId,
          recipients: { $elemMatch: { email: email, responded: false} }
        }, {
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responded': true },
          lastResponded: new Date()
        }).exec()
      })
      .value()
    
    res.send({})
  })

  app.get('/api/surveys/webhooks', (req, res) => {
    res.send({hi: "testing"})
  })

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const {title, body, subject, recipients} = req.body

    const survey = new Survey({
      title,
      subject,
      body, 
      recipients: recipients.split(',').map( email => ( {email: email.trim()} ) ),
      _createdUser: req.user.id,
      dateSent: Date.now()
    })

    // send email
    const mailer = new Mailer(survey, surveyTemplate(survey));


    try {
      await mailer.send();
      await survey.save()
      req.user.credits -= 1
      
      const user = await req.user.save()

      res.send(user)
    } catch(err) {
      res.status(422).send(err)
    }

  })
}