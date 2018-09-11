import React, { Component } from 'react';
import Login from './WePublic/Login';
import AppPublic from './WePublic/AppPublic';
import AppPrivate from './WePrivate/AppPrivate';
import Group from './WePrivate/Group';
import Thread from './WePrivate/Thread';
import { Route, Switch } from 'react-router-dom';

let responseStatus = 0;
class App extends Component {
  constructor() {
    super()

    this.state = {
      user: '',
      psw: '',
      openedErrorFeedback: false,
      responseStatus: false,
      errorClass: "error-hidden",
      groupList: [],
    }
    this.handleInputEmailLoginValue = this
      .handleInputEmailLoginValue
      .bind(this);
    this.handleInputPswLoginValue = this
      .handleInputPswLoginValue
      .bind(this);
    this.handleSubmitLogin = this
      .handleSubmitLogin
      .bind(this);
   
  }

  // componentDidMount() {
  //   this.fecthApi();
  // }

  

  fecthApi() {
    console.log("state", this.state.user)
    fetch('http://adalab.string-projects.com/api/v1/sessions', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        "nickname": this.state.user,
        "password": this.state.psw
      })
    }).then((response) => {
      responseStatus= response.status;
      if (response.ok){
          return response.json()
          .then((data) => {
            console.log(data)
            this.savedToken(data.user.auth_token)
            console.log(data.user.auth_token);
            this.setState({errorClass: "error-hidden", groupList: data.groups})
            fetch('http://adalab.string-projects.com/api/v1/posts', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'AUTH-TOKEN': localStorage.getItem('token')
      }
    })
      .then((response) => 
      response.json())
      .then((json) => {
      this.setState({messages: json})
    })
          });
        }  else {
          this.setState({errorClass: ""})
          console.log("soy el estado", this.state.responseStatus);
        }
        
    })
    
  }

  savedToken(token) {
    localStorage.setItem('token', token)
  }


  handleInputEmailLoginValue(e) {

    const {
      value
    } = e.target;
    this.setState({
      user: value
    })

  }

  handleInputPswLoginValue(e) {

    const {
      value
    } = e.target;
    this.setState({
      psw: value
    })

  }

  handleSubmitLogin(e) {
    e.preventDefault();
    console.log("entra submit")
    this.fecthApi();
  }


  render() {
    const { openedErrorFeedback } = this.state;
    const routePrivate = '/private';
    const routePublic = '/';
    const routeGroup = '/group';
    const routeThread = '/thread';
    const groupList = this.props.groupList

    console.log('app openedErrorFeedback', openedErrorFeedback);
    return (
      <div className="container-fluid">
        <Switch>
          <Route
            path={routePrivate}
            render={props =>
              <AppPrivate
                match={props.match}
                routePrivate={routePrivate}
                routePublic={routePublic}
                routeGroup={routeGroup}
                handleFetchGroups={this.handleFetchGroups}
                groupList= {this.state.groupList}
              />
            }
          />
          <Route
            path={routeGroup}
            render={props =>
              <Group
                match={props.match}
                routeGroup={routeGroup}
                routePrivate={routePrivate}
                routePublic={routePublic}
              />
            }
          />
          <Route path={routeThread} component={Thread} />
          <Route
            exact path={routePublic}
            render={props =>
              <AppPublic
                errorClass={this.state.errorClass}
                openedErrorFeedback={openedErrorFeedback}
                toggleErrorFeedback={this.toggleErrorFeedback}
                match={props.match}
                onInputEmail={this.handleInputEmailLoginValue}
                onInputPsw={this.handleInputPswLoginValue}
                onSubmitBtn={this.handleSubmitLogin}
              />
            }
          />
        </Switch>
      </div>
    );
  }
}

export default App;