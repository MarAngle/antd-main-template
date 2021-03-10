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
      <div v-if="paginationdata.mod.total.show && paginationdata.mod.total.align=='left'" class="totalnum">
        <p>{{ showTotal(paginationdata.page.total, paginationdata.data.total) }}</p>
      </div>
    </div>
    <div class="paginationdiv">
      <div v-if="!simple && paginationdata.mod.total.show && paginationdata.mod.total.align!='left'" class="totalnum">
        <p>{{ showTotal(paginationdata.page.total, paginationdata.data.total) }}</p>
      </div>
      <a-pagination
        :showQuickJumper="paginationdata.mod.jump.show"
        :showSizeChanger="paginationdata.mod.size.show"
        :current="paginationdata.page.current"
        :simple="simple"
        :pageSize=" paginationdata.size.current"
        :pageSizeOptions=" paginationdata.size.list"
        :total="paginationdata.data.total"
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
      paginationdata: {
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
      'paginationdata.page.total': function(val) {
        if (this.paginationdata.page.current > val) {
          this.paginationdata.page.current = val
          this.$emit('change', 'page', this.paginationdata.page.current)
        }
      }
    },
    methods: {
      showTotal(pagenum, num) {
        if (this.paginationdata.mod.total.func) {
          return this.paginationdata.mod.total.func(pagenum, num)
        } else {
          console.error('分页器需要设置总数计算函数')
          return `共${pagenum}页 ${num}条`
        }
      },
      pageChange(current) {
        this.paginationdata.setPage(current)
        this.$emit('change', 'page', current)
      },
      sizeChange(current, size) {
        this.paginationdata.setSize({
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
