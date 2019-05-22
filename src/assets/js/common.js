export const urlName="http://192.168.10.121:8001"
export const dateForm = function (timespan) {
   var dateTime = new Date(timespan * 1000)
   var year = dateTime.getFullYear()
   var month = dateTime.getMonth() + 1
   var day = dateTime.getDate()
   var hour = dateTime.getHours()
   var minute = dateTime.getMinutes()
   var nowNew = (new Date().getTime()) / 1000
   // var second = dateTime.getSeconds()
   // var now = new Date()

     // typescript转换写法
   // var milliseconds = 0
   var timeSpanStr
   var milliseconds = (nowNew - timespan) * 1000
   hour = hour < 10 ? '0' + hour : hour
   minute = minute < 10 ? '0' + minute : minute
   month = month < 10 ? '0' + month : month
   day = day < 10 ? '0' + day : day
   if (milliseconds <= 1000 * 60 * 1) {
     timeSpanStr = '刚刚'
   } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
     timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前'
   } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
     timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前'
   } else if (Number(year)=== new Date().getFullYear() && Number(month) === new Date().getMonth() + 1 && day === new Date().getDate() - 1) {
//            timeSpa=nStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
     timeSpanStr = '昨天 ' + hour + ':' + minute
   } else {
//            timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute+':'+second;  时间显示到秒
//            判断是否为今年
     if (year === new Date().getFullYear()) {
       timeSpanStr = month + '/' + day
     } else {
       timeSpanStr = year + '/' + month + '/' + day
     }
   }
   return timeSpanStr
 }
