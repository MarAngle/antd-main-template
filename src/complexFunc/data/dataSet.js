let data = {
  Vue: null
}

data.set = function(target, prop, data) {
  if (this.Vue) {
    this.Vue.set(target, prop, data)
  } else {
    target[prop] = data
  }
}

data.setVue = function(Vue) {
  this.Vue = Vue
}

export default data
