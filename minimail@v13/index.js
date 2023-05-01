const fs=require('fs')
const https=require('https')
const http=require('http')
const createError=require('http-errors')
const express=require('express')
const cookieParser=require('cookie-parser')
const logger=require('morgan')

const server=require('./routes/index')

const { policy }=require('./config/security/cors/cors')

const httpsPort=[54321, 54322, 54323]
const httpPort=[34567, 34568, 34569]

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use('/', policy)
app.use('/', server);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var options={
  key: fs.readFileSync('./config/security/certificate/server.key'),
  cert: fs.readFileSync('./config/security/certificate/server.cert')
}

https.createServer(options, app).listen(process.env.PORT || httpsPort[0], function(){
  
  console.log('')
  console.log('')
  console.log('*---------https---------*')
  console.log('')
  console.log({ key: options.key })
  console.log({ certificate: options.cert })
  console.table({ 
    https_ports: httpsPort,
    online_port: httpsPort[0]
  })
  console.log('')
  console.log('*---------https---------*')
  console.log('')
})

http.createServer(app).listen(httpPort[1], function(){
  
   console.log('')
   console.log('*---------http---------*')
   console.log('')
   console.table({ 
     http_ports: httpPort,
     online_port: httpPort[1] })
   console.log('')
   console.log('*---------http---------*')
})
