import _func from '@/maindata/func/index'
import AutoText from './../mod/AutoText'

export default {
  name: 'TableView',
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
    formatColumn: {
      type: Function,
      required: false
    },
    listType: {
      type: String,
      required: false,
      default: 'list'
    },
    listData: {
      // 定制列表数据
      type: Array,
      required: false
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
    tableOption: {
      type: Object,
      required: false,
      default: null
    },
    autoTextTipOption: {
      type: [String, Object],
      required: false,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    currentTableOption() {
      let currentTableOption = this.tableOption
      if (!currentTableOption) {
        currentTableOption = {}
      }
      if (!currentTableOption.props) {
        currentTableOption.props = {}
      }
      if (!currentTableOption.props.columns) {
        currentTableOption.props.columns = this.currentColumnList
      }
      if (!currentTableOption.props.dataSource) {
        currentTableOption.props.dataSource = this.currentListData
      }
      if (!currentTableOption.props.rowKey) {
        currentTableOption.props.rowKey = this.maindata.getDictionaryPropData('prop', 'id')
      }
      if (currentTableOption.props.pagination === undefined) {
        currentTableOption.props.pagination = false
      }
      if (!currentTableOption.props.size) {
        currentTableOption.props.size = this.size
      }
      if (!currentTableOption.props.bordered) {
        currentTableOption.props.bordered = this.bordered
      }
      return currentTableOption
    },
    currentListData () {
      if (this.listData) {
        return this.listData
      } else {
        return this.maindata.data.list
      }
    },
    currentColumnList() {
      // JSX语法使用需要在此进行
      let list = []
      for (let i = 0; i < this.columnList.length; i++) {
        let pitem = this.columnList[i]
        if (!pitem.customRender) {
          pitem.customRender = (text, record, index) => {
            let data = pitem.func.show(text, { type: this.listType })
            let type = _func.getType(data)
            if (type == 'object') {
              data = JSON.stringify(data)
            } else if (type == 'array') {
              data = data.join(',')
            }
            if (pitem.ellipsis || pitem.autoWrap) {
              // 自动省略切自动换行?
              let AutoTextOption = {
                props: {
                  text: data,
                  auto: true,
                  tip: this.formatAutoTextTipOption(pitem.tip, this.autoTextTipOption)
                }
              }
              return <AutoText { ...AutoTextOption } />
            } else {
              return data
            }
          }
          let titleSlotProp = pitem.dataIndex + '-title'
          let titleSlot = this.$scopedSlots[titleSlotProp]
          if (titleSlot) {
            pitem.title = titleSlot({
              item: pitem,
              list: this.columnList
            })
          }
        }
        if (this.formatColumn) {
          this.formatColumn(pitem, this.columnList, this.listType)
        }
        list.push(pitem)
      }
      return list
    }
  },
  mounted() {
  },
  methods: {
    formatAutoTextTipOption(pitemTip, mainTip) {
      let tipOption = pitemTip || mainTip
      return tipOption
    },
    renderList() {
      let renderList = []
      return renderList
    }
  },
  // 主模板
  render() {
    let renderList = this.renderList()
    let render = (
      <a-table {...this.currentTableOption}>
        { renderList}
      </a-table>
    )
    return render
  }
}
