import React from 'react';
import {BrowserRouter as Router, Route, hashHistory} from 'react-router-dom';
import { Provider } from 'react-redux';
// import './App.css';
import ForgotPassword from './components/forgotPassword';
import Users from './components/users';
import Reset from './components/reset';
import WrappedLoginForm from './components/signIn';
import WrappedRegistrationForm from './components/signUp';
import Message from './components/message';
import { createStore } from 'redux';
import  userslist  from './reducers/reducer';

var store = createStore(userslist, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
        <Route exact path='/' component={WrappedLoginForm} />
        <Route path='/signup' component={WrappedRegistrationForm} />
        <Route path='/forgotpassword' component={ForgotPassword} />
        <Route path='/users' component={Users} />
        <Route path='/reset/:token' component={Reset} />
        <Route path='/message' component={Message} />
        </Router>
      </Provider>
    )
  }
 
}

export default App;
