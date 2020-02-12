export default class Bus{
  constructor(){
    this.events = {}
  }
  on(eventName, cb){
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(cb)
  }
  emit(eventName, ...res){
    if (!this.events[eventName]) return
    this.events[eventName].forEach((item, index) => {
      item(...res)
    })
  }
  off(eventName, cb) {
    if (!this.events[eventName]) return
    let index = this.events[eventName].findIndex(cb)
    if (index > -1) {
      this.events[eventName].splice(index, 1)
    }
    console.log(this.events)
  }
  clear(eventName){
    if (!this.events[eventName]) return
    delete this.events[eventName]
  }
}