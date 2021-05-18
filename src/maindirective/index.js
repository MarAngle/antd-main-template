import Vue from 'vue'

const _data = require.context('./data', false, /(\.js)$/)

function LoadData (_data) {
  let datalist = _data.keys()
  datalist.forEach(dataitem => {
    let item = _data(dataitem)
    let targetdata = item.default || item
    Vue.directive(targetdata.name, targetdata.data)
  })
}

LoadData(_data)
