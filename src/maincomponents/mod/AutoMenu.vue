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
    P{
      margin: 0;
      .icon{
        margin-right: 5px;
      }
    }
  }
}
</style>
<template>
  <div ref="mainContent" class="AutoMenu" :class="{ menuShow: menu.show }" :style="{ height: !menu.show ? 'auto' : menu.open ? 'auto' : height + 'px' }">
    <slot ref="content"></slot>
    <div v-show="menu.show" class="menu" :style="{ height: height + 'px', lineHeight: height + 'px' }" @click="toggleOpen" >
      <div>
        <p>
          <a-icon class="icon" :type="menu.open ? 'up' : 'down' " />
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
      page: this._func.page,
      menu: {
        show: false,
        open: false
      }
    }
  },
  watch: {
    'page.recount.main': function() {
      this.checkHeight('resize')
    }
  },
  mounted() {
    // 重要，antd的布局在第一次加载时可能存在宽度的判断错误，如同左侧菜单栏不存在时的宽度一样，避免问题加载2次后在进行判断
    this.$nextTick(() => {
      this.checkHeight('mounted')
    })
  },
  methods: {
    checkHeight(from) {
      this.menu.show = false
      this.$nextTick(() => {
        let currentHeight = this.$refs.mainContent.clientHeight
        if (currentHeight > this.height) {
          this.menu.show = true
        }
      })
    },
    toggleOpen() {
      this.menu.open = !this.menu.open
    }
  }
}
</script>
