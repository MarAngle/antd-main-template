<style scoped>
.AutoText{
  width: 100%;
  margin: 0;
  word-wrap: break-word;
  word-break: break-all;
}
.auto{
  display: inline-block;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
<template>
  <p ref="main" class="AutoText auto" >
    <a-tooltip v-bind="tipOption" >
      <span ref="size" class="content" >{{ text }}</span>
    </a-tooltip>
  </p>
</template>

<script>

export default {
  name: 'AutoText',
  data () {
    return {
      page: this._func.page,
      isEllipsis: false
    }
  },
  computed: {
    tipOption () {
      let option
      if (this.isEllipsis) {
        if (typeof this.tip == 'object') {
          option = this.tip
        } else {
          option = {
            placement: this.tip || 'top'
          }
        }
        if (!option.title) {
          option.title = this.text
        }
      } else {
        option = {}
      }
      return option
    }
  },
  props: {
    text: {
      required: false,
      default: ''
    },
    auto: {
      type: Boolean,
      required: false,
      default: false
    },
    tip: {
      type: [String, Object],
      required: false
    }
  },
  watch: {
    text: function() {
      this.autoWidth()
    },
    'page.recount.main': function() {
      this.autoWidth()
    }
  },
  mounted () {
    this.autoWidth()
  },
  methods: {
    autoWidth() {
      this.$nextTick(() => {
        let mainWidth = this.$refs['main'].offsetWidth
        let currentWith = this.$refs['size'].offsetWidth
        if (mainWidth < currentWith) {
          this.isEllipsis = true
        } else {
          this.isEllipsis = false
        }
      })
    }
  }
}
</script>
