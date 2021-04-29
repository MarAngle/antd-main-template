import mainfunc from './main'
import dataSet from './data/dataSet'

mainfunc.install = function(Vue, options = {}) {
  dataSet.setVue(Vue)
  if (options.module) {
    for (let n in options.module) {
      mainfunc[n] = options.module[n]
    }
  }
  if (options.methods) {
    for (let n in options.methods) {
      mainfunc[n] = options.methods[n]
    }
  }
  if (options.require) {
    mainfunc.initRequire(options.require)
  }
}

export default mainfunc
