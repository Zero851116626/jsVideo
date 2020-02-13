import {createDom, dealTimeFormat, getDomStyle, clickOutSide} from '../utils/tools'
import Bus from '../utils/bus'
/**
 * params: 
 *  wrap Node  存放播放器的节点
 *  src String 播放视频的路径
 *  speed String 默认的播放速度
 *  volume String 默认的播放音量
*/
/**
 * Object.assign用来设置可配置的样式
*/
let bus = new Bus()
export default class ZyfVido{
  constructor(params){
    // 外界传入
    this.el = null
    // 包裹一切
    this.wrap = null
    this.src = null
    this.speed = null
    this.volume = null
    this.fullScreen = null
    this.playStatus = null
    this.progress = null
    this.width = null
    this.height = null
    // 播放按钮
    this.playBtn = null
    // 下一部
    this.nextVideo = null
    this.currentTime = null
    this.totalTime = null
    this.fullScreenBtn = null
    this.setBtn = null
    this.fullScreenBtn = null
    this.progressControlBtn = null
    this.progressFinished = null
    this.progressLine = null
    // 控制进图条的变量
    this.progressValue = {
      startX: 0,
      endX: 0
    }
    this.timer = null

    // 倍速播放数组
    this.speedArr = []
    this.speedBox = null
    this.init(params)
    // 最终挂载
    this.el.append(this.wrap)
  }
  /**
   * 创建dom结构
   * 初始化视频信息
  */
  init(params){
    // 初始化赋值过程
    this.setValue(params)
    this.createDomConstruction()
    this.bindEvents()
    this.canPlayVideo()
  }
  setValue(params){
    this.wrap = createDom('div', 'video-wrap')
    
    let {el, src, speed, volume,width,height} = params
    this.el = el
    this.src = src
    this.speed = speed === undefined ? '1.0' : speed
    this.voluem = volume === undefined ? '100' : volume
    this.width = width || 500
    this.height = height || 300
    
    // 状态
    this.fullScreen = false
    this.playStatus = false
    // 需要处理一下时间格式
    this.progress = dealTimeFormat(0)
    
    // 倍速数组值
    if (Array.isArray(params.speedArr) && params.speedArr.length > 0) {
      this.speedArr = params.speedArr
    } else {
      this.speedArr = ['0.5', '1.0', '1.5', '2.0']
    }
  }
  // 创建dom结构
  createDomConstruction(){
    this.setWrapStyle()
    this.createVideo()
    this.createControl()
  }
  setWrapStyle(){
    let obj = {
      height: this.height + 'px',
      width: this.width + 'px',
    }
    Object.assign(this.wrap.style, obj)
  }
  createVideo(){
    this.video = createDom('video', 'zyf-video')
    // 属性设置
    let obj = {
      src: this.src,
      autoplay: false,
      controls: false,
      // width: '100%',
      // height: '100%'
    }
    Object.assign(this.video, obj)
    this.wrap.append(this.video)
  }
  createControl(){
    this.controls = createDom('div', 'video-controls')
    this.wrap.append(this.controls)
    this.setControlBtn()
  }
  // 设置控制按钮
  setControlBtn(){
    let leftBox = createDom('div', 'left-btns')
    let rightBox = createDom('div', 'right-btns')
    let playBtn = createDom('span', 'play-btn')
    playBtn.classList.add('iconfont', 'icon-bofang')
    leftBox.append(playBtn)
    this.playBtn = playBtn
    
    let nextVideo = createDom('span', 'next-video')
    nextVideo.classList.add('iconfont', 'icon-xiayixiang')
    leftBox.append(nextVideo)
    this.nextVideo = nextVideo

    // 左侧控制栏
    let progress = createDom('div', 'progress')
    let currentTime = createDom('span', 'current-time')
    let totalTime = createDom('span', 'total-time')
    let separator = createDom('span', 'separator')
    separator.innerHTML = '/'
    currentTime.innerHTML = '00:00'
    totalTime.innerHTML = '00:00'
    this.currentTime = currentTime
    this.totalTime = totalTime
    progress.append(currentTime)
    progress.append(separator)
    progress.append(totalTime)
    leftBox.append(progress)

    // 右侧控制栏
    let volumeBtn = createDom('span', 'volume-btn')
    volumeBtn.classList.add('iconfont', 'icon-V')
    let setBtn = createDom('span','set-btn')
    setBtn.classList.add('iconfont', 'icon-shezhi')
    let fullScreenBtn = createDom('span', 'full-screen-btn')
    fullScreenBtn.classList.add('iconfont', 'icon-quanping')
    let speed = createDom('span', 'speed-control')
    speed.innerHTML = 'x' + Number.parseFloat(this.speed)
    this.speedDom = speed
    rightBox.append(speed)
    rightBox.append(volumeBtn)
    rightBox.append(setBtn)
    rightBox.append(fullScreenBtn)
    this.volumeBtn = volumeBtn
    this.setBtn = setBtn
    this.fullScreenBtn = fullScreenBtn

    // 进度条控制栏
    let progressLine = createDom('div', 'progress-line')
    let progressControlBtn = createDom('span', 'contral-btn')
    progressLine.append(progressControlBtn)
    let progressFinished = createDom('div', 'progress-finished')
    progressLine.append(progressFinished)
    this.progressLine = progressLine
    this.progressControlBtn = progressControlBtn
    this.progressFinished = progressFinished


    // 倍速选择框
    let speedBox = createDom('div', 'speed-choose')
    for(let i = 0, l = this.speedArr.length; i<l; i++){
      let speed = createDom('span', 'speed-item')
      speed.innerHTML = this.speedArr[i]
      speedBox.append(speed)
    }
    this.speedBox = speedBox
    this.speedBox.classList.toggle('unshow')
    rightBox.append(speedBox)
    

    this.controls.append(progressLine)
    this.controls.append(leftBox)
    this.controls.append(rightBox)
  }
  // 更新进度显示方法
  updateProgress(time){
    this.currentTime.innerHTML = dealTimeFormat(time)
  }
  // 绑定基础事件
  bindEvents(){
    let that = this
    // 绑定播放
    this.bindFunction(this.playBtn, 'click', ()=>{
      if (this.playStatus) {
        this.pausePlay()
      } else {
        this.normalPlay()
      }
    })



    // 绑定进度条
    this.bindFunction(this.progressControlBtn, 'mousedown', (e)=>{
      this.pausePlay()
      this.progressValue.startX = e.clientX
      bus.on('move', (e)=>{
        this.progressBtnMove(e)
      })
      bus.on('mouseup', ()=>{
        this.whenMouseUp()
      })
      this.bindFunction(this.wrap, 'mousemove', this.dragProgressBtn)
    }, true)
    this.bindFunction(this.wrap, 'mouseup', this.finishMove)



    // 给进读条绑定点击事件
    this.bindFunction(this.progressLine, 'click', (e)=>{
      if (e.target === this.progressControlBtn) return
      clearInterval(this.timer)
      let pos = e.offsetX - 5
      this.setVideoPlayProgress(pos)
      this.setControlBtnPos(pos)
      this.normalPlay()
    })



    // 播放完成
    this.bindFunction(this.video, 'ended', ()=>{
      this.finishPlay()
    })
    

    // 播放速度选择器的出现与否
    this.bindFunction(this.speedDom, 'click', (e)=>{
      if (this.speedBox.classList.contains('unshow')) {
        this.speedBox.classList.remove('unshow')
        window.addEventListener('click', (e)=>{
          if (!clickOutSide(this.speedBox, e)) {
            this.speedBox.classList.add('unshow')
          }
        }, 'once')
      }
    })

    // 修改播放速度
    this.bindFunction(this.speedBox, 'click', (e)=>{
      this.setPlaySpeed(Number.parseFloat(e.target.innerHTML))
      this.speedBox.classList.toggle('unshow')
    })


    // 全屏播放
    // 全屏与退出全屏的api是异步的
    this.bindFunction(this.fullScreenBtn, 'click', ()=>{
      // debugger
      if (!this.fullScreen) {
        this.fullScreen = true
        let fullScreenPromise = this.wrap.requestFullscreen()
        fullScreenPromise.then(()=>{
          this.width = getDomStyle(this.controls).width
          let left = this.video.currentTime / this.video.duration * this.width
          this.setControlBtnPos(left)
        })
      } else {
        this.fullScreen = false
        let exitFullScreenPromise = document.exitFullscreen();
        exitFullScreenPromise.then(()=>{
          this.width = getDomStyle(this.controls).width
          let left = this.video.currentTime / this.video.duration * this.width
          this.setControlBtnPos(left)
        })
      }
    })
  }
  // 拖动进度条时绑定
  dragProgressBtn(e){
    bus.emit('move', e)
  }


