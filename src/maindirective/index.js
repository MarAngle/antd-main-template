import Vue from 'vue'
import _func from 'complex-func'

const contents = require.context('./data', false, /(\.js)$/)

_func.loadContents(contents, function(item) {
  let data = item.default || item
  Vue.directive(data.name, data.data)
})
