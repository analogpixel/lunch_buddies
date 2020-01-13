
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { GoogleLogin } from 'react-google-login';

class App extends Component {

  state = { 
    login_id: '' 
  }
  
  responseGoogle = (c) => { 
    this.setState( {login_id: c.w3.U3 } );
    console.log("We got a login!!!", c.w3.U3); 
  }

  fail(c) { console.log("we got a fail!", c);  }

  render() {
    return (
      <div className="App">
    
      <GoogleLogin
    clientId="704980526855-oi7qr4tk5v2nkk5l02gnn91o2cbjdmce.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={this.responseGoogle}
    onFailure={this.fail}
    cookiePolicy={'single_host_origin'}
    />

      </div>
    );
  }
}
export default App;
