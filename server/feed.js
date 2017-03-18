//feed.js
var IndexSymbols = require('../src/unit/const');
var interval,
    onChangeHandler;

var googleStocks = require('google-stocks');
 
/*{ id: '22788',  ID
    t: 'CVS',   股票代碼
    e: 'NYSE',  來源
    l: '81.29',  最後成交價
    l_fix: '81.29',
    l_cur: '81.29', Last Trade With Currency
    s: '0', last trade size
    ltt: '11:52AM EST', 最後交易時間
    lt: 'Feb 24, 11:52AM EST', last trade date time long
    lt_dts: '2017-02-24T11:52:12Z',  最後交易日
    c: '+0.43', change
    c_fix: '0.43',
    cp: '0.53', change percent 漲幅
    cp_fix: '0.53',
    ccol: 'chg',
    pcls_fix: '80.86' PreviousClosePrice },*/

/* [ { "id": "304466804484872" , 
"t" : "GOOG" , 
"e" : "NASDAQ" , 
"l" : "828.64" , 
"l_fix" : "828.64" , 
"l_cur" : "828.64" , 
"s": "0" , 
"ltt":"4:00PM EST" , 
"lt" : "Feb 24, 4:00PM EST" , 
"lt_dts" : "2017-02-24T16:00:01Z" , 
"c" : "-2.69" , 
"c_fix" : "-2.69" , 
"cp" : "-0.32" , 
"cp_fix" : "-0.32" , 
"ccol" : "chr" , 
"pcls_fix" : "831.33" } ]*/


var stocks = [];
var symbols = [];


function simulateChange(){

    let getDataPro = new Promise((resolve, reject) => {googleStocks(symbols, function(err, data){
        if (err) {
            console.log(err);
            reject("failed");
        } else {
            stocks = [];

            data.forEach(function(stock){
                stocks.push({
                    symbol: stock.e + ":" + stock.t,
                    open : parseFloat( stock.l ),
                    last : parseFloat( stock.l ),
                    change : parseFloat( stock.c ),
                });
            })
            resolve("done");
        }
    })});
    getDataPro.then(() => {
        if(stocks[0] !== undefined){
            var stock = stocks[0];
            onChangeHandler(stock.symbol, 'stock', stocks);

        }
    })
}



function init(onChange, initsymbols){
    onChangeHandler = onChange;
    //symbols = initsymbols.split(",");
    symbols = Array.from(initsymbols);
    simulateChange();
}

function start(onChange){
    onChangeHandler = onChange;
    interval = setInterval(simulateChange, 60000);
}

function stop(){
    clearInterval(interval);
}

function addSymbols(newSymbols){
    if (typeof(newSymbols) === 'string') {
        if(symbols.indexOf(newSymbols) === -1 ){
            symbols.push(newSymbols);
        }
    } else {
        newSymbols.forEach(function(data){
            if(symbols.indexOf(data) === -1 ){
                symbols.push(data);
            }
        })
    }

   simulateChange();

}

function delSymbol(delSymbol){
    let i = symbols.indexOf(delSymbol);
    if( i !== -1 ){
        symbols.splice(i, 1);
    }
}

exports.start = start;
exports.stop = stop;
exports.init = init;
exports.addSymbols = addSymbols;
exports.delSymbol = delSymbol;