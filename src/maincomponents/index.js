import Vue from 'vue'

const _mainviews = require.context('./current', false, /(\.vue)|(\.js)$/)
function LoadViews (_views, mod = '') {
  let viewlist = _views.keys()
  viewlist.forEach(item => {
    let viewitem = _views(item)
    let viewdata = viewitem.default || viewitem
    Vue.component(`Local${mod}${viewdata.name}`, viewdata)
  })
}

LoadViews(_mainviews, 'Current')
