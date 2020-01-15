
import React, {Component} from 'react';
import './daypicker.css';

class DayPicker extends Component {

  state = { 
    days: [ 
      [0,0,0], // monday
      [0,0,0], // tuesday
      [0,0,0], // wednesday
      [0,0,0], // thursday
      [0,0,0], // friday
    ],
    dayList:  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    shortDayList:  ['M','T','W','Th','F']
  }

  componentDidMount() {
    var currentWeek = this.props.data["currentWeek"];
    var weekData = this.props.data["week_" + currentWeek ];
    var da = weekData.split(":");
    var t = [];

    for (var j=0; j < da.length; j++) {
        t.push( da[j].split(",").map( x => parseInt(x)) );
    }
    
    this.setState( {days: t} );
  }

  updateDay = (e) => {
    var day = e.target.dataset['day']; 
    var idx = e.target.dataset['time']; 
    
    /*
    var daysCopy = JSON.parse(JSON.stringify(this.state.days))
    daysCopy[day][idx] = 0;
    this.setState({days: daysCopy});
    */
    var days =  this.state.days ;
    days[day][idx] = ( this.state.days[day][idx] === 1 ? 0 : 1 ) ;
    this.setState( { days } );

    // have our main app update the database with the new state
    this.props.updateState( days );
  }

  render() {

    var gui = [];
    for (var i=0; i < this.state.days.length; i++) {
      gui.push( 
        <div class="dayPickerDay">
          <div class="dayPickerDayName">{this.state.dayList[i] }</div> 
         
          <div 
            className={"dayPickerDay_11 " +  (this.state.days[i][0] === 0 ? 'dayPickerNotSelected' : 'dayPickerSelected')} 
            data-day={i} 
            data-time="0" 
            onClick={this.updateDay} >
          </div>

          <div 
            className={"dayPickerDay_12 " +  (this.state.days[i][1] === 0 ? 'dayPickerNotSelected' : 'dayPickerSelected')} 
            data-day={i} 
            data-time="1" 
            onClick={this.updateDay} >
          </div>
          
          <div 
            className={"dayPickerDay_1 " +  (this.state.days[i][2] === 0 ? 'dayPickerNotSelected' : 'dayPickerSelected')} 
            data-day={i} 
            data-time="2" 
            onClick={this.updateDay} >
          </div>


        </div>
    );
    }

    return (
      <div class="DayPicker">
        <div class="DayPickerContainer">
        
        <div class="dayPickerDay">
          <div class="dayPickerDayName"></div>
          <div class="dayPickerDayName">11 oclock</div>
          <div class="dayPickerDayName">12 oclock</div>
          <div class="dayPickerDayName">1 oclock</div>
        </div>

        { gui }
        </div>
      </div>
    );
  }
}
export default DayPicker;
