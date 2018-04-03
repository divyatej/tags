var port = process.env.PORT || 8080;
var serverUrl = "";
var http = require("http");
var path = require("path");
var fs = require("fs");
var xlsx = require('xlsx');
var getFile=function(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			if (mimeType != undefined) {
				res.setHeader("Content-Type", mimeType);
			}
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}
var next=function(data,res){
	var ws_data = [
		[ "URL", "Status","Errors" ]
	  ];
	var arr=[];
	Object.keys(data).forEach(function(key){
		arr=[];
		console.log('key-------'+key);
		data[key].split(',').forEach(function(keyData){
			console.log('keyData-------'+keyData);
			arr.push(keyData);
		});
		ws_data.push(arr);
	});
	var worksheet = xlsx.utils.aoa_to_sheet(ws_data);
	var wb=xlsx.utils.book_new();
	xlsx.utils.book_append_sheet(wb,worksheet,"SheetJS");
	var buf=xlsx.write(wb,{type:'buffer',bookType:"xlsx"});
	res.statusCode=200;
	res.setHeader("Content-Length", buf.length);
	res.setHeader("Content-Type", "application/vnd.openxmlformats");
	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
	res.end(buf);
}
http.createServer(function(req, res) {
	var filename = req.url;
	console.log('Request for'+filename);
	if(filename.includes('downloadExcel')){
		console.log('excel');
		var data = '';
		req.on('data', function( chunk ) {
		  data= JSON.parse(chunk);
		});
		req.on('end', function() {
		  next(data,res);
		});
	}else{
		var params = filename.substring(filename.indexOf('?')+1,filename.length);
		filename=filename.replace('?'+params,'');
		var ext = path.extname(filename);
		var localPath = __dirname;
		var copyLocalPath=localPath;
		var validExtensions = {
			".html" : "text/html",
			".js": "application/javascript",
			".css": "text/css",
			".ico": "image/ico"
		};
		var mimeType = validExtensions[ext];
		localPath += filename;
		copyLocalPath=copyLocalPath.replace('\config','');
		localPath=localPath.replace('\config','');
		fs.exists(localPath, function(exists) {
				if(exists) {
					getFile(localPath, res, mimeType);
				} else {
					console.log('not exists'+localPath);
					getFile(copyLocalPath+'/home.html', res, mimeType);
					//res.writeHead(404);
					//res.end();
				}
		});
	}
}).listen(port, serverUrl);