<template>
<div id="app">
    <div class="title">
        <img src="/static/logo.png" alt="" class="logo">
        <span class="name">抖手视界发布系统</span>
        <div class="right rightWrap">
            <div class="imageUrlWrap">
                <img :src="memberInfo.imageUrl" alt="" class="imageUrl" @click="showResetMemberInfoMethod(0)">
                <div @click="showResetMemberInfoMethod(1)" class="memberName">{{memberInfo.memberName}}</div>
            </div>
            <span class="line">|</span>
            <a href="/logout" class="btn" target="_self">退出</a>
        </div>
    </div>
    <div class="content">
        <div class="upLoadWrap">
            <div class="videodetail">
                <div class="videoName left">{{videoName}}</div>
                <div class="right zhuanma" v-show="zhuanma">截图中 <div id="loading2"></div></div>
                <div class="right zhuanma" v-show="zhuanmaFail">上传失败</div>
            </div>
            <div class="upLoad">
                <div class="progress">
                    <div><el-progress  :percentage="percentage" :status="progressStatus"></el-progress></div>
                </div>
                <div class="right">
                    <el-button type="success" :disabled="selectVideoStatus" @click="selectVideoBtn">选择视频</el-button>
                    <input type="file" accept="video/*" v-show="false" id="upVideo" ref="upVideo" @change="readFile($event)">
                </div>
            </div>
            <div class="title">
                <p>视频标题</p>
                <div style="flex:1;"><el-input v-model="topicTitle" placeholder="请输入多于3个字的视频标题" minlength="3" maxlength="900":autosize="true" clearable></el-input></div>
            </div>
            <div class="coverUrl" v-show="coverUrl">
                <p>视频封面</p>
                <div class="relative"><img :src="coverUrl" alt="视频封面图" title="视频封面图"></div>
            </div>
            <div class="coverUrlList" v-show="coverUrlList.length">
                <p>选择封面</p>
                <div class="imgWrap" >
                    <div class="item selfUpload">
                        <i class="el-icon-upload"></i><br>
                        <span>上传封面</span>
                        <input type="file" id="upload"  @change="readFileImg($event)">
                    </div>
                    <div v-for="item in coverUrlList" class="item" @click="coverUrl=item">
                        <img :src="item" alt="">
                        <i class="el-icon-success" v-show="item==coverUrl"></i>
                    </div>
                </div>
            </div>
            <div class="btn" v-show="coverUrl">
                <el-button type="success" @click="submitTopic" :disabled="isSaveTopic">保存视频</el-button>
            </div>
        </div>

    </div>
    <el-dialog
            title=""
            :visible.sync="showResetMemberInfo"
            width="25%"
            class="showEditDialog">
        <div class="editone" v-if="showResetMemberInfoType==1">
            <p style="width:100px;">昵称:</p><el-input
                placeholder="填写昵称"
                v-model="memberName"
        >
        </el-input>
        </div>
        <div class="editone" v-if="showResetMemberInfoType==0">
            <p style="width:100px;">头像：</p>
            <p class="coverUrlWrap">
                <img :src="imageUrl" alt="头像" class="coverUrl">
                <input type="file" class="upload"  @change="readFile1($event)">
            </p>
        </div>
        <div class="editone" v-if="showResetMemberInfoType==0">
            <p style="width:100px;"></p>
            <span>头像是宽高不超过320的正方形</span>
        </div>
        <div>
            <el-button type="success" class="download" @click="resetMemberInfo">保 存</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
    import {Message,Loading } from 'element-ui'
    export default{
        name:'app',
        data(){
            return {
                showResetMemberInfoType:0,
                showResetMemberInfo:false,
                memberName:"",
                imageUrl:"",
                sendImageUrl:"",
                memberInfo:{},
                progressStatus:"text",
                percentage:0,
                selectVideoStatus:false,
                videoName:"",
                videoObj:{},
                fileEventCont:{files:""},
                getkeydata:{},
                loadingInstance1:"",
                zhuanma:false,
                zhuanmaFail:false,
                isSaveTopic:false,
                videoDetail:{},
                loading: true,
                loadingInstance2:"",
                topicTitle:"",
                coverUrlList:[],
                coverUrl:""
            }
        },
        mounted(){
            this.getMemberInfo()
            this.eventStart()
            let loadingInstance2 = Loading.service({ fullscreen: false,target:document.getElementById("loading2") });
        },
        methods:{
            showResetMemberInfoMethod(mark){
                this.showResetMemberInfo=true
                this.showResetMemberInfoType=mark
            },
            resetMemberInfo(){
                var that = this;
                if(this.showResetMemberInfoType==1){
                    var sendData={
                        memberName:this.memberName
                    }
                }else{
                    if(this.sendImageUrl){
                        var sendData={
                            imageUrl:this.sendImageUrl,
                        }
                    }else{
                        Message({
                            type:'info',
                            message:"未更新头像"
                        })
                        return;
                    }

                }
                this.$axios({
                    method:"post",
                    url:"/index_node/resetmemberInfo",
                    data:sendData
                }).then(function(res1){
                    console.log(res1)
                    var res=res1.data;
                    if(res.errorCode==0){
                        that.showResetMemberInfo=false
                        if(res.data.imageUrl){
                            that.imageUrl=res.data.imageUrl
                            that.$set(that.memberInfo,"imageUrl",res.data.imageUrl)
                        }
                        if(res.data.memberName){
                            that.memberName=res.data.memberName
                            that.$set(that.memberInfo,"memberName",res.data.memberName)
                        }
                    }else{
                        Message({
                            type:'info',
                            message:res.message
                        })
                    }
                }).catch(function(res){
                    console.log(res)
                })
            },
            readFile1(file){
                console.log(file)
                var that = this;
                var file=event.target
                var reader = new FileReader();
                reader.readAsDataURL(file.files[0]);

                reader.onerror = function (e) {
                    console.log(e)
                    /*   alert('亲,图片加载失败......浏览器输出 :' + file_r.error);
                     console.log(file_r.error);*/
                    reader.abort();
                    return false;
                };
                reader.onload=function(e){
                    console.log(e)
                    var image = new Image();
                    image.src= e.target.result
                    image.onload=function(){
                        var width = image.width;
                        var height = image.height;
                        if(!(width/height>0.8 && width/height<1.2) || width>320 || height>320){
                            Message({
                                type:'info',
                                message:"图片不符合要求！"
                            })
                        }else{
                            var imglist={
                                file:file.files[0],
                                length:file.files[0].size,
                                uri:"/member/headerImage/"+that.memberInfo.wxUnionId+"/"+Date.parse(new Date())/1000+file.files[0].name.substr(file.files[0].name.lastIndexOf('.')+1,file.files[0].name.length)                            }
                            that.uploadImg1(imglist)
                        }
                    }

                }
            },
            uploadImg1(imgList){
                var that = this
                var sendData=[{
                    length:imgList.length,
                    uri:imgList.uri
                }]
                var _this=this
                console.log( sendData)
                _this.$axios({
                    method:'post',
                    data:sendData,
                    url:"/common/imageData/admin/getPicBatchUploadSign"}).then((res)=>
                {
                    console.log(res)
                let data = res.data
                console.log(data)
                if(data.errorCode==0){
                    var formData = new FormData();
                    formData.append("policy", data.data[0].policy);
                    formData.append("signature", data.data[0].signature);
                    formData.append("file",imgList.file);
                    _this.$axios({
                        method: 'post',
                        url: "//v0.api.upyun.com/" + data.data[0].bucketName,
                        data: formData
                    }).then((res)=>
                    {
                        let data1 = res.data
                        console.log(data1)
                    if(res.status==200){
                        _this.sendImageUrl=data1.url
                        _this.imageUrl="https://cdn.weitaomi.cn"+data1.url
                    }else{
                        Message({
                            type:'info',
                            message:'图片上传失败'
                        })
                        return;
                    }
                })
                }
            })
            },
            getMemberInfo(){
                var that = this;
                this.$axios({
                    method:"get",
                    url:"/index_node/getmemberInfo?memberId=4245939108357858"
                }).then(function(res){
                    that.memberInfo=res.data
                    that.imageUrl=res.data.imageUrl
                    that.memberName=res.data.memberName
                }).catch(function(res){
                    console.log(res)
                })
            },
            selectVideoBtn(){
               // this.eventStart()
                this.zhuanma=false
                this.zhuanmaFail=false
                document.getElementById("upVideo").click()
            },
            readFile(obj){
                var that = this;
                let file = obj.target.files[0]
                this.fileEventCont=obj.target
                var videoName=file.name.substring(0,file.name.lastIndexOf("."));
                this.videoName=videoName;
                var format=file.type.substring(file.type.indexOf("/")+1,file.type.length);
                this.loadingInstance1 = Loading.service({ fullscreen: true,text:"正在读取本地文件..." })
                this.selectVideoStatus=true
                this.isSaveTopic=true
                this.coverUrl=""
                this.coverUrlList=[]
                var getkeydata={
                    format:format,
                    videoName:videoName,
                    cateId:'1000022673',
                    scene:1,
                    sourceType:-1
                }
                this.getkeydata=getkeydata
                this.$axios({
                    method:"post",
                    url:"/common/videoData/admin/uploadVideo",
                    data:getkeydata}).then((params)=>{
                    console.log(params)
                    if(params.data.errorCode==0){
                        that.videoObj={
                            accesskeyid : params.data.data.AccessKeyId,
                            accesskeysecret : params.data.data.AccessKeySecret,
                            secrettoken : params.data.data.SecurityToken,
                            upLoadAuth : params.data.data.UploadAuth,
                            upLoadAddress : params.data.data.UploadAddress,
                            videoId : params.data.data.VideoId,
                            id : params.data.data.id
                        }
                        that.eventStart()
                    }
                    else{
                            Message({
                                type: 'info',
                                message: params.data.message
                            })
                        }
                })
            },
            eventStart(){
                "use strict";
                var _this=this;
                this.uploader = new AliyunUpload.Vod({
                    // 文件上传失败
                    'onUploadFailed': function (uploadInfo, code, message) {
                        console.log(uploadInfo)
                        _this.selectVideoStatus=false
                        _this.progressStatus="exception"
                        //log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
                    },
                    // 文件上传完成
                    'onUploadSucceed': function (uploadInfo) {
                        _this.zhuanma=true
                        _this.upVideosucc(uploadInfo.videoId)
                    },
                    // 文件上传进度
                    'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
                        console.log(loadedPercent)
                        _this.percentage=loadedPercent * 100
                        if(loadedPercent*100<99.9){
                            _this.progressStatus="text"
                        }
                       // _this.progressNum=(loadedPercent * 100.00).toFixed(2);
                    },
                    // STS临时账号会过期，过期时触发函数
                    'onUploadTokenExpired': function (uploadInfo) {
                        console.log("onUploadTokenExpired");
                        if (_this.isVodMode()) {
                            // 实现时，根据uploadInfo.videoId从新获取UploadAuth
                            //实际环境中调用点播的刷新上传凭证接口，获取凭证
                            //https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
                            //获取上传凭证后，调用setUploadAuthAndAddress
                            // uploader.resumeUploadWithAuth(uploadAuth);
                        }
                    },
                    onUploadCanceled:function(uploadInfo)
                    {
                        console.log("onUploadCanceled:file:" + uploadInfo.file.name);
                    },
                    // 开始上传
                    'onUploadstarted': function (uploadInfo)
                    {
                        _this.loadingInstance1.close()
                        console.log("开始上传了")
                        if (_this.isVodMode()) {
                            if(!uploadInfo.videoId)//这个文件没有上传异常
                            {
                                //mock 上传凭证，实际产品中需要通过接口获取
                                var uploadAuth = _this.videoObj.upLoadAuth;
                                var uploadAddress = _this.videoObj.upLoadAddress;
                                var videoId = _this.videoObj.videoId;
                                //实际环境中调用调用点播的获取上传凭证接口
                                //https://help.aliyun.com/document_detail/55407.html?spm=a2c4g.11186623.6.629.CH7i3X
                                //获取上传凭证后，调用setUploadAuthAndAddress
                                _this.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId);
                            }
                            else//如果videoId有值，根据videoId刷新上传凭证
                            {
                                //mock 上传凭证 实际产品中需要通过接口获取
                                console.log(uploadInfo.videoId)

                                var uploadAuth = _this.videoObj.upLoadAuth;
                                var uploadAddress = _this.videoObj.upLoadAddress;
                                var videoId = _this.videoObj.videoId;
                                //实际环境中调用点播的刷新上传凭证接口，获取凭证
                                //https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
                                //获取上传凭证后，调用setUploadAuthAndAddress
                                _this.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId);
                            }
                        }
                        // $(eventCont).siblings(".videoListWrap").empty().append("<p class='videolist"+videoid+"'><span class='progress'>"+videoNameShow+"：0%"+"</span><input type='text' name='videoArr' value='"+videoid+"' class='hide'><i class='chahao'onclick='removeImg(this)'>&times;</i></p>")
                        console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
                    },
                    'onUploadEnd':function(uploadInfo){
                        console.log("onUploadEnd: uploaded all the files");
                    }
                });
                this.selectFile();
            },
            selectFile() {
                var userData
                var _this=this;
                if (_this.isVodMode()) {
                    userData =JSON.stringify({"Vod":{"UserData":{"IsShowWaterMark":"false","Priority":"7","videoid":this.videoObj.videoId}}});
                } else {
                    userData = JSON.stringify({
                        "Vod":{
                            "Title":_this.getkeydata.videoTitle,
                            "Description":_this.getkeydata.videoDesc,
                            "CateId":_this.getkeydata.cateId,
                            "Tags":_this.getkeydata.tags}
                    })
                }
                for(var i=0; i<_this.fileEventCont.files.length; i++) {
                    console.log("add file: " + _this.fileEventCont.files[i].name);
                    console.log(_this.isVodMode())
                    if (_this.isVodMode()) {
                        // 点播上传。每次上传都是独立的OSS object，所以添加文件时，不需要设置OSS的属性
                        _this.uploader.addFile(_this.fileEventCont.files[i], null, null, null, userData);
                    } else if(_this.isSTSMode()) {
                        // STS的上传方式，需要在userData里指定Title
                      //  var object = objectPre;
                      //  _this.uploader.addFile(_this.fileEventCont.files[i], endpoint, bucket, object , userData);
                    }
                }
                _this.start();
            },
            start() {
                console.log("start upload.");
                this.uploader.startUpload();
                //quxiao()
            },
            stop() {
                console.log("stop upload.");
                this.uploader.stopUpload();
            },
            isVodMode() {
                console.log(this.videoObj)
                var uploadAuth = this.videoObj.upLoadAuth;
                console.log(uploadAuth && uploadAuth.length > 0)
                return (uploadAuth && uploadAuth.length > 0);
            },
            isSTSMode() {
                console.log(this.videoObj)
                var secretToken = this.videoObj.secrettoken;
                if (!isVodMode()) {
                    if (secretToken && secretToken.length > 0) {
                        return true;
                    }
                }
                return false;
            },
            upVideosucc(videoId){
                var everyTime=5000;
                var n=10*60*1000/5000;
                var count=0
                var _this= this;
                var timer=setInterval(function(){
                    _this.$axios({
                        type:"get",
                        url:"/common/videoData/admin/getUploadVideoInfo?videoId="+videoId}).then((res)=>{
                        console.log(res)
                        if(res.data.errorCode==0){
                            if(res.data.data && res.data.data.coverUrl){
                                clearInterval(timer)
                                _this.selectVideoStatus=false
                                _this.progressStatus="success"
                                _this.zhuanma=false
                                _this.zhuanmaFail=false
                                _this.coverUrlList=res.data.data.coverUrlList
                                _this.coverUrl=res.data.data.coverUrl
                                _this.videoDetail=res.data.data
                                _this.isSaveTopic=false
                            }else{
                                count++;
                                if(count>n){
                                    _this.zhuanma=false
                                    _this.zhuanmaFail=true

                                    _this.progressStatus="exception"
                                    clearInterval(timer)
                                    _this.selectVideoStatus=false
                                }
                            }
                        }else{
                            clearInterval(timer)
                            _this.selectVideoStatus=false
                            _this.zhuanma=false
                            _this.zhuanmaFail=true
                            _this.progressStatus="exception"
                        }
                    })
                }, everyTime);
            },
            getMoreCover(){
                var _this = this ;
                _this.$axios({
                    type:"get",
                    url:"/common/videoData/admin/getUploadVideoInfo?videoId="+_this.videoObj.videoId}).then((res)=>{
                    console.log(res)
                        if(res.data.errorCode==0){
                            if(res.data.data && res.data.data.coverUrl){
                                _this.coverUrlList=res.data.data.coverUrlList
                                _this.coverUrl=res.data.data.coverUrl
                            }
                        }
                })
            },
            readFileImg(file){
                console.log(file)
                var that = this;
                var file=event.target
                var reader = new FileReader();
                reader.readAsDataURL(file.files[0]);
                reader.onerror = function (e) {
                    console.log(e)
                    /*   alert('亲,图片加载失败......浏览器输出 :' + file_r.error);
                     console.log(file_r.error);*/
                    reader.abort();
                    return false;
                };
                reader.onload=function(e){
                    console.log(file.files[0])

                    var imglist={
                        file:file.files[0],
                        length:file.files[0].size,
                        uri:"/topic/"+that.memberInfo.wtmNumber+"/"+Date.parse(new Date())/1000+"/01."+file.files[0].name.substr(file.files[0].name.lastIndexOf('.')+1,file.files[0].name.length)
                    }
                    that.uploadImg(imglist)
                }
            },
            uploadImg(imgList){
                var that = this
                var sendData=[{
                    length:imgList.length,
                    uri:imgList.uri
                }]
                var _this=this
                this.$axios({
                    method:'post',
                    data:sendData,
                    url:"/common/imageData/admin/getPicBatchUploadSign"}).then((res)=>
                {
                    let data = res.data
                    console.log(data)
                if(data.errorCode==0){
                    var formData = new FormData();
                    formData.append("policy", data.data[0].policy);
                    formData.append("signature", data.data[0].signature);
                    formData.append("file",imgList.file);
                    _this.$axios({
                        method: 'post',
                        url: "//v0.api.upyun.com/" + data.data[0].bucketName,
                        data: formData
                    }).then((res)=>
                    {
                        let data1 = res.data
                        console.log(data1)
                    if(res.status==200){
                        that.coverUrl="http://cdn.weitaomi.cn"+data1.url
                        // that.$set(that.editObj,'converUrlUpyun',"http://cdn.weitaomi.cn"+data1.url)
                    }else{
                        Message({
                            type:'info',
                            message:'图片上传失败'
                        })
                        return;
                    }
                })
                }
            })
            },
            submitTopic(){
                if(this.topicTitle.length<4){
                    Message({
                        type:'info',
                        message:"帖子标题不能少于三个字"
                    })
                    return;
                }
                var sendData={
                    topicTitle:this.topicTitle,
                    coverUrl:this.coverUrl,
                    topicCateId:2,
                    topicGroupId:47,
                    mediaType:"video",
                    mediaMixedList:[{
//                        duration:this.videoDetail.duration,
//                        size:this.videoDetail.size,
//                        videoUrl:this.videoDetail.videoUrl,
//                        length:this.videoDetail.length,
//                        width:this.videoDetail.width,
                        videoId:this.videoDetail.videoId
                    }]
                }
                this.$axios({
                    method:"post",
                    url:"/pc/topic/admin/saveTopic",
                    data:sendData}).then((res)=>{
                    console.log(res)
                        if(res.data.errorCode==0){
                            window.open("/index","_self")
                        }else{
                            Message({
                                type:'info',
                                message:res.data.message
                            })
                        }
                })
            }
        }
    }
