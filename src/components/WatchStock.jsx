import React, { Component } from 'react';
import style from '../styles/style.css';
import Multiselect from './Multiselect';

class WatchStock extends Component {

  constructor() {
    super();
    this.state = {
      symbol: "",
    };
    this.watchStock = this.watchStock.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

    watchStock(){
        //console.log(this.state.symbol);
        this.props.watchStockHandler(this.state.symbol);
        this.setState({symbol: ''});
        this.refs.mulsel.clearSelected();
    }

    handleChange(event){
        this.setState({symbol: event.target.value});
    }

    getSelected(event){
        this.setState({symbol: event});
    }


    render() {
        return (
            <div className = {style.row}>
             <h4> 美股於台灣時間 21:30PM - 04:00AM 交易，「開市」時下方的股價資訊就會定時更新、「已收盤」時即不更新．此外可以透過下方的選擇列表新增想加入的公司來查看股價．</h4>
        

              <div className="input-group">
                  <Multiselect getSelected = { selValue => {this.getSelected(selValue)} } ref="mulsel" />
                 <span className = "input-group-btn">
                    <button className="btn btn-default" type="button" onClick = {this.watchStock}>
                        <span className = "glyphicon glyphicon-eye-open" aria-hidden = "true"></span> 新增公司加入
                    </button>
                 </span>
             </div>
             
               
            </div>
        );
    }
}

export default WatchStock;