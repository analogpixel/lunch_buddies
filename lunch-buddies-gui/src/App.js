
import React, {Component} from 'react';
import './App.css';
import { GoogleLogin } from 'react-google-login';
import DayPicker from './components/daypicker';
import $ from "jquery";
import Async from "react-async"

class App extends Component {

  URL = "http://localhost:8000"

  state = { 
    login_id:  'matt.poepping2@gmail.com'
  }

  responseGoogle = (c) => { 
    this.setState( {login_id: c.w3.U3 } );
    console.log("We got a login!!!", c.w3.U3); 
  }

  fail(c) { console.log("we got a fail!", c);  }

  dbStateUpdate = (d) => {
    console.log("State update called", d); 
    $.post(this.URL + "/updateTime", JSON.stringify({times: d.join(":") , login_id: this.state.login_id }) )  ;
  }

  loadJson = () =>
    fetch("http://localhost:8000/getTime/" + this.state.login_id)
    // .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json())
    .then(res => JSON.parse(res));

  render() {

    if (  this.state.login_id ) {
      return (
        <Async promiseFn={this.loadJson}>
            <Async.Loading> Loading... </Async.Loading>
            <Async.Rejected>{ error => error.message} </Async.Rejected>
            <Async.Resolved>
             {data => (
              <div>
              <strong>Loaded some data: {typeof(data)} </strong>
              <DayPicker data={data} updateState={this.dbStateUpdate}/>
               <pre> { data['login_id'] }</pre>
              </div>
             )}
            </Async.Resolved>
        </Async>
            );
    } else {
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
}
export default App;
