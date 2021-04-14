<style lang='less' scoped>

</style>
<template>
  <div class="mainpage" >
    {{ maindata }}
    <InstrcutionView :data="maindata" />
  </div>
</template>

<script>
import { BaseData } from '@/mainbuild/index'
import InstrcutionView from '@/mainbuild/components/InstrcutionView'
let maindata = BaseData.getInstrcution('data')

console.log(maindata)

export default {
  name: `mainlist`,
  components: {
    InstrcutionView
  },
  data () {
    return {
      maindata: maindata
    }
  },
  mounted () {
    this.pageLoad()
  },
  methods: {
    pageLoad () {
    }
  }
}
</script>
