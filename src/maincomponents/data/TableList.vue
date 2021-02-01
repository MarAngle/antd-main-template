<style lang="less" scoped>
p{
  margin: 0;
}
</style>
<template>
  <div :class="'local-main-TableList'">
    <a-table
      :size="size"
      :bordered="bordered"
      :rowKey="maindata.dictionary.getIdProp()"
      :columns="columnList"
      :dataSource="currentListData"
      :pagination="false"
      :customRow="customRow"
      :customHeaderRow="customHeaderRow"
      :scroll="{ x: width }"
    >
      <div
        v-for="(pitem, k) in columnList"
        :key="k"
        :slot="pitem.scopedSlots.customRender"
        :style="buildTextStyle(pitem)"
        slot-scope="text, record, index"
      >
        <slot :name="pitem.slotdata.name" :text="text" :record="record" :index="index">
          <AutoText :text="showData(pitem, text)" :auto="pitem.ellipsis" :tip="pitem.tip" />
        </slot>
      </div>
    </a-table>
  </div>
</template>

<script>
import AutoText from './../mod/AutoText'

export default {
  name: 'TableList',
  components: {
    AutoText
  },
  data () {
    return {
    }
  },
  props: {
    maindata: {
      // ListData的实例
      type: Object,
      required: true
    },
    columnList: {
      // 定制列配置
      type: Array,
      required: true
    },
    listData: {
      // 定制列表数据
      type: Array,
      required: false
    },
    paginationData: {
      // 定制分页器
      type: Object,
      required: false
    },
    paginationShowTotal: {
      type: Function,
      required: false,
      default: function () {
        return function (total, range) {
          console.log(total, range)
          return total
        }
      }
    },
    size: {
      type: String,
      required: false,
      default: 'default' // default / middle / small
    },
    bordered: {
      type: Boolean,
      required: false,
      default: true
    },
    customRow: {
      type: Function,
      required: false
    },
    customHeaderRow: {
      type: Function,
      required: false
    }
  },
  computed: {
    currentListData () {
      if (this.listData) {
        return this.listData
      } else {
        return this.maindata.data.list
      }
    },
    minWidth () {
      let num = 0
      for (let n in this.columnList) {
        num = num + this.columnList[n].width
      }
      if (this.rowSelection) {
        num = num + 60
      }
      return num
    },
    width () {
      // if (this.widthType == 'count') {
      //   if (this.widthData) {
      //     return this.widthData > this.minWidth ? false : this.minWidth
      //   } else {
      //     let defaultWidth = this.page.mod.main.width - 96
      //     return defaultWidth > this.minWidth ? false : this.minWidth
      //   }
      // } else {
      //   return true
      // }
      return true
    }
  },
  methods: {
    buildTextStyle (pitem) {
      let style = {}
      if (pitem.width) {
        let type = this._func.getType(pitem.width)
        if (type == 'number') {
          style.minWidth = pitem.width - 32 + 'px'
        }
      }
      return style
    },
    showTips (pitem, text) {
      if (pitem.ellipsis) {
        return this.showData(pitem, text)
      } else {
        return ''
      }
    },
    showData (pitem, text) {
      let data = pitem.func.show(text, { type: this.modType })
      let type = this._func.getType(data)
      if (type == 'object') {
        data = JSON.stringify(data)
      } else if (type == 'array') {
        data = JSON.stringify(data)
      }
      return data
    }
  }
}
</script>
