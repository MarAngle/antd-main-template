<style lang='less' scoped>

</style>
<template>
  <div
    class="mainpagination"
  >
    <a-pagination v-bind="paginationOption.props" v-on="paginationOption.on" />
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
      option: {
        type: Object,
        required: false,
        default: null
      }
    },
    computed: {
      paginationOption() {
        let paginationOption = this.data.getOption()
        if (this.option) {
          for (let n in this.option) {
            if (!paginationOption[n]) {
              paginationOption[n] = {}
            }
            paginationOption[n] = {
              ...paginationOption[n],
              ...this.option[n]
            }
          }
        }
        paginationOption.props.current = this.data.data.page.current
        paginationOption.props.pageSize = this.data.data.size.current
        paginationOption.props.pageSizeOptions = this.data.data.size.list
        paginationOption.props.total = this.data.data.num.total
        return paginationOption
      }
    },
    methods: {
    }
  }
</script>