</script>
<style lang="stylus" scoped>
@import '../../assets/css/reset.css'
#app
    .showEditDialog
        .download
            display block
            margin 10px auto
        .editone
            display flex
            margin-top 10px
            .coverUrlWrap
                position relative
                border 1px solid #e4e4e4
                .upload
                    position absolute
                    width 100%
                    height 100%
                    z-index 2
                    opacity 0
                    top 0
                    left 0
                .coverUrl
                    width auto
                    height 200px
                    min-width 50px
                &:hover:after
                    display block
                    content '更换封面图'
                    width 100%
                    height 100%
                    position absolute
                    background rgba(0,0,0,0.5)
                    color #fff
                    top 0
                    left 0
                    text-align center
                    line-height 200px
                    cursor pointer
                    z-index 1
    &>.title
        position fixed
        width 100%
        top 0
        z-index 10
        height 56px
        font-size 22px
        background #000
        color #fff
        .name
            height 100%
            display inline-block
            line-height 56px
            vertical-align middle
            font-size 18px
        .logo
            margin-left 15px
        .rightWrap
            line-height 56px
            margin-right 20px
            .btn
                color #aaacad
                font-size 17px
                display inline-block
                height 100%
                vertical-align top
            .line
                color #aaacad
                font-size 30px
                display inline-block
                height 100%
                vertical-align top
                line-height 50px
                margin-right 5px
            .imageUrlWrap
                height 30px
                overflow hidden
                display flex
                float left
                margin-top 12px
                margin-right 10px
                .imageUrl
                    height 100%
                    width 30px
                    border-radius 50%
                    display block
                    cursor pointer
                .memberName
                    line-height 30px
                    font-size 20px
                    color #aaacad
                    margin-left 10px
                    cursor pointer
    .content
        padding-top 56px
        width 100%
        max-width 1200px
        margin 0 auto
        margin-top 20px
        .upLoadWrap
            background #fff
            width 100%
            min-height 600px
            padding 20px
            box-sizing border-box
            .videodetail
                height 20px
                padding-right 150px
                line-height 20px
                .zhuanma
                    margin-right 5px
                #loading2
                    width 22px
                    display inline-block
                    &>>>.el-loading-spinner .circular
                        height 20px
                        width 20px
                        margin-top 5px
            .btn
                margin 20px
                text-align center
            .title
                display flex
                &>p
                    width 100px
            .coverUrl
                margin-top 20px
                display flex
                height 200px
                &>p
                    width 100px
                img
                    max-height 100%
                    position absolute
                    top 50%
                    left 0%
                    transform translateY(-50%)
            .coverUrlList
                margin-top 20px
                display flex
                &>p
                    width 100px
                .imgWrap
                    display flex
                    flex 1
                    flex-wrap wrap
                    .selfUpload
                        cursor pointer
                        i
                            font-size 50px
                            margin-top 80px
                        &:hover
                            color #0963ef
                    .item
                        height 200px
                        width 24%
                        text-align center
                        background #e4e4e4
                        margin-right 1%
                        overflow hidden
                        position relative
                        margin-bottom 10px
                        #upload
                            position absolute
                            width 100%
                            height 100%
                            opacity 0
                            z-index 100
                            top 0
                            left 0
                        .el-icon-success
                            color #67c23a
                            position absolute
                            right 3px
                            top 3px
                            z-index 1
                            font-size 30px
                        img
                            max-height 100%
                            max-width 100%
                            position absolute
                            top 50%
                            transform translate(-50%,-50%)
                            left 50%
            .upLoad
                display flex
                margin-bottom 30px
                .progress
                    flex 1
                &>>>.el-progress
                    margin-top 12px
</style>