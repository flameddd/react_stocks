// app.js

import { render } from 'react-dom';
import React, { Component } from 'react';

import style from './styles/style.css';
import 'font-awesome-webpack';

import Navbar from './components/navbar.jsx';
import StockTable from './components/StockTable.jsx'
import StockRow from './components/StockRow.jsx'
import WatchStock from './components/WatchStock.jsx'
import feedsocket from './components/feed-socketio.jsx'
import IndexSymbols from './unit/const';

import { timeParse } from 'd3-time-format';
import { tsvParse } from "d3-dsv";
var parseDate = timeParse("%Y-%m-%d");
import Chart from './components/AreaChartWithEdge.jsx';
import Multiselect from './components/Multiselect';



class HomePage extends Component {
     constructor(props) {
        super(props);
        this.state = {
            stocks: {},
            hisStockSymbol:"",
            hisstockdata:null,
        };
        this.watchStock = this.watchStock.bind(this);
        this.unwatchStock = this.unwatchStock.bind(this);
        this.handleChangeHisStock = this.handleChangeHisStock.bind(this);
    }
    
    componentWillMount() {
        feedsocket.feed.watch(IndexSymbols.IndexSymbols);
        feedsocket.feed.onChange(function(stock){
            this.setState({stocks: stock});
        }.bind(this));
     }
    
    componentDidMount() {

       fetch("http://" + document.domain + '/getHisData',{
           method: "POST",
           headers:{'Content-Type':'application/x-www-form-urlencoded'},
           body: "getHisStock=NASDAQ_GOOG"
       })
        .then(response => response.text())
        .then(data => 
                tsvParse(data, d => {
                d.date = new Date(parseDate(d.date).getTime()); //error getTome
                d.open = +d.open;
                d.high = +d.high;
                d.low = +d.low;
                d.close = +d.close;
                d.volume = +d.volume;
               
                return d;
            }))
            .then(data => {
                this.setState({hisstockdata:data})
		    }).catch(
                this.setState({hisstockdata:null})
            );

    }
    
    watchStock(symbols){
        symbols = symbols.replace(/ /g,'');
        var arr = symbols.split(",");
        feedsocket.feed.watch(arr);
    }

    unwatchStock(symbol){
        feedsocket.feed.unwatch(symbol);
        var stocks = this.state.stocks;
        for(let i = 0; i < stocks.length ; i++){
            if(stocks[i].symbol === symbol){
                stocks.splice(i, 1);
            }
        }
        this.setState({stocks: stocks});
    }
    
    handleChangeHisStock(hs){
        //Usr選擇了某隻股票，去抓歷史資料
       fetch("http://" + document.domain + '/getHisData',{
           method: "POST",
           headers:{'Content-Type':'application/x-www-form-urlencoded'},
           body: "getHisStock=" + hs 
       })
        .then(response => response.text())
        .then(data => 
                tsvParse(data, d => {
                d.date = new Date(parseDate(d.date).getTime()); //error getTome
                d.open = +d.open;
                d.high = +d.high;
                d.low = +d.low;
                d.close = +d.close;
                d.volume = +d.volume;
               
                return d;
            }))
            .then(data => {
                this.setState({hisstockdata:data})
		    }).catch(
                this.setState({hisstockdata:null})
            );

    }

    render() {
        let divhisstockdata = null;

        //conditional render
        if (!this.state.hisstockdata) {
            divhisstockdata = <div className="col-md-6"><i className="fa fa-refresh fa-spin fa-3x fa-fw"></i><span className="sr-only"></span></div>;
        }else{
            divhisstockdata = <div className="col-md-6"><span><h2>{this.state.hisstockdata[0].symbol} : 走勢圖</h2></span>
            <Chart data={this.state.hisstockdata} type="hybrid" width={650} />
            <h4>。用滑鼠左鍵拉走勢圖，往左、右拉查看不同時間點的歷史資料</h4>
            <h4>。用滑鼠滾輪滑動走勢圖，往上、下滑來調整走勢圖區間範圍</h4>
        </div>;
        }

        return (
        <div>
                <Navbar />

            <div className="row">
                <div className="col-md-6">
                <WatchStock watchStockHandler = {this.watchStock} />
                <StockTable 
                    stocks = {this.state.stocks} 
                    last = {this.state.last} 
                    unwatchStockHandler = {this.unwatchStock}
                    handleChangeHisStock = {hs => this.handleChangeHisStock(hs) }
                     />
                <div className = {style.row}>
                    <div className = "alert alert-warning" role ="alert">
                        資料來源：Google finance！資料每１分鐘更新一次．
                    </div>
                </div>
                </div>
            {divhisstockdata}
            </div>
            </div>
        );
    }
}

render(
    <HomePage />,
    document.getElementById('main')
);
 