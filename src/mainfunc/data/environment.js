
let environment = {
  env: {
    data: process.env.NODE_ENV,
    real: process.env.NODE_ENV
  },
  mode: {
    data: '',
    real: ''
  },
  canUse: {
    proxy: false
  }
}

environment.setEnv = function (data, prop = 'data') {
  this.env[prop] = data
}
environment.getEnv = function (prop = 'data') {
  return this.env[prop]
}
environment.setEnvMode = function (data, prop = 'data') {
  this.mode[prop] = data
}
environment.getEnvMode = function (prop = 'data') {
  return this.mode[prop]
}

environment.checkUse = function() {
  try {
    if (window.Proxy) {
      this.setCanUse('proxy', true)
    }
  } catch (e) {}
}

environment.setCanUse = function(prop, data) {
  this.canUse[prop] = data
}

environment.getCanUse = function(prop) {
  return this.canUse[prop]
}

environment.checkUse()

export default environment
