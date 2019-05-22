<template>
  <div id="app">
    <div class="title">
      <img src="/static/logo.png" alt="" class="logo">
      <span class="name">抖手视界发布系统</span>
      <div class="right rightWrap">
        <div class="imageUrlWrap"  >
          <img :src="memberInfo.imageUrl" alt="" class="imageUrl" @click="showResetMemberInfoMethod(0)">
          <div @click="showResetMemberInfoMethod(1)" class="memberName">{{memberInfo.memberName}}</div>
        </div>
        <span class="line">|</span>
        <a href="/logout" class="btn" >退出</a>
      </div>
    </div>
    <div class="content">
      <div class="upvideomark">
        <a href="/uploadvideo.html" class="upload" target="_blank">
          <div><img src="/static/upvideo.jpg" alt=""></div>
          <div>上传长视频</div>
        </a>
      </div>
      <div class="topiclist">
        <div class="nolist" v-show="shownolist">您还没有发布过视频哦，点击<a href="/uploadvideo.html"  target="_blank" style="color:#18b163;">发布长视频</a></div>
        <div v-for="(item,index) in topicList" class="item" >
          <img src="/static/openbtn.png" alt="" class="openbtn"  @click="openVideo(index)" v-if="item.topicStatus==1">
          <div class="openbtn" v-if="item.topicStatus==-3" style="color:#fff;">此视频正在转码中...</div>
          <img :src="item.converUrlUpyun+'!/both/270x225'" alt="" class="coverUrl" @click="openVideo(index)">
          <div class="videodetail">
            <span><img src="/static/readNum.png" alt=""><span class="readNum">{{item.topicData.readNumber}}</span></span>
            <span class="right duration" v-if="item.topicStatus==1">{{item.duration}}</span>
          </div>
          <div class="detail">
            <span class="time">{{item.createTime | dateForm}}</span>
            <div class="right iconlist">
              <img src="/static/weixin.jpg" alt="" @click="weixin(index)">
              <img src="/static/edit.jpg" alt="" @click="edit(index)">
              <div class="right relative dropmenuwrap">
                <img src="/static/dot.jpg" alt="">
                <div class="dropmenu">
                  <p @click="showcopyMiniParamRouter(index)">获取公众号嵌入路径<i class="el-icon-arrow-right el-icon--right right"></i></p>
                  <p @click="showopenMiniParamImg(index)">获取公众号嵌入图片<i class="el-icon-arrow-right el-icon--right right"></i></p>
                  <p @click="copytext1">
                    点击复制AppId
                    <el-input  style='opacity: 0;position: absolute;'
                          v-model="AppId" id="input1"
                  >
                  </el-input>
                  <p @click="deleteTopic(index)" style="color:red">删除视频</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="getmoreTopic" v-show="getmoreTopic" @click="gettopiclist">加载更多</div>
    </div>
    <el-dialog
            title=""
            :visible.sync="dialogVisible"
            width="30%"
            class="dialog"
            >
      <div>
        <div class="dialog_title">
          <img src="/static/logo.png" alt="" class="logo">
          <span class="name">抖手</span>
        </div>
        <div class="dialog_content">
          <div>
            <h3>分享给好友</h3>
            <div class="modules">
              <img :src="xcxImgUrl" alt="" class="xcxImgUrl">
              <p>1.打开微信</p>
              <p>2.使用扫一扫扫描小程序码</p>
              <p>3.将视频分享给好友</p>
            </div>
          </div>
          <div>
            <h3>分享到朋友圈</h3>
            <div class="modules">
              <img :src="canvasUrl" alt="" class="canvasUrl" >
              <el-button type="success" class="download" ><a :href="canvasUrl" :download="imgName+'.png'" style="color:#fff;">保存图片</a></el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
            title=""
            :visible.sync="showEditDialog"
            width="50%"
            class="showEditDialog">
      <div class="editone">
        <p style="width:100px;">标题:</p><el-input
                placeholder="填写帖子标题"
                v-model="editTopicTitle"
                >
        </el-input>
      </div>
      <div class="editone">
        <p style="width:100px;">封面图：</p>
        <p class="coverUrlWrap">
          <img :src="editCoverUrl" alt="封面图" class="coverUrl">
          <input type="file" class="upload"  @change="readFile($event)">
        </p>
      </div>
      <div>
        <el-button type="success" class="download" @click="updateTopic">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog
            title="获取公众号嵌入路径"
            :visible.sync="showOpenMiniParamRouter"
            width="40%"
            class="showEditDialog">
      <div class="editone" style="padding-bottom: 20px;">
        <p style="width:100px;line-height: 40px;">视频播放路径:</p>
        <el-input
              v-model="openMiniParamRouter" id="input"
      >
      </el-input>&nbsp;&nbsp;
        <el-button type="success" @click="copytext">点击复制</el-button>
      </div>
    </el-dialog>
    <el-dialog
            title="获取公众号嵌入图片"
            :visible.sync="showOpenMiniParamImg"
            width="30%"
            class="showEditDialog"
    style="min-width: 500px">
      <div class="editone" >
        <el-radio v-model="radio" label="1" style="line-height: 200px!important;">
          <span class="scale">5:4</span>
        </el-radio>
        <div>
          <img :src="canvasImg1" alt="" class="canvasImg1">
        </div>
      </div>
      <div class="editone">
        <el-radio v-model="radio" label="2" style="line-height: 200px!important;">
          <span class="scale">16:9</span>
        </el-radio>
        <div>
          <img :src="canvasImg2" alt="" class="canvasImg2">
        </div>
      </div>
      <el-button type="success" class="download">
        <a :href="canvasImg" style="color:#fff;" :download="scaleImgName+'.png'">点击保存</a></el-button>
    </el-dialog>
    <el-dialog
            :visible.sync="showOpenVideo"
            class="showVideoDialog">
      <div>
        <video v-if="showOpenVideo" :src="videoSrc" controls preload="metadata" class="video" autoplay ></video>
      </div>
    </el-dialog>
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
    <a class="question" href="/question.html" target="_blank">
      <img src="/static/weixin.png" alt=""><br>
      常见问题
    </a>
  </div>
