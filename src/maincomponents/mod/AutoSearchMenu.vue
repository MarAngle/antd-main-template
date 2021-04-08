<style lang='less' scoped>
.AutoSearchMenu{
  margin-top: 24px;
  /deep/.ant-form-inline{
    .ant-form-item{
      margin-bottom: 24px;
      &.ant-form-item-with-help{
        min-height: auto;
        margin-bottom: 0;
      }
    }
  }
}
</style>
<template>
  <AutoMenu v-bind="$attrs" v-on="$listeners" class="AutoSearchMenu">
    <slot ref="content"></slot>
  </AutoMenu>
</template>

<script>
import AutoMenu from './AutoMenu'

export default {
  name: 'AutoSearchMenu',
  components: {
    AutoMenu
  }
}
</script>
