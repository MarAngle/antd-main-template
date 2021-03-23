<style lang='less' scoped>
.mainpagination {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.totalnum p{
  margin: 0;
  padding: 0;
  margin-right: 8px;
}

.paginationdiv{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
}

</style>
<template>
  <div
    class="mainpagination"
    :style="{
      paddingTop: paddingTop + 'px',
      paddingLeft: paddingLeft + 'px',
      paddingRight: paddingRight + 'px',
      paddingBottom: paddingBottom + 'px'
    }"
  >
    <div v-if="!simple">
      <div v-if="data.mod.total.show && data.mod.total.align=='left'" class="totalnum">
        <p>{{ showTotal(data.page.total, data.data.total) }}</p>
      </div>
    </div>
    <div class="paginationdiv">
      <div v-if="!simple && data.mod.total.show && data.mod.total.align!='left'" class="totalnum">
        <p>{{ showTotal(data.page.total, data.data.total) }}</p>
      </div>
      <a-pagination
        :showQuickJumper="data.mod.jump.show"
        :showSizeChanger="data.mod.size.show"
        :current="data.page.current"
        :simple="simple"
        :pageSize=" data.size.current"
        :pageSizeOptions=" data.size.list"
        :total="data.data.total"
        @change="pageChange"
        @showSizeChange="sizeChange"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PaginationView',
    data () {
      return {}
    },
    props: {
      data: {
        type: Object,
        required: true
      },
      simple: {
        type: Boolean,
        required: false,
        default: false
      },
      paddingTop: {
        type: Number,
        required: false,
        default: 24
      },
      paddingBottom: {
        type: Number,
        required: false,
        default: 5
      },
      paddingRight: {
        type: Number,
        required: false,
        default: 0
      },
      paddingLeft: {
        type: Number,
        required: false,
        default: 0
      }
    },
    watch: {
      'data.page.total': function(val) {
        if (this.data.page.current > val) {
          this.data.page.current = val
          this.$emit('change', 'page', this.data.page.current)
        }
      }
    },
    methods: {
      showTotal(pagenum, num) {
        if (this.data.mod.total.func) {
          return this.data.mod.total.func(pagenum, num)
        } else {
          console.error('分页器需要设置总数计算函数')
          return `共${pagenum}页 ${num}条`
        }
      },
      pageChange(current) {
        this.data.setPage(current)
        this.$emit('change', 'page', current)
      },
      sizeChange(current, size) {
        this.data.setSize({
          page: current,
          size: size
        })
        this.$emit('change', 'size', {
          page: current,
          size: size
        })
      }
    }
  }
</script>
