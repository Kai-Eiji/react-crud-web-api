import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddTutorial from "./components/add-tutorial.component";
import Tutorial from "./components/tutorial.component";
import TutorialsList from "./components/tutorials-list.component";

import Amplify, { Auth, Hub } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

Amplify.configure({
    Auth: {

        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'us-east-2:aa1f05b2-48d5-4003-bdfc-2b3d88e3bc4d',

        // REQUIRED - Amazon Cognito Region
        region: 'us-east-2',

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
        // Required only if it's different from Amazon Cognito Region
        identityPoolRegion: 'us-east-2',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-east-2_Uz9mrdMIo',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '69a6cj7k94bqa4r3kr4njmj4q6',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: true,

        // OPTIONAL - customized storage object
        //storage: MyStorage,

        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        authenticationFlowType: 'USER_PASSWORD_AUTH',

         // OPTIONAL - Hosted UI configuration
        oauth: {
            domain: 'tutorials.auth.us-east-2.amazoncognito.com', //your_cognito_domain 
            scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
            redirectSignIn: 'https://master.d3551xzr2tgm66.amplifyapp.com/tutorials/callback.com',
            redirectSignOut: 'https://master.d3551xzr2tgm66.amplifyapp.com/signout.com',
            responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
        }
    }
});
// You can get the current config object
const currentConfig = Auth.configure();

class App extends Component {

  state = { user: null, customState: null };

  componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          this.setState({ user: data });
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user }))
      .catch(() => console.log("Not signed in"));
  }


  render() {
    const { user } = this.state;
    console.log(user);
    if(user){
      return (
        <div>
          <div>
            <AmplifySignOut />
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <a href="/tutorials" className="navbar-brand">
                Kai App
              </a>
              <div className="navbar-nav mr-auto">

                <li className="nav-item">
                  <Link to={"/tutorials"} className="nav-link">
                    Tutorials
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/add"} className="nav-link">
                    Add
                  </Link>
                </li>
                <span class="navbar-text">
                  User Name: {user.username}
                </span>

                <form class="form-inline">
                  <div className="ml-3">
                    <button class="btn btn-sm btn-outline-secondary" type="button" onClick={() => Auth.signOut()}>Sign Out</button>
                  </div>
                </form>

              </div>
            </nav>
  
            <div className="container mt-3">
              <Switch>
                <Route exact path={["/", "/tutorials", "/callback.com"]} component={TutorialsList} />
                <Route exact path="/add" component={AddTutorial} />
                <Route path="/tutorials/:id" component={Tutorial} />
              </Switch>
            </div>
          </div>
  
          
        </div>
  
  
      );
    }
    else{
      return(
        <div>
            <p>Not signed in</p>
            {user ? (
              <button onClick={() => Auth.signOut()}>Sign Out</button>
            ) : (
              <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
            )}
        </div>
      );
    }
    
  }
}

//export default withAuthenticator(App);
export default App;

