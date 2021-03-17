import { option } from '@/mainbuild/index'
import EditData from './data/EditData'
import _func from '@/maindata/func/index'

option.setData({
  list: {
    unformat: function (ditem, prop) {
      let pitem = {
        title: ditem.getInterface('label', prop), // 标题
        dataIndex: ditem.prop,
        showprop: ditem.getInterface('showprop', prop),
        fixed: ditem.mod[prop].fixed || false, // 列表固定
        align: ditem.mod[prop].align || 'center', // 对齐方式
        width: ditem.mod[prop].width || 100, // 默认宽度
        ellipsis: ditem.mod[prop].ellipsis === undefined ? true : ditem.mod[prop].wrap,
        style: ditem.mod[prop].style || {},
        customCell: ditem.mod[prop].customCell,
        customHeaderCell: ditem.mod[prop].customHeaderCell,
        func: ditem.func
      }
      // 自定义插槽设置
      pitem.slotdata = {}
      let slotname = ditem.mod[prop].slot
      if (_func.getType(slotname) != 'string') {
        slotname = ditem.prop
      }
      pitem.scopedSlots = {
        customRender: `autoMainContent${slotname}`
      }
      pitem.slotdata.name = slotname
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
