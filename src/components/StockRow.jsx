//StockRow.js
import React, { Component } from 'react';
import $ from 'jquery';
import '../styles/hint.min.css'

class StockRow extends Component {
    constructor(props){
        super(props);
        this.unwatch = this.unwatch.bind(this);
        
    }
    unwatch(){
        this.props.unwatchStockHandler(this.props.stock.symbol);
    }

    render() {
      
       var lastClass = '',
            changeClass = 'change-positive',
            iconClass = 'glyphicon glyphicon-triangle-top';

            lastClass = this.props.stock.change < 0 ? 'last-negative hint--bottom-right' : 'last-positive hint--bottom-right';
        
        if(this.props.stock.change < 0){
            changeClass = 'change-negative hint--bottom-right';
            iconClass = 'glyphicon glyphicon-triangle-bottom';
        }

        return (
             <tr>
                <td id = {this.props.stock.symbol} onClick={() => { this.props.handleTr(this.props.stock.symbol) }} 
                aria-label="點選股票來查看歷史資料" className="hint--bottom-right">{this.props.stock.symbol}</td>

                <td className = {lastClass} aria-label="點選股票來查看歷史資料"  onClick={() => { this.props.handleTr(this.props.stock.symbol) }} >{this.props.stock.last}</td>
              
                <td className = {changeClass} aria-label="點選股票來查看歷史資料"  onClick={() => { this.props.handleTr(this.props.stock.symbol) }} > {this.props.stock.change}
                    <span className = {iconClass} aria-hidden = "true"></span>
                </td>
                 
                <td>
                    <button type="button" className="btn btn-default btn-sm" onClick={this.unwatch}>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                    </button>
                </td>
            </tr>
        );
    }
}

export default StockRow;