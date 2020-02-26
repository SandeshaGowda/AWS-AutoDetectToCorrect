var http = require('http');
var fs = require("fs");
 const log4js = require('log4js');
log4js.configure({
  appenders: { AppError: { type: 'file', filename: 'application.log' } },
  categories: { default: { appenders: ['AppError'], level: 'info' } }
});

const logger = log4js.getLogger('AppError');
//logger.trace('Entering cheese testing');
//logger.debug('Got cheese.');
//logger.info('Cheese is Comté.');
//logger.warn('Cheese is quite smelly.');

http.createServer(function(request, response) {

	
	if(request.url === "/index"){
		sendFileContent(response, "index.html", "text/html");
	}
	else if(request.url === "/"){
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + request.url);
	}
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}
	else if(request.url === "/assets/js/jquery.min.js" || request.url === "/assets/js/skel.min.js" ){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}
	else if(request.url === "/assets/css/font-awesome.min.css"){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}
	else{
		console.log("Requested URL is: " + request.url);
		response.end();
	}
	
	//logger.info(request.url);
}).listen(3000);

function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			logger.error("Internal error! Please contact system administrator");
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
			//logger.info( "status 200 " + fileName +" " + contentType );
		}
		response.end();
	});
}