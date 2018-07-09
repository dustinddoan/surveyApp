import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Payment from './Payment';
class Header extends Component {
  renderUser() {
    let imageUrl = this.props.photoUrl

    switch (this.props.user) {
      case null:
        return;
      case false:
        return (
          <li>
            <a href="/auth/google">Login With Google</a>
          </li>
        )
      default:
        return (
          <ul>
            <li>Hi {this.props.user.displayName}</li>
            <li>Credits: {this.props.user.credits}</li>
            <li><Payment /></li>
            <li><img src={imageUrl} alt=""/></li>
            <li><a href="/api/logout"><font color="blue">Logout</font></a></li>
          </ul>
        )
    }
  }

  render() {
    console.log('user props header: ', this.props.user)
    return(
        <nav>
          <div className="nav-wrapper">
            <Link 
              to={this.props.user ? '/surveys' : '/' } 
              className="left brand-logo"
            >Emaily</Link>
            <ul className="right">
              {this.renderUser()}
            </ul>
          </div>
        </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth
  }
}
// define the props user and get value from state.auth (auth: authReducer)

export default connect(mapStateToProps)(Header);