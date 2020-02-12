/**
 * zyf-video
 * 基础功能：
 *  播放，暂停，倍速，调节音量，全屏,进度条
*/
import ZyfVideo from './video/index'
import './zyfVideo.styl'
import '../src/assets/iconfont/iconfont.css'
let wrap = document.createElement('div')
console.log(document)
let body = document.getElementsByTagName('body')
body[0].append(wrap)
let video = new ZyfVideo({
  el: wrap,
  // 文件sdn路径
  src: 'https://alphanote.oss-cn-beijing.aliyuncs.com/evidence/helpCenter/4BF24912D53C499DA8FA64DD0C624911.mp4',
  speedArr: [],
  volume: '20',
})
// 对外提供接口设置播放下一首
video.playNextVideo(()=>{
  console.log('播放下一首')
})