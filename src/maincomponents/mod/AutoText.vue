<style scoped>
p{
  margin: 0;
  padding: 0;
  word-wrap: break-word;
  word-break: break-all;
}
.nowarpContent{
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
<template>
  <div ref="AutoText" class="AutoText" >
    <p ref="size" class="sizeContent nowarpContent" >{{ text }}</p>
  </div>
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
  },
  props: {
    text: {
      type: [ String, Number, Object, Array ],
      required: false,
      default: ''
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
      // 观察器的配置（需要观察什么变动）
      const config = { attributes: true, characterData: true, subtree: true }
      // 当观察到变动时执行的回调函数
      const callback = function (mutationsList, observer) {
        console.log(mutationsList, observer)
      }
      // 创建一个观察器实例并传入回调函数
      this.observer = new MutationObserver(callback)
      // 以上述配置开始观察目标节点
      this.observer.observe(this.$refs['size'], config)
    }
  },
  beforeDestroy () {
    // 停止观测
    this.observer.disconnect()
    this.observer = null
  }
}
</script>
