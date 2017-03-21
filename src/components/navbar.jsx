import React, { Component } from 'react';
import timezone from 'moment-timezone';
import moment from 'moment';

class navbar extends Component {
    constructor(){
        super();
        //美股於台灣21:30-隔日凌晨4點交易，
        //當地交易時間(美東時間) 星期一至星期五	09:30AM - 04:00PM
  
        this.state = {
            timezone: timezone().tz("America/New_York"),
            upperTime: timezone().tz("America/New_York").set({'hour': 9 , 'minute': 30}),
            lowerTime: timezone().tz("America/New_York").set({'hour': 16}),

        };
        this.tick = this.tick.bind(this);
    };

    componentDidMount() {
        setInterval(this.tick, 60000);
    }
    
    tick(){
        let ameDate = timezone().tz("America/New_York");
        this.setState({timezone: ameDate})
    }

    render() {
        let marketstate = '';

        if (this.state.timezone > this.state.upperTime && this.state.timezone  < this.state.lowerTime) {
            marketstate = <font color ="#00E000"> 開市 </font>;
        } else {
            marketstate = <font color ="red"> 已收盤 </font>;
        }


        return (
            <div>
               <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="" >美股觀察</a>
                        <a className="navbar-brand" href="https://github.com/flameddd/react_stocks" >Github</a>
                        <span className="navbar-brand" >美股狀態：{marketstate} 
                        </span>
                   
                    </div>
            </nav> 
            </div>
        );
    }
}

export default navbar;

            