<style lang='less' scoped>
.AutoMenu{
  &.menuShow{
    position: relative;
    padding-right: 100px;
    overflow: hidden;
  }
  .menu{
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    text-align: center;
  }
}
</style>
<template>
  <div ref="mainContent" class="AutoMenu" :class="{ menuShow: menu.show }" :style="{ height: !menu.show ? 'auto' : menu.open ? 'auto' : height + 'px' }">
    <slot ref="content"></slot>
    <div v-show="menu.show" class="menu" :style="{ height: height + 'px', lineHeight: height + 'px' }" @click="toggleOpen" >
      <div>
        <p>
          <a-icon :type="menu.open ? 'up' : 'down' " />
          <span>{{ menu.open ? '关闭' : '打开' }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AutoMenu',
  props: {
    height: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      menu: {
        show: false,
        open: false
      }
    }
  },
  mounted() {
    this.checkHeight('mounted')
  },
  methods: {
    checkHeight(from) {
      this.menu.show = false
      this.$nextTick(() => {
        let currentHeight = this.$refs.mainContent.clientHeight
        if (currentHeight > this.height) {
          this.menu.show = true
        }
        this.checkOpen()
        // this.menu.show = this.menu.show
      })
    },
    toggleOpen() {
      this.menu.open = !this.menu.open
    },
    checkOpen() {

    }
  }
}
</script>
