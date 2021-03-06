const mongoose = require('mongoose')
const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport')
const keys = require('./config/keys')
const bodyParser = require('body-parser');
require('./models/User')
require('./models/Survey')
require('./services/passport')

mongoose.connect(keys.mongoURI)

const app = express()

app.use(bodyParser.json())
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)
app.use(passport.initialize())
app.use(passport.session())


require('./routes/authRoutes')(app)
require('./routes/billingRoutes')(app)
require('./routes/surveyRoutes')(app)

if(process.env.NODE_ENV === 'production') {
  // express will serve up production asset
  // like main.js or main.css
  // route exist in express
  app.use(express.static('client/build'))


  // express will serve up index.html
  // if it doesn't recognize the route
  // react router responde for this route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })

}

app.get('/', (req, res) => {
  res.send({hi: "Dustin Doan"})
})


const PORT = process.env.PORT || 5000;

app.listen(PORT)