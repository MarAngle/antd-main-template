<style scoped>
.AutoText{
  width: 100%;
  margin: 0;
  padding: 0;
  word-wrap: break-word;
  word-break: break-all;
}
.content{
  width: 100%;
}
.auto{
  /* display: inline-block; */
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
<template>
  <p ref="AutoText" class="AutoText auto" >
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
      isEllipsis: false,
      nowrapWidth: 'auto'
    }
  },
  computed: {
    tipOption () {
      let option
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
      return option
    }
  },
  props: {
    text: {
      type: [String, Number, Object, Array],
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
  mounted () {
    this.$nextTick(() => {
      this.autoWidth()
    })
  },
  methods: {
    autoWidth () {
      console.log(this.$refs['AutoText'].clientWidth, this.text)
    }
  }
}
</script>
