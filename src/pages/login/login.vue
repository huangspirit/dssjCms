<template>
  <div id="app">
    <div class="imgwrap"><img src="/static/cover.jpg" alt=""></div>
    <div class="qrcodewrap">
      <img src="/static/logo.jpg" alt="" class="logo">
      <div id="iframeWrap"></div>
    </div>
   </div>
</template>
<script>
export default {
  name: 'app',
  data(){
    return {

    }
  },
  created(){

  },
  mounted(){
    var obj = new WxLogin({
      self_redirect:false,
      id:"iframeWrap",
      appid: "wxd4eeb52e7af72d3c",
      scope: "snsapi_login",
      redirect_uri: encodeURIComponent("https://dssj.weitaomi.com/index"),
      state:  Math.ceil(Math.random()*1000),
      style: "black",
      href:"data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KLmltcG93ZXJCb3ggLnFyY29kZSB7CiAgICB3aWR0aDogMTQwcHg7CiAgICBoZWlnaHQ6IDE0MHB4OwogICAgbWFyZ2luOjAgYXV0bzsKICAgIGJvcmRlcjogMDsKfQouaW1wb3dlckJveCAuaW5mb3sKICAgIHdpZHRoOmF1dG87Cn0KLmltcG93ZXJCb3h7CiAgICBsaW5lLWhlaWdodDogMS4yOwp9CiN3eF9hZnRlcl9zY2FuewogICAgZGlzcGxheTogbm9uZSFpbXBvcnRhbnQ7Cn0="
    });
  },
  watch:{

  },
  components:{},
  methods:{},
  filters:{}
}
</script>
<style lang="stylus" scoped>
  @import "../../assets/css/reset.css";
#app
  display flex
  width 755px
  height 430px
  padding 50px 40px
  box-sizing border-box
  border-radius 10px
  position absolute
  background #fff
  top 50%
  left 50%
  transform translate(-50%,-50%)
  z-index 1
  .imgwrap
    height 100%
    img
      height 100%
      display block
  .qrcodewrap
      flex  1
      padding-left 40px
    .logo
      display block
      width 160px
      margin 0 auto
    #iframeWrap
      margin 0 auto
      width 200px
      height 250px
#iframeWrap>>>iframe
    width 100%
    height 100%
</style>
