import mainfunc from './main'
import dataSet from './data/dataSet'

mainfunc.install = function(Vue, options = {}) {
  dataSet.setVue(Vue)
}

module.exports = mainfunc
