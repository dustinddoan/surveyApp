import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

// action creator to use redux-thunk
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user')
  
  console.log('fetch user: ', res)
  dispatch({type: FETCH_USER, payload: res.data})
}

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');
  console.log('fetch survey: ', res)
  dispatch({ type: FETCH_SURVEYS, payload: res.data})
}

export const handleToken = (token) => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({type: FETCH_USER, payload: res.data})
}

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values)
  history.push('/surveys')

  dispatch({type: FETCH_USER, payload: res.data})
 
}


