var port = process.env.PORT || 8080;
var serverUrl = "";
var http = require("http");
var path = require("path");
var fs = require("fs");
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
http.createServer( function(req, res) {
	var filename = req.url;
	var params = filename.substring(filename.indexOf('?')+1,filename.length);
	filename=filename.replace('?'+params,'');
	var ext = path.extname(filename);
	var localPath = __dirname;
	var validExtensions = {
		".html" : "text/html",
		".js": "application/javascript",
		".css": "text/css",
		".ico": "image/ico"
	};
	var mimeType = validExtensions[ext];
	localPath += filename;
	localPath=localPath.replace('\config','');
	fs.exists(localPath, function(exists) {
			if(exists) {
				getFile(localPath, res, mimeType);
			} else {
				res.writeHead(404);
				res.end();
			}
	});
}).listen(port, serverUrl);