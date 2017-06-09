// ./router/index.js
var gFin = require('google-finance'),
    csv = require('csv-write-stream'),
    fs = require('fs'),
    moment = require('moment'),
    path = require('path'),
    co = require('co')

exports.getHistoryStock = function(req , res , next){

    let stockfile = path.join(__dirname , '/..', '/public/tsv',  (req.body.getHisStock).replace(":","_") + '.tsv');
 
    let downloadHisData = function() {
        return gFin.historical({
                symbol:((req.body.getHisStock).replace("_",":")),
                from: '2013-03-01',
                to: '2017-03-05'
            },function(error, data){
                if(error){
                    console.log(error);
                }

                let writer = csv({
                    seperator: "	",
                    sendHeaders:true
                });
        
                writer.pipe(fs.createWriteStream( stockfile ));
        
                data.forEach(function(stock){
                    writer.write({
                        date: moment(stock.date).format("YYYY-MM-DD"),
                        open: stock.open,
                        high: stock.high,
                        low: stock.low,
                        close: stock.close,
                        volume: stock.volume,
                        symbol: stock.symbol
                    });
                });
                writer.end();
                //console.log("股票歷史資料下載完成");
            });
           
    }

    let returnStockdata = function(){
        fs.createReadStream(stockfile).pipe(res)
            .on('end', function () {
                res.end();

            })
    }

 if (fs.existsSync(stockfile)) {
           //console.log("已經有資料了，直接回傳");
           returnStockdata();
        }else{
            //console.log("沒有資料，要先下載在回傳");
            co(function *(){
                yield downloadHisData();
                returnStockdata();
            });
    }
}

exports.responsegz = function(req , res , next){
    req.url = req.url + '.gz';
    res.set('Content-Encoding','gzip');
    next();
};
