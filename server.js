/**
 * Created by Administrator on 2019/1/9 0009.
 */
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
var target="http://127.0.0.1"
var proxyTable= {
    '/pc': {              //  '/api'相当于代表  http://localhost/Graduation_Thesis  可自行修改名字
        target: target, //我们需要请求的主要文件夹地址
        changeOrigin: true, //是否跨域
        pathRewrite:{
            "^/pc":'/pc'
        }
    },
    '/common': {              //  '/api'相当于代表  http://localhost/Graduation_Thesis  可自行修改名字
        target: target, //我们需要请求的主要文件夹地址
        changeOrigin: true, //是否跨域
        pathRewrite:{
            "^/common":'/common'
        }
    },
}
var http = require("http");
var cookie = require('cookie-parser');
var session = require('express-session');
var express = require('express')
var request = require('request');
var path = require('path')
var fs=require("fs")
var app = express()
var proxyMiddleware = require('http-proxy-middleware')
var bodyParser = require('body-parser');
app.use(session({
    name:"session",
    secret: randomString(6), // 建议使用 128 个字符的随机字符串
    duration: 4*60*60,
    resave:true,
    saveUninitialized: false,
    cookie: {}
}));
app.use('/static', express.static(path.join(__dirname, "static")))
app.all('*', function(req, res, next){
    console.log(req.path)
    if(req.path=="/index" || req.path=="index.html"){
        if(req.query.code){
            console.log("有code")
            //请求memberinfo
            request(target+'/pc/app/member/ordinary/thirdPlatLoginScan?code='+req.query.code, function (error, response, body) {
                console.log(response.statusCode)
                if (response.statusCode == 200) {
                    var params=JSON.parse(body)
                    if(params.errorCode=="0"){
                        console.log("创建session")
                        //通过cookie 生成session
                        req.session.memberInfo = params.data;
                        res.redirect(302,"/index")
                        //  res.send("欢迎第一次访问。");
                    }else{
                        //重新到login
                        console.log("跳转1")
                        res.redirect(302,"/login")
                    }
                }
            })
        }
        else{
            console.log("没有code")
            if(req.session && req.session.memberInfo){
                //正常状态
                res.sendFile(__dirname+'/index.html')
            }else{
                //表示登录过期，重定向到登陆页
                console.log("跳转2")
                res.redirect(302,'/login.html')
            }
        }
    }
    else if(req.path=="/" || req.path=="/login"||req.path=="/login.html"){
        console.log("跳转3")
        console.log(res.session)
        if(req.session && req.session.memberInfo){
            res.redirect(302,'/index')
        }else{
            res.sendFile(__dirname + "/login.html"  )
        }

    }else if(req.path=="/uploadvideo.html" || req.path=="/uploadvideo"){
        console.log("跳转到上传视频")
        if(req.session && req.session.memberInfo){
            res.sendFile(__dirname + "/uploadvideo.html"  )
        }else{
            res.redirect(302,'/login')
        }
    }else if(req.path=="/logout"){
        //  res.write(res.cookie.jscode)
        //退出登录，要清除sesssion 和cookie
        req.session.destroy()
        res.clearCookie("jscode")
        res.redirect('/login')
    }
    else if(req.path=="/question.html" || req.path=="/question"){
        res.sendFile(__dirname + "/question.html")
    }else{
        next()
    }
})
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    options.onProxyReq=(proxyReq, req, res)=> {
        proxyReq.setHeader('from', '1');
        console.log("设置请求头")
        if(req.session && req.session.memberInfo){
            proxyReq.setHeader('memberId', req.session.memberInfo["id"]);
        }
    }
    console.log("执行代理")
    app.use(context,proxyMiddleware(options.filter || context, options))
})
app.use(bodyParser.json());  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({extended: true}))       //此项必须在 bodyParser.json 下面,为参数编码;
app.get("/index_node/getmemberInfo",(req,res,next)=>{
    res.jsonp(req.session.memberInfo)
})
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
var server = app.listen("65501",function(){
    console.log("service is start");
})

