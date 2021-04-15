<style lang='less' scoped>

</style>
<template>
  <div class="mainpage" >
    <InstrcutionView :data="maindata" :type="'build'" />
  </div>
</template>

<script>
import { ComplexData } from '@/mainbuild/index'
import InstrcutionView from '@/mainbuild/components/InstrcutionView'
let maindata = ComplexData.getInstrcution('build')

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
