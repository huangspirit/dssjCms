require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
var url='http://192.168.10.145:'
// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port;
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var request = require('request');
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var app = express()
// 使用
//app.all("*",(req,res,next)=>{
//  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
//  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With');
//  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//  res.header('Access-Control-Allow-Credentials', true);
//  res.header('X-Powered-By', ' 3.2.1');
//  res.header('Content-Type', 'application/json;charset=utf-8');
//  if (req.method === 'OPTIONS') {
//    res.sendStatus(200);
//  } else {
//    next();
//  }
//})
var target="http://192.168.10.121:8001"
app.get("/index_node/getmemberInfo",(req,res,next)=>{
  res.jsonp({birth: 0,
    sex: 2,
    businessSource: 'register',
    imageUrl:
        'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epdzUwKsq47gMlFvSd6D2XiaaKelCWtuEXywQGxbNpiburhC7fDoEjKtlxPU0dQw4wJrLOWZP7l21RA/132',
    createTime: 1547892055,
    isForbidden: 0,
    wtmNumber: 20952509,
    id: 4245939108357858,
  memberName:'平安2334249'})
})

app.post("/index_node/resetmemberInfo",(req,res,next)=>{
  console.log("咋回事")
  req.rawBody = '';//添加接收变量
  var json={};
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    console.log(chunk)
    req.rawBody += chunk;
  });
  request.post({
    url: target+"/pc/app/member/admin/updateMember",
    method: "POST",
    json: true,
    headers: {
      "content-type": "application/json",
    },
    body: req.rawBody},function(err,response,body){
    console.log("response")
    console.log(response)
  })
  console.log("req.rawBody")
  console.log(req.rawBody)
  //req.on('end', function() {
  //  json=req.rawBody;
  //  res.send(json);
  //});
})
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable
var compiler = webpack(webpackConfig)
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  options.onProxyReq=(proxyReq, req, res)=> {
    proxyReq.setHeader('from', '1');
    proxyReq.setHeader('memberId', '4');
  }
  console.log("被代理了")
  app.use(context,proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))
var uri = url + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})
console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})
app.use(bodyParser.json());  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({extended: true}))       //此项必须在 bodyParser.json 下面,为参数编码;
app.post("/index_node/resetmemberInfo",(req,res,next)=>{
  console.log("执行修改用户信息")
  var query=req.body
  console.log(query)
  request({
    url: target+"/pc/app/member/admin/updateMember",
    method: "POST",
    json: true,
    headers: {
      "content-type": "application/json",
      "memberId":req.session.memberInfo.id
    },
    body: query
  }, function(error, response, body) {
    console.log(response.statusCode)
    if (!error && response.statusCode == 200) {
      if(body.errorCode==0){
        var memberInfo=req.session.memberInfo
        Object.assign(memberInfo, body.data);
        req.session.memberInfo=memberInfo
      }
      res.jsonp(body)
    }else{
      res.jsonp({
        errorCode:"05",
        message:"JAVA服务器返回错误"
      })
    }
  });
})
var server = app.listen(port)
module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
