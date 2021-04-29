let setData = {
  Vue: null
}

setData.set = function(target, prop, data) {
  if (this.Vue) {
    this.Vue.set(target, prop, data)
  } else {
    target[prop] = data
  }
}

setData.setVue = function(Vue) {
  this.Vue = Vue
}

export default setData