  // 播放时触发
  normalPlay(){
    let widthPerSecond = Number.parseFloat(this.width / this.video.duration)
    this.updateProgress(this.video.currentTime * 100)
    this.video.play()
    this.playStatus = true
    this.playBtn.classList.remove('icon-bofang')
    this.playBtn.classList.add('icon-zanting')
    this.timer = setInterval(()=>{
      // 更新currentTime
      this.updateProgress(this.video.currentTime * 100)
      // 更新位置
      // 当前位置+1s位置
      let currentPos = Number.parseFloat(this.progressControlBtn.style.left || 0) + widthPerSecond
      this.setControlBtnPos(currentPos)
    }, 500)
  }
  // finishPlay
  finishPlay(){
    clearInterval(this.timer)
    this.playStatus = false
    this.video.pause()
    this.playBtn.classList.remove('icon-zanting')
    this.playBtn.classList.add('icon-bofang')
  }
  // 暂停播放
  pausePlay(){
    clearInterval(this.timer)
    this.playStatus = false
    this.video.pause()
    this.playBtn.classList.remove('icon-zanting')
    this.playBtn.classList.add('icon-bofang')
  }
  progressBtnMove(e){
    this.progressValue.endX = e.clientX
    let left = Number.parseFloat(this.progressControlBtn.style.left || 0)
    this.progressControlBtn.style.left = Math.max(0, Math.min(left + (this.progressValue.endX - this.progressValue.startX ), this.width - 10)) + 'px'
    this.progressValue.startX = e.clientX

    this.progressFinished.style.width = this.progressControlBtn.style.left
    // 处理当前时间
    this.setVideoPlayProgress(Number.parseFloat(this.progressControlBtn.style.left || 0))
  }
  finishMove(){
    bus.emit('mouseup')
  }
  whenMouseUp(e){
    this.wrap.removeEventListener('mousemove', this.dragProgressBtn)
    bus.clear('move')
    bus.clear('mouseup')
  }
  setVideoPlayProgress(left){
    let radio = left / this.width
    let duration = this.video.duration
    // s => mm
    let currentTime = radio * duration * 100
    this.updateProgress(currentTime)
    // 更新实际进度
    this.video.currentTime = currentTime / 100
  }
  setControlBtnPos(length){
    // 要减去按钮的一半宽度
    if (length + 10 <= this.width) {
      this.progressControlBtn.style.left = length + 'px'
      this.progressFinished.style.width = this.progressControlBtn.style.left
    }
  }
  // 绑定方法
  bindFunction(node, type, cb, boolean = false){
    node.addEventListener(type, cb, boolean)
  }
  // 视频加载完成
  canPlayVideo(){
    this.bindFunction(this.video, 'canplay', ()=>{
      // 此处获取时间为s，但是方法内处理的时间为mm
      let totalTime = this.video.duration * 100
      this.totalTime.innerHTML = dealTimeFormat(totalTime)
    })
  }



  // 外界允许调用的接口
  // 下一首功能做借口让用户设置
  playNextVideo(cb){
    this.nextVideo.addEventListener('click', cb)
  }

  // 设置速度
  setPlaySpeed(speed){
    this.speedDom.innerHTML = 'x' + speed
    this.video.playbackRate = speed
  }
}