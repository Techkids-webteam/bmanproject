
var multer = require('multer');
var upload = multer();
var fs                  = require('fs');
var express             = require('express');
var jade                = require('jade');
var bodyParser          = require('body-parser');
var multipart           = require('connect-multiparty');
var mongoose            = require('mongoose');
var multipartMiddleware = multipart();
var  path = require('path');
var app = express();
app.use('/themes/', express.static(__dirname + '/public/'));
app.use('/cms',express.static(path.join(__dirname, '/public/')));
app.use('/pictures/', express.static(__dirname + '/public/upload/'));
app.set('views', __dirname + '/views/');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('jade', require('jade').__express);


app.param('page', function (req, res, next, page) {
	trang = page
  console.log('đã nhận param vào:', trang);
  next();
});

app.get("/", function (req,res) {
  res.sendFile(__dirname + '/views/index.html');
})

app.get('/:page', function (req, res, next) {
		console.log('đã truy cập vào trang :', trang);
		res.sendFile(__dirname + '/views/'+trang+'.html');
});
//================== content edior =============================
var jsdom = require("jsdom");
app.post('/save-my-page',upload.array(), function (req, res,next) {
	console.log(req.body);
	console.log(req.body['__page__']);
	console.log(req.body['main-content']);
	fs.readFile('views/index.html', 'utf8', function (err,data) {
		console.log('(reading) :','views'+req.body['__page__']+'.html');
		jsdom.env(data, [], function (errors, window) {
			var $ = require('jquery')(window);
			$("soaica").each(function () {
				$(this).html(req.body['main-content']);
			});
			fs.writeFile('views/index.html', window.document.documentElement.outerHTML, function (err) {
				if (err) throw err;
				console.log('saved data!');
			});
		});
	});
	res.json(req.body);
  res.end();
});


//======================


var server = app.listen(8080, function() {
	console.log('Listening on port %d', server.address().port);
});
