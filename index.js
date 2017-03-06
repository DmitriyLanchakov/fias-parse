var xml2js = require('xml2js');
var fs = require('fs');
var path = require('path');
var ps = require('process');
var async = require('async');

var cluster = require('cluster');

var fias_path = process.env.FIAS_PATH || __dirname + '/fias';
var out_path = process.env.OUT_PATH;

async.waterfall([
  function (cb) {
    require('./lib/mongoose').connect(cb);
  },
  function (r, cb) {
    console.log(r);
    console.log('Попытка прочитать файлы ФИАС', fias_path);
    fs.readdir(fias_path, cb);
  },
  function (f, cb) {
    async.eachSeries(f, function (i, cbb) {
      if (out_path && path.extname(i) === '.XML') {
        var file = path.join(out_path, i);
        var file_to_parse = path.join(fias_path, i);
        var parser = new xml2js.Parser();
        var rs = fs.createReadStream(file_to_parse);
        var data = null;
        var count = 0;

        rs.on('data', function (chunk) {
          data += chunk;
          count++;
          if (cluster.isMaster) {
            for (var i = 0; i < 2; ++i) {
              cluster.fork();
            }
          } else {
            parser.parseString(data, function (e, result) {
              if (e) { return; }
              console.log('Обработано записей ', count);
              if (result) {
                var ws;
                fs.stat(file_to_parse, function (e, stats) {
                  if (e) {
                    if (e.code === 'ENOENT') {
                      ws = fs.createWriteStream(file + '.json', { flags: 'w' });
                      ws.write(JSON.stringify(result));
                      ws.end();
                    }
                  }
                  ws = fs.createWriteStream(file + '.json', { flags: 'a' });
                  ws.write(JSON.stringify(result));
                  ws.end();
                });
              }
            });
          }
        });

        rs.on('end', function () {
          data = null;
          count = 0;
          console.log('Файл ' + file_to_parse + ' обработан');
        });
      } else {
        // MongoDB write here
      }
      cbb();
    }, function (e) {
      if (e) { cb(e); }
    });
    cb(null);
  }
], function (e, m) {
  if (e) { console.log(e); }
  else { console.log(m); }
});
