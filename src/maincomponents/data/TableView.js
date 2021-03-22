import _func from '@/maindata/func/index'

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
        currentTableOption.props.columns = this.columnList
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
      // if (!currentTableOption.props.customRow) {
      //   currentTableOption.props.customRow = (a, b, c) => {
      //     console.log(a, b, c)
      //     return {
      //       props: {
      //       },
      //       style: {
      //         color: b == 1 ? 'red' : 'blue'
      //       },
      //       on: {
      //       }
      //     }
      //   }
      // }
      return currentTableOption
    },
    currentListData () {
      if (this.listData) {
        return this.listData
      } else {
        return this.maindata.data.list
      }
    }
  },
  mounted() {
  },
  methods: {
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
