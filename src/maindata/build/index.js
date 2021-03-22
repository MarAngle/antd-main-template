import { option } from '@/mainbuild/index'
import EditData from './data/EditData'
import _func from '@/maindata/func/index'

option.setData({
  list: {
    format: function (ditem, prop, data) {
      if (data) {
        if (!data.dataIndex) {
          data.dataIndex = ditem.prop
        }
        if (!data.align) {
          data.align = 'center'
        }
        if (!data.width) {
          data.width = 100
        }
        if (data.customCell) {
          let type = _func.getType(data.customCell)
          if (type == 'object') {
            let customCellOption = data.customCell
            data.customCell = () => {
              return customCellOption
            }
          }
        }
        if (data.customHeaderCell) {
          let type = _func.getType(data.customHeaderCell)
          if (type == 'object') {
            let customHeaderCellOption = data.customHeaderCell
            data.customHeaderCell = () => {
              return customHeaderCellOption
            }
          }
        }
        ditem.mod[prop] = data
      }
    },
    unformat: function (ditem, prop) {
      let pitem = {
        ...ditem.mod[prop]
      }
      if (!pitem.title) {
        pitem.title = ditem.getInterface('label', prop)
      }
      return pitem
    }
  },
  info: {
    unformat: function (ditem, prop, { targetitem }) {
      let pitem = {
        prop: ditem.prop,
        label: ditem.getInterface('label', prop),
        showtype: ditem.getInterface('showtype', prop),
        layout: ditem.getLayout(prop)
      }
      let target = ditem.triggerFunc('show', targetitem[ditem.prop], {
        targetitem: targetitem,
        type: prop
      })
      pitem.data = target
      return pitem
    }
  },
  edit: {
    format: function (ditem, prop, data) {
      if (data.type == 'edit') {
        ditem.mod[prop] = ditem.mod.edit
      } else {
        // data.prop = ditem.prop
        data.parent = ditem
        ditem.mod[prop] = new EditData(data, {
          // type: ditem.getInterface('type', prop),
        })
      }
    },
    unformat: function (ditem, prop) {
      let pitem = {
        prop: ditem.prop,
        label: ditem.getInterface('label', prop),
        originprop: ditem.getInterface('originprop', prop),
        type: ditem.getInterface('type', prop),
        func: ditem.func,
        layout: ditem.getLayout(prop),
        edit: ditem.mod[prop]
      }
      // pitem.edit.readyData()
      return pitem
    },
    build: function (data, prop, payload) {
      data.form = {
        num: 0,
        dom: null,
        data: {}
      }
    }
  },
  build: {
    type: 'edit'
  },
  change: {
    type: 'edit'
  }
})
