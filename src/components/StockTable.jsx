//StockTable.js
import React, { Component } from 'react';
import StockRow from './StockRow.jsx';

class StockTable extends Component {
    constructor(props){
        super(props);
        this.state={
            rowStocks : []
        };
        this.handleTr = this.handleTr.bind(this);
    };

    handleTr(symbolName) {
       this.props.handleChangeHisStock(symbolName);
    }
 
    render() {
        var items = [];
        for(var symbol in this.props.stocks){
            var stock = this.props.stocks[symbol];
            items.push(<StockRow key={stock.symbol} stock={stock} last={this.props.last} unwatchStockHandler = {this.props.unwatchStockHandler} handleTr = { symbolName => {this.handleTr(symbolName)}} />);
        }

        return (
            <div className = "row">
                <table className = "table-hover" >
                    <thead>
                        <tr onClick = {this.handleTr}>
                            <th>代號</th>
                            <th>股價</th>
                            <th>漲幅</th>
                            <th>移除</th>
                        </tr>                    
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default StockTable;