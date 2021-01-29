<style lang="less" scoped>

</style>
<template>
  <div :class="'local-main-TableList local-main-TableList-' + tableLine">
    <a-table
      size="middle"
      :row-selection="rowSelection"
      :rowKey="maindata.dictionary.getIdProp()"
      :columns="mainlist"
      :dataSource="currentListData"
      :pagination="false"
      :scroll="{ x: width }"
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
      type: Object,
      required: true
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
