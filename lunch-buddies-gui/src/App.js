
import React, {Component} from 'react';
import './App.css';
import { GoogleLogin } from 'react-google-login';
import DayPicker from './components/daypicker';
import GroupCalendar from './components/groupcalendar';
import DateMaker from './components/datemaker';
import DateViewer from './components/dateviewer';
import $ from "jquery";
import Async from "react-async"

import logo_img from './resources/logo.png';
import cal_img from './resources/calendar.png';
import check_img from './resources/checkTimes.png';
import schedLunch_img from './resources/schedLunch.png';

class App extends Component {

  URL = "http://localhost:8000"

  state = { 
    app_state: 'login',
    login_id:  'matt.poepping2@gmail.com'
  }

  responseGoogle = (c) => { 
    this.setState( {login_id: c.w3.U3, app_state: 'set_calendar' } );
    console.log("We got a login!!!", c.w3.U3); 
  }

  fail(c) { console.log("we got a fail!", c);  }

  dbStateUpdate = (d) => {
    console.log("State update called", d); 
    $.post(this.URL + "/updateTime", JSON.stringify({times: d.join(":") , login_id: this.state.login_id }) )  ;
  }

  // bring up a page to confirm the details for this lunch date
  createMeeting = (time,day, mail_list) => {
    console.log("Create a meeting dialog time:" , day,time, mail_list);
    this.setState( { app_state: 'create_date', time: time, day: day, mail_list: mail_list });
  }

  // write to the database to create the lunch date
  create_lunch_date = (time,day, mail_list) => {
    console.log("ok create the date", day, typeof(day), JSON.stringify({ day:day}) );
    $.post( this.URL + "/createLunchDate", JSON.stringify( {day: day , time: time, mail_list: mail_list} ));
    this.setState( {app_state: 'set_calendar'} );
  }

  loadJson = () =>
    fetch("http://localhost:8000/getTime/" + this.state.login_id)
    // .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json())
    .then(res => JSON.parse(res));

  render() {

    if (  this.state.app_state == 'set_calendar' ) {
      return (
        <Async promiseFn={this.loadJson}>
            <Async.Loading> Loading... </Async.Loading>
            <Async.Rejected>{ error => error.message } Failed to Load </Async.Rejected>
            <Async.Resolved>
             {data => (
              <div>
              <strong>Loaded some data: {typeof(data)} </strong>
              <DayPicker data={data} updateState={this.dbStateUpdate}/>
          <DateViewer />
               <GroupCalendar createMeeting={this.createMeeting}/>
               <pre> { data['login_id'] }</pre>
              </div>
             )}
            </Async.Resolved>
        </Async>
            );
    } else if (this.state.app_state == 'create_date') {
      return (
        <div className="App">
          <DateMaker create_lunch_date={this.create_lunch_date} time={this.state.time} day={this.state.day} mail_list={this.state.mail_list}/>
        </div>
      )

    } else if (this.state.app_state == 'login') {
      return (
        <div className="App">
          <div className="App_header">
            <div className="App_header_content">
              <div className="App_header_text_large">Lunch Buddies</div>
              <div className="App_header_text_small">Find somebunny to eat with!</div>
              <img className="App_header_img" src={logo_img} />
              </div>
          </div>

          <div className="App_how_it_works">
            How it works
          </div>

          <div className="App_steps App_step1">
              <img className="App_steps_img" src={cal_img} />
              <div className="App_steps_text_large">Setup Times</div>
              <div className="App_steps_text_small">
              update your calendar for all the times you are available for lunch this week.
              </div>
          </div>
          
          <div className="App_steps App_step2">
              <img className="App_steps_img" src={check_img} />
              <div className="App_steps_text_large">Check Calendar</div>
              <div className="App_steps_text_small">
              Check the calendar for the week, and see who else is available when you want to have lunch.
              </div>
          </div>

          <div className="App_steps App_step3">
              <img className="App_steps_img" src={schedLunch_img} />
              <div className="App_steps_text_large">Schedule Lunch</div>
              <div className="App_steps_text_small">
              Schedule a lunch for this week. Once you schedule, others can join in later.
              </div>
          </div>


            <div className="App_login">
              <div className="App_login_text"> 
              Login and Give it a Try: <br/><br/>
              <GoogleLogin
              clientId="704980526855-oi7qr4tk5v2nkk5l02gnn91o2cbjdmce.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={this.responseGoogle}
              onFailure={this.fail}
              cookiePolicy={'single_host_origin'}
              />
            </div>
          </div>
          <div className="App_footer"><br/><br/></div>
        </div>
      );
    }

  }
}
export default App;
