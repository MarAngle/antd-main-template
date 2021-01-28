
let environment = {
  env: {
    data: process.env.NODE_ENV,
    real: process.env.NODE_ENV
  },
  mode: {
    data: '',
    real: ''
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

export default environment