</template>
<script>
import {dateForm,urlName} from '../../../src/assets/js/common.js'
import {Message,MessageBox,Loading} from 'element-ui'
export default {
  name: 'app',
  data(){
    return {
      AppId:"wxf9dcbfc232055334",
      showResetMemberInfoType:0,
      showResetMemberInfo:false,
      memberInfo:{},
      memberName:"",
      imageUrl:"",
      sendImageUrl:"",
      pageIndex:1,
      pageSize:12,
      topicList:[],
      shownolist:false,
      xcxImgUrl:"",
      dialogVisible:false,
      canvasUrl:"",
      showEditDialog:false,
      editObj:{},
      editIndex:0,
      editCoverUrl:"",
      editTopicTitle:"",
      openMiniParamRouter:"",
      showOpenMiniParamRouter:false,
      showOpenMiniParamImg:false,
      radio:"1",
      canvasImg1:"",
      canvasImg2:"",
      canvasImg:"",
      scaleImgName:"",
      getmoreTopic:false,
      videoSrc:"",
      showOpenVideo:false,
      loadingInstance1:"",
      imgName:""
    }
  },
  beforeCreate(res){
    console.log(res)
  },
  created(){

  },
  mounted(){
    this.getMemberInfo()
    this.gettopiclist()
  },
  active(){
    console.log("active")
  },
  watch:{
    radio(newval,oldval){
      console.log(newval)
      if(newval==1){
        this.canvasImg=this.canvasImg1
      }else{
        this.canvasImg=this.canvasImg2
      }
    }
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
    openVideo(index){
      this.showOpenVideo=true
      var that = this;
      this.$axios({
        method:"get",
        url:"/common/videoData/ordinary/getVideoPlayUrlWithToken?source=topic&videoUrl="+that.topicList[index].mediaMixed[0].videoUrl,
      }).then((res)=>{
        console.log(res)
        that.videoSrc=res.data.data
      })
    },
    downloadImg(){
      var src =this.canvasUrl
      console.log(this.canvasUrl)
      window.open(src)
    },
    getMemberInfo(){
      var that = this;
      this.$axios({
        method:"get",
        url:"/index_node/getmemberInfo"
      }).then(function(res){
        console.log(res)
          that.memberInfo=res.data
          that.imageUrl=res.data.imageUrl
          that.memberName=res.data.memberName
      }).catch(function(res){
        console.log(res)
      })
    },
    gettopiclist(){
      var that = this;
      this.$axios({
        method:"get",
        url:"/pc/topic/admin/getMyTopic?"+that.$qs.stringify({
          mediaType: 'video',
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }),
      }).then(function(res){
       console.log(res)
        if(res.data.errorCode==0){
          if(res.data.data.length==0){
            that.shownolist=true
          }else {
              var topiclist = res.data.data.map(function (item) {
                item.mediaMixed = JSON.parse(item.mediaMixed)
                item.duration = that.formatSeconds(item.mediaMixed[0].duration)
                return item
              })
              if (res.data.data.length == that.pageSize) {
                that.getmoreTopic = true
                that.pageIndex++
              } else {
                Message({
                  message: '加载到底了',
                  type: 'success'
                });
                that.getmoreTopic = false
              }
              that.topicList = that.topicList.concat(topiclist)
          }
      }else{
        Message({
          message: res.data.message,
          type: 'info'
        });}
      }).catch(function(res){
        console.log(res)
      })
    },
    formatSeconds(value) {
      var theTime = parseInt(value);// 秒
      var middle= 0;// 分
      var hour= 0;// 小时
      if(theTime > 60) {
        middle= parseInt(theTime/60);
        theTime = parseInt(theTime%60);
        if(middle> 60) {
          hour= parseInt(middle/60);
          middle= parseInt(middle%60);
        }
      }
      var result = parseInt(theTime)>9?(""+parseInt(theTime)):("0"+parseInt(theTime));
      if(middle > 0) {
        result = parseInt(middle)>9?(""+parseInt(middle)+":"+result):("0"+parseInt(middle)+":"+result);
      }else{
        result = "00:"+result
      }
      if(hour> 0) {
        result = ""+parseInt(hour)+":"+result;
      }
      return result;
    },
    weixin(index){
      this.loadingInstance1 = Loading.service({ fullscreen: true ,text:"正在努力合成分享图片，请等待..."})
     // this.dialogVisible=true
      this.createQrcode(this.topicList[index].uuid)
      this.createCanvas(index)
      this.imgName=this.topicList[index].topicTitle
    },
    edit(index){
      this.editIndex=index
      this.showEditDialog=true;
      this.editObj=this.topicList[index]
      this.editCoverUrl=this.topicList[index].converUrlUpyun
      this.editTopicTitle=this.topicList[index].topicTitle
    },
    createQrcode(uuid){
      var senddata = {
        itemId: uuid,
        is_hyaline: true,
        page: "pages/full/full",
        scene: "1/2/" + uuid,
        width: 100
      }
      console.log("合成二维码的参数")
      var str="?"
      for (var p in senddata){
        str+= p+"="+senddata[p]+"&"
      }
     this.xcxImgUrl = "/common/imageData/admin/getXcxQrcode"+str;
    },
    createCanvas(index){
      var that = this
      var obj = this.topicList[index]
      console.log(obj)
      if(obj.mediaMixed[0].length<=obj.mediaMixed[0].width){
        var height = 872
      }else{
        var height = 1920
      }
      var canvas = document.createElement('canvas');
      if (canvas.getContext) {
        canvas.height=height;
        canvas.width=1080;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 1080, height);
        ctx.fillStyle = 'transparent'; // 设置背景颜色
        var img0=new Image;
        img0.crossOrigin = 'Anonymous';//解决跨域
        img0.src=obj.converUrlUpyun+"!/both/1080x"+(height-240);
        img0.onload=function(){
          ctx.drawImage(img0,0,0,1080,height-240);
          var img1=new Image;
          img1.crossOrigin = 'Anonymous'; //解决跨域  http://qr.liantu.com/api.php?text=
          img1.src="/static/canvas.png";
          img1.onload=function(){
            ctx.drawImage(img1,0,height-370,1080,370);
            var img3 = new Image;
            img3.crossOrigin = 'Anonymous'; //解决跨域  http://qr.liantu.com/api.php?text=
            img3.src="/static/openbtn.png";
            img3.onload=function(){
              ctx.drawImage(img3,445,(height/2)-225,190,210);
              var img4 = new Image;
              img4.crossOrigin = "Anonymous"; //解决跨域  http://qr.liantu.com/api.php?text=
              img4.src=that.xcxImgUrl;
              img4.onload=function(){
                ctx.drawImage(img4,850,height-220,180,180);
                ctx.save();
                ctx.font="65px bolder microsoft yahei";
                ctx.fillStyle = "#fff";
                ctx.fillText(obj.memberInformation.memberName,300,height-300);
                ctx.save();
                ctx.font="65px bolder microsoft yahei";
                ctx.fillStyle = "#000";
                ctx.fillText("长按识别立即播放",85,height-88);
                console.log(obj.memberInformation)
                var  newstr=(obj.memberInformation.imageUrl).replace("http:","https:")
                console.log(newstr)
                var img2=new Image;
                img2.crossOrigin = 'Anonymous';//解决跨域
                img2.src=newstr;
                img2.onload=function(){
                  ctx.save();
                  ctx.arc(170.5,height-270,82.5, 0, 2 * Math.PI);
                  // 从画布上裁剪出这个圆形
                  ctx.clip();
                  ctx.drawImage(img2,88,height-352,180,180);
                  that.canvasUrl=canvas.toDataURL("image/png");
                  that.dialogVisible=true
                  that.loadingInstance1.close()
                }
              }
            }
          }
        }
      } else {
        alert('你的浏览器不支持Canvas!');
      }
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
          console.log(width)
          console.log(height)
          console.log(width/height)
          if(!(width/height>0.8 && width/height<1.2) || width>320 || height>320){
            Message({
              type:'info',
              message:"图片不符合要求！"
            })
          }else{
            var imglist={
              file:file.files[0],
              length:file.files[0].size,
              uri:"/member/headerImage/"+that.memberInfo.wxUnionId+"/"+Date.parse(new Date())/1000+file.files[0].name.substr(file.files[0].name.lastIndexOf('.')+1,file.files[0].name.length)
            }
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
    readFile(file){
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
          uri:"/topic/"+that.editObj.memberInformation.wtmNumber+"/"+Date.parse(new Date())/1000+"/01."+file.files[0].name.substr(file.files[0].name.lastIndexOf('.')+1,file.files[0].name.length)
        }
        that.uploadImg(imglist,'editCoverUrl')
      }
    },
    uploadImg(imgList,keyname){
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
          that[keyname]="http://cdn.weitaomi.cn"+data1.url
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
    updateTopic(){
      var that = this
      var sendData={
        topicTitle:this.editTopicTitle,
        id:this.editObj.id,
        coverUrl:this.editCoverUrl
      }
      this.$axios({
        method:'post',
        data:sendData,
        url:"/pc/topic/admin/updateTopic"}).then((res)=>{
        console.log(res)
      if(res.data.errorCode==0){
        that.$set(that.editObj,"topicTitle",sendData.topicTitle)
        that.$set(that.editObj,"coverUrl",sendData.coverUrl)
        that.$set(that.topicList[that.editIndex],"converUrlUpyun",sendData.coverUrl)
        that.showEditDialog=false
        Message({
          message: '更新成功',
          type: 'success'
        });
      }else{
        Message({
          message: res.data.message,
          type: 'error'
        })
      }
      }).catch((res)=>{

      })
    },
    showcopyMiniParamRouter(index){
      var obj= this.topicList[index];
      console.log(obj)
      this.showOpenMiniParamRouter=true;
      this.openMiniParamRouter="pages/full/full?uuid=" + obj.uuid + "&isSelf=2&isShare=1&memberId=" + obj.memberId
    },
    copytext(){
      var clipBoardContent=this.openMiniParamRouter;
      var input = document.getElementById("input");
     // input.value = text; // 修改文本框的内容
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      //alert("复制成功");
      Message({
        message: '复制成功',
        type: 'success'
      });
      this.showOpenMiniParamRouter=false
    },
    copytext1(){
      var clipBoardContent=this.AppId;
      var input = document.getElementById("input1");
      // input.value = text; // 修改文本框的内容
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      //alert("复制成功");
      Message({
        message: '复制成功',
        type: 'success'
      });
    },
    showopenMiniParamImg(index){
      this.createCanvasScale(1.25,index)
      this.createCanvasScale(1.77,index)
      this.showOpenMiniParamImg=true
    },
    createCanvasScale(scale,index){
      var that = this
      var obj = this.topicList[index]
      console.log(obj)
      this.scaleImgName=this.topicList[index].topicTitle
      var canvas = document.createElement('canvas');
      if (canvas.getContext) {
        canvas.height=800;
        canvas.width=800*scale;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 800*scale, 800);
        ctx.fillStyle = 'transparent'; // 设置背景颜色
        var img0=new Image;
        img0.crossOrigin = 'Anonymous';//解决跨域
        img0.src=obj.converUrlUpyun+"!/both/"+800*scale+"x800";
        img0.onload=function(){
          ctx.drawImage(img0,0,0,800*scale,800);
          var img3 = new Image;
          img3.crossOrigin = 'Anonymous'; //解决跨域  http://qr.liantu.com/api.php?text=
          img3.src="/static/openbtn.png";
          img3.onload=function(){
            ctx.drawImage(img3,(400*scale-75),317.5,150,165);
            ctx.save();
            ctx.font="65px bolder microsoft yahei";
            ctx.fillStyle = "#fff";
            ctx.fillText(obj.duration,(400*scale-90),560);
            if(scale==1.25){
              that.canvasImg1=canvas.toDataURL("image/png");
            }else{
              that.canvasImg2=canvas.toDataURL("image/png");
            }
          }
        }
        // }
      } else {
        alert('你的浏览器不支持Canvas!');
      }
    },
    deleteTopic(index){
      var that = this;
      if (confirm("此操作将永久删除该视频, 是否继续?")==true){
        var sendData={
          itemId:this.topicList[index].uuid
        }
        this.$axios({
          method:'post',
          data:that.$qs.stringify(sendData),
          url:"/pc/topic/admin/deleteTopicOfMyTopicGroup"
        }).then((res)=>{
          if(res.data.errorCode==0){
            Message({
              type: 'success',
              message: '删除成功!'
            });
          that.topicList.splice(index,1)
          }else{
          Message({
            type: 'info',
            message: res.data.message
          });
          }
        }).catch((res)=>{
          console.log(res)
        })
        return true;
      }else{
        Message({
          type: 'info',
          message: '已取消删除'
        });
        return false;
      }
    }
  },
  filters:{
    dateForm,
  }
}
</script>
<style lang="stylus" scoped>
  @import '../../assets/css/reset.css'
