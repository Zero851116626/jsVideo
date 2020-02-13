/**
 * 快速创建dom节点
 * params：
 *  type， String, 创建标签名称
 *  domClass String， 创建节点类名
*/
export function createDom (type, domClass){
  let dom = document.createElement(type)
  dom.classList.add(domClass)
  return dom
}

/**
 * 转换时间格式
 * mm 传入的毫秒值
*/
// 辅助方法
function dealNumber(num) {
  if (num < 10) {
    return  '0' + num
  } else {
    return '' + num
  }
}
export function dealTimeFormat(mm){
  // 总秒，总分，总时
  let allTime = Math.floor(mm / 100)
  let h = Math.floor(allTime / 60 / 60)
  let m = Math.floor(allTime / 60 - h * 60)
  let s = Math.floor(allTime - h * 60 * 60 - m * 60)
  let hour = dealNumber(h)
  let minute = dealNumber(m)
  let second = dealNumber(s)
  return hour === '00' ? minute + ':' + second : hour + ':' + minute + ':' + second
}

export function getDomStyle(node){
  return node.getBoundingClientRect()
}

/**
 * 检测点击返回方法
 * params:
 *  @el node 需要检测的节点
 *  @mouseEvent obj 点击事件对象
 *  @cb function 回调事件
*/
export function clickOutSide (el, mouse, cb) {
  return el.contains(mouse.target)
}