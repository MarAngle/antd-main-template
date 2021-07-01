import Vue from 'vue'
import _func from 'complex-func'

const contents = require.context('./current', false, /(\.vue)|(\.js)$/)

_func.loadContents(contents, function(item) {
  let data = item.default || item
  Vue.component(`LocalCurrent${data.name}`, data)
})
