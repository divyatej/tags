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
var next=function(data,res,change){
	var ws_data = [
		[ "URL", "Status","Errors" ]
	  ];
	  if(change){
		ws_data=[["TAGS"]];
	  }
	var arr=[];
	Object.keys(data).forEach(function(key){
		arr=[];
		data[key].split(',').forEach(function(keyData){
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
	if(filename.includes('downloadExcel') && !filename.includes('downloadExcelCreate')){
		var data = '';
		req.on('data', function( chunk ) {
		  data= JSON.parse(chunk);
		});
		req.on('end', function() {
		  next(data,res,false);
		});
	}else if(filename.includes('downloadExcelCreate')){
		var data = '';
		req.on('data', function( chunk ) {
		  data= JSON.parse(chunk);
		});
		req.on('end', function() {
		  next(data,res,true);
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
					getFile(copyLocalPath+'/home.html', res, mimeType);
					//res.writeHead(404);
					//res.end();
				}
		});
	}
}).listen(port, serverUrl);