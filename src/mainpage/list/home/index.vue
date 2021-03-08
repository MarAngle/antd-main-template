<style lang='less' scoped>
.mainpage{
  background-color: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20px 20px 20px 20px;
  border-radius: 4px;
  .mainpagein{
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
.headmenulist{
  display: flex;
  justify-content: flex-start;
  padding-bottom: 18px;
}
.menulist a{
  padding-right: 10px;
  &:last-child{
    padding-right: 0;
  }
}
</style>
<template>
  <div class="mainpage" >
    <a-button @click="onBuild">创建</a-button>
    <div class="mainpagein">
      <a-spin :spinning="loadStatus == 'loading'">
        <LocalTableList :maindata="maindata" :columnList="mainlist" >
          <template slot="_index" slot-scope="slotProps">
            <span class="menulist">
              <a>{{ CountIndex(slotProps.index) }}</a>
            </span>
          </template>
        </LocalTableList>
      </a-spin>
    </div>
    <DefaultEdit
      :maindata="maindata"
      :title="menu.main.title"
      :show.sync="menu.main.show"
      :edit="menu.main.edit"
      :type="menu.main.type"
      :index="menu.main.index"
    />
  </div>
</template>

<script>
import maindata from './../maindata'
import DefaultEdit from './mod/DefaultEdit'

export default {
  name: `main${maindata.prop}list`,
  components: {
    DefaultEdit
  },
  data () {
    return {
      initType: true,
      maindata: maindata,
      mainlist: [],
      menu: {
        main: {
          show: false,
          index: 0,
          type: 'build',
          edit: 'build',
          title: '创建'
        }
      }
    }
  },
  computed: {
    loadStatus () { // 数据加载判断值 'unload' 'loading' 'loaded'
      let loadStatus = this.maindata.getStatus('load')
      return loadStatus.value
    },
    operateStatus () { // 操作判断值 operating operated
      let operateStatus = this.maindata.getStatus()
      return operateStatus.value
    }
  },
  mounted () {
    this.pageLoad()
  },
  methods: {
    pageLoad () {
      this.buildMainList()
      this.maindata.loadData(this.initType).then(res => {}, res => {
        console.error(res)
      })
    },
    CountIndex (index, countpage) {
      let num = index + 1
      if (countpage) {
        num = num + (this.maindata.getPageData('page') - 1) * this.maindata.getPageData('size')
      }
      return num
    },
    buildMainList () {
      this.mainlist = this.maindata.getDictionaryPageList('list')
    },
    onBuild() {
      this.menu.main.show = true
    }
  }
}
</script>
