
import React, {Component} from 'react';
import './dateviewer.css';
import Async from "react-async"
import { day_list, hour_list } from "./vars/vars";

class DateViewer extends Component {

  state = { 
  }


  loadJson = async () => {
    // var res = await fetch("http://localhost:8000/getLunchDates");
    var res = await fetch(this.props.URL + "/getLunchDates");

    if (! res.ok ) { console.log("error:",  res.statusText ); } else { console.log("Data loaded")};

    res = await res.json();
    var json = JSON.parse(res);

    this.setState({data: json});
    return json;
  }



  render() {
    return (
      <div className="DateViewer">
        <Async promiseFn={this.loadJson}>
        <Async.Loading> Loading... </Async.Loading>
        <Async.Resolved>
        {data => (
          <div>
          <h1>Lunches Scheduled this week</h1>
          { data.map( f => 
            <div className="DateViewer_section">
              <div className="DateViewer_header">
                  { day_list[f['day']]} at &nbsp;   
                  { hour_list[f['time']]} with:
              </div> 
              <div className="DateViewer_list">
                { f['mail_list'].map( d => <li>{d}</li> ) }  
              </div> 
            </div>
          ) 
          }
          </div>)
        }
        </Async.Resolved>
        <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
        </Async>
      </div>
    );
  }
}

export default DateViewer;
