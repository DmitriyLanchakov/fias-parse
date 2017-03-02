var Parser = require('node-dbf');
var fs = require('fs');
var path = require('path');
var ps = require('process');
var _ = require('underscore');
var async = require('async');
async.waterfall([
  function(cb){
    require('./lib/mongoose').connect(cb); 
  }, 
  function(r, cb){
    console.log(r);
    var fias_path = process.env.FIAS_PATH || __dirname + '/fias';
    var out_path = process.env.OUT_PATH;
    console.log('Попытка прочитать файлы ФИАС', fias_path);
    fs.readdir(fias_path, function(e, f){
      if (e) { cb(e); }
      else {
        _.each(f, function(i){
          if (out_path && path.extname(i) === '.DBF') {
            var file = path.join(out_path, i);
            var file_to_parse = path.join(fias_path, i);
            var parser = new Parser(file_to_parse);
            parser.on('end', function(p) {
              process.stdout.write('Файл ' + i + ' завершен\r');
            });
            parser.on('record', function(record) {
              if (!fs.existsSync(file)) {
                fs.writeFileSync(file, record);
              } else {
                fs.appendFileSync(file, record);
              }
            });
            parser.parse();
          } else {
            // MongoDB write here
          }
        });
      }
    });
    cb(null, '')
  }
], function(e, m){
  if (e) { console.log(e); }
  else { console.log(m); }
});
