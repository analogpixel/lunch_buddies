
import React, {Component} from 'react';
import './datemaker.css';
import Async from "react-async"

class DateMaker extends Component {

  state = { 
    dayName:  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ],
    timeName: ['11:00', '12:00', '1:00']
  }


  loadJson = async () => {
    var res = await fetch("http://localhost:8000/getWeek");

    if (! res.ok ) { console.log("error:",  res.statusText ); } else { console.log("Data loaded")};

    res = await res.json();
    var json = JSON.parse(res);

    this.setState({data: json});
    return json;
  }


  // have the main app create this for us because we are just a stupid compontent
  create_lunch_date = () => {
    this.props.create_lunch_date(this.props.time, this.props.day, this.props.mail_list); 
  }

  render() {
    return (
      <div className="DateMaker">
        make a lunch date on { this.state.dayName[this.props.day] } starting at  {this.state.timeName[this.props.time]} including:
      { this.props.mail_list.map( f => <li>{f}</li> ) }.
      <button onClick={this.create_lunch_date}> Create Lunch Date</button>
      </div>
    );
  }
}

export default DateMaker;
