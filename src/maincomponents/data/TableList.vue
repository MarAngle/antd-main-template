<style lang="less" scoped>

</style>
<template>
  <div :class="'local-main-TableList'">
    <a-table
      :size="size"
      :rowKey="maindata.dictionary.getIdProp()"
      :columns="columnList"
      :dataSource="currentListData"
      :pagination="false"
      :customRow="customRow"
      :customHeaderRow="customHeaderRow"
    >
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'TableList',
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
    size: {
      type: String,
      required: false,
      default: 'default' // default / middle / small
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
    }
  },
  methods: {
  }
}
</script>
