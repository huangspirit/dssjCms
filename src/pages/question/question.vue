<template>
<div class="content">
    <div class="title">公众号如何使用抖手视界</div>
    <div class="item">
        <label>1.点击“新建群发”</label>
        <img src="/static/1.png" alt="">
    </div>
    <div class="item">
        <label></label>2.点击“自建图文”
        <img src="/static/2.png" alt="">
    </div>
    <div class="item">
        <label>3.点击“小程序”</label>
        <img src="/static/3.png" alt="">
    </div>
    <div class="item">
        <label>4.输入“<span class="copytext" @click="copytext">抖手视界</span>”(点击复制）或票圈长视频小程序ID“<span class="copytext" @click="copytext1">wxf9dcbfc232055334</span>”(点击复制)。
            <input type="text" id="input1" value="wxf9dcbfc232055334">
            <input type="text" id="input" value="抖手视界">
        </label><img src="/static/4.png" alt="">
    </div>
    <div class="item">
        <label>5.获取页面路径的方法： 1.点击所发视频 “…”。 2.点击获取公众号嵌入路径，选择你使用的小程序页面路径。 3.将获取的页面路径粘贴到小程序路径中。（如下图所示）</label>
        <img src="/static/5.png" alt="">
    </div>
    <div class="item">
        <label>6.获得公众号嵌入图方法：1.点击所发视频 “…”。2.选择获得公众号嵌入图。3.将获得的图片上传即可。（如下图所示）</label>
        <img src="/static/6.jpg" alt="">
    </div>
</div>
</template>
<script>
    import {Message,MessageBox} from 'element-ui'
    export default{
        name:"question",
        data(){
            return{

            }
        },
        methods:{
            copytext(){
                var clipBoardContent="抖手视界";
                var input = document.getElementById("input");
                // input.value = text; // 修改文本框的内容
                input.select(); // 选中文本
                document.execCommand("copy"); // 执行浏览器复制命令
                //alert("复制成功");
                Message({
                    message: '复制成功',
                    type: 'success'
                });
            },
            copytext1(){
                var clipBoardContent="wxf9dcbfc232055334";
                var input = document.getElementById("input1");
                // input.value = text; // 修改文本框的内容
                input.select(); // 选中文本
                document.execCommand("copy"); // 执行浏览器复制命令
                //alert("复制成功");
                Message({
                    message: '复制成功',
                    type: 'success'
                });
            }
        }
    }
</script>
<style scoped>
    #input,#input1{
        position: absolute;
        opacity: 0;
    }
    .content{
        width:100%;
        max-width:1200px;
        margin:15px auto;
    }
    .copytext{
        text-decoration: underline;
        cursor: pointer;
    }
    .item{
        margin-top:20px;
    }
    label{
        font-weight:bold;
    }
    img{
        width:100%;
        margin-top:20px;
    }
</style>