#app
  background #f2f2f2
  min-height 100%
  padding-top 56px
  .showVideoDialog>>>.el-dialog__header
    padding 0
  .showVideoDialog>>>.el-dialog__body
    padding 0
  .showVideoDialog>>>.el-dialog__headerbtn
    display none
  .resetMemberInfo
    padding 20px
    .editone
      display flex
      line-height 50px
  .showVideoDialog
    .video
      width 100%
      height 100%
      display block
      height 600px
      background #000
  &>.title
    position fixed
    width 100%
    top 0
    z-index 10
  .showEditDialog
    .download
      display block
      margin 10px auto
    .scale
      background #000
      color #fff
      padding 3px 10px
      border-radius 3px
    .editone
      display flex
      margin-top 10px
      .canvasImg1
         width 250px
         height 200px
         float right
      .canvasImg2
         height 200px
         width 356px
         float right
      &>div
        float left
        flex 1
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
  .dialog>>>.el-dialog
    min-width 650px!important
  .dialog >>>.el-dialog__body
    padding 0
  .dialog_title
    text-align center
    height 56px
    font-size 22px
    .name
      height 100%
      display inline-block
      line-height 56px
      vertical-align middle
      font-size 18px
  .dialog_content
    display flex
    padding 40px 20px
    &>div
      flex 1
      margin 0 15px
      box-sizing border-box
      .modules
        border 1px solid #d6d6d6
        width 100%
        padding 15px
        box-sizing border-box
        margin-top 15px
        height 90%
        position relative
        .download
          position absolute
          left 50%
          bottom 20px
          transform translateX(-50%)
        .canvasUrl
          max-width 90%
          max-height 75%
          box-shadow 4px 4px 10px #444;
          position absolute
          top 40%
          left 50%
          transform translate(-50%,-50%)
        .xcxImgUrl
          width 70%
          margin 60px auto
          display block
        p
          font-size 14px
          line-height 2
      h3
        text-align center
  .title
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
  .question
    position fixed
    bottom 100px
    right 50px
  .content
    width 100%
    max-width 1200px
    margin 25px auto 100px
    .getmoreTopic
      width 150px
      border 1px solid #9ab9a9
      background #fff
      margin 30px auto 0
      text-align center
      cursor pointer
      padding 6px 20px
      border-radius 10px
      &:hover
        color #9ab9a9
    .upvideomark
      width 100%
      height 120px
      background #fff
      text-align center
      color #18b163
      .upload
        color #18b163
        font-size 22px
        img
          margin-top 20px
    .topiclist
      margin-top 10px
      background #fff
      display flex
      flex-wrap wrap
      .nolist
        height 300px
        text-align center
        flex 1
        line-height 300px
      .item
        width 25%
        margin-top 15px
        padding 0 15px
        position relative
        box-sizing border-box
        flex-direction row
        .openbtn
          position absolute
          top 40%
          left 50%
          transform translate(-50%,-50%)
          z-index 1
        .coverUrl
          border-top-left-radius 5px
          border-top-right-radius 5px
          overflow hidden
          width 100%
          border 1px solid #e4e4e4
          box-sizing border-box
          border-bottom none
        .videodetail
          position absolute
          bottom 42px
          height 33px
          left 16px
          right 16px
          background rgba(0,0,0,0.5)
          color #fff
          font-weight bold
          .readNum
            display inline-block
            height 100%
            vertical-align middle
            line-height 33px
          .duration
            height 100%
            line-height 33px
            margin-right 8px
        .detail
          height 42px
          line-height 42px
          border-bottom-left-radius 5px
          border-bottom-right-radius 5px
          border 1px solid #e4e4e4
          border-top none
          padding-left 5px
          box-sizing border-box
          .iconlist
            img
              margin-right 8px
              &:hover
                cursor pointer
            .dropmenuwrap
              .dropmenu
                position absolute
                z-index 3
                width 200px
                background #fff
                left 50%
                transform translateX(-50%)
                box-shadow 1px 1px 1px 1px #eee;
                border 1px solid #e4e4e4
                border-radius 5px
                display none
                p
                  margin 0 10px
                  padding 10px 0
                  border-bottom 1px solid #e4e4e4
                  line-height 25px
                  cursor pointer
                  .right
                    margin-top 6px
              &:hover
                .dropmenu
                  display block
</style>

