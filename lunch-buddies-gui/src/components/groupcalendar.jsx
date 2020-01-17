
import React, {Component} from 'react';
import './groupcalendar.css';
import Async from "react-async"

class GroupCalendar extends Component {

  state = { 
    data: [],
    dayName:  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ]
  }

  componentDidMount() {

  }

  loadJson = async () => {
    var res = await fetch("http://localhost:8000/getWeek");

    if (! res.ok ) { console.log("error:",  res.statusText ); } else { console.log("Data loaded")};

    res = await res.json();
    var json = JSON.parse(res);

    this.setState({data: json});
    return json;
  }

  // return a list of people that are available in this time slot
  getPeople = (t,d) => {
   var plist = [];
   for (var people=0;  people < this.state.data.length; people++) {
        var dayData = this.state.data[people][1].split(':').map( f => f.split(",").map( f => parseInt(f) )) ;
        if (dayData[d][t] == 1) { plist.push( this.state.data[people][0]); }
    }
   return plist; 
  }

  createMeeting = (e) => {
    var t = e.target.dataset['time'];
    var d = e.target.dataset['day'];
    this.props.createMeeting( t,d, this.getPeople(t,d) )
  }

  render() {

    // convert 0,0,0:0,1,0:1,0,0:0,0,1:1,1,0  into int arrays for each day
    // var theWeek = this.state.data[j][1].split(":").map( f => f.split(",").map( f => parseInt(f) ));

    var html = [];

    // for all the days in the week
    for (var weekDay=0; weekDay < 5; weekDay++) {
      html.push( <h1>Day {this.state.dayName[weekDay]}</h1> );


      html.push( <div class="groupcalendar_timebar">
        <div class="groupcalendar_timebar_header"><button data-time="0" data-day={weekDay} onClick={ this.createMeeting }>+ 11:00</button></div> 
        <div class="groupcalendar_timebar_header"><button data-time="1" data-day={weekDay} onClick={ this.createMeeting }>+ 12:00</button></div> 
        <div class="groupcalendar_timebar_header"><button data-time="2" data-day={weekDay} onClick={ this.createMeeting }>+ 1:00</button></div> 
        </div>
      );

      // loop through all the people
      for (var people=0;  people < this.state.data.length; people++) {

        // get the data for this person on this day
        var dayData = this.state.data[people][1].split(':')[weekDay].split(",").map( f => parseInt(f) ) ;

        // fill out the graph for this person on this day
        html.push(  <div class="groupcalendar_timebar"> { dayData.map( f =>  (<div class={"groupcalendar_timebar_" + f} />)) } {this.state.data[people][0] } </div>);
        }
      }

      return (
        <div class="GroupCalendar">
        <Async promiseFn={this.loadJson}>
        <Async.Loading> Loading... </Async.Loading>
        <Async.Resolved>
        {data => (
          <div>
          {html}
          </div>
        )}
        </Async.Resolved>
        <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
        </Async>
      </div>
            );

  }
}

export default GroupCalendar;
