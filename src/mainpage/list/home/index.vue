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
.demoList{
  background-color: #ccc;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  .demoItem{
    width: 100px;
    margin-right: 10px;
    height: 30px;
    line-height: 30px;
  }
}

</style>
<template>
  <div class="mainpage" >
    <a-button @click="onBuild">创建</a-button>
    <div class="mainpagein">
      <a-spin :spinning="loadStatus == 'loading'">
        <!-- <div class="demoList" v-line="30">
          <div class="demoItem" v-for="val of 10" :key="val">{{ val }}</div>
        </div> -->
        <LocalModAutoMenu :height="30">
          <div class="demoList">
            <div class="demoItem" v-for="val of 9" :key="val">{{ val }}</div>
          </div>
        </LocalModAutoMenu>
        <LocalFormView
          v-if="maindata.searchData.show"
          :form="maindata.searchData.form.build.form"
          :mainlist="maindata.searchData.form.build.mainlist"
          :layout="'inline'"
          :type="'build'"
          :footMenu="maindata.searchData.menu"
          @menu="onSearchMenu"
        ></LocalFormView>
        <LocalTableView :maindata="maindata" :columnList="mainlist" >
          <template slot="_index" slot-scope="slotProps">
            <LocalModAutoIndex :index="slotProps.index" :maindata="maindata" :style="{ color: 'red' }" />
          </template>
          <span slot="name-title" >
            <span>自定义标题</span>
          </span>
          <template slot="button" slot-scope="slotProps">
            <span class="menulist" @click="onMenuChange(slotProps)">
              <a>修改</a>
            </span>
          </template>
        </LocalTableView>
      </a-spin>
    </div>
    <DefaultEdit
      :maindata="maindata"
      :title="menu.main.title"
      :show.sync="menu.main.show"
      :edit="menu.main.edit"
      :type="menu.main.type"
      :data="menu.main.data"
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
          type: 'build',
          edit: 'build',
          title: '创建',
          index: 0,
          data: null
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
    onSearchMenu(act) {
      if (act == 'search') {
        this.onDefaultMenuBySearch()
      } else if (act == 'reset') {
        this.onDefaultMenuByReset()
      }
    },
    onDefaultMenuBySearch() {
      this.maindata.setSearch()
      this.maindata.reloadData(true, {
        from: 'search',
        act: 'set'
      }, true)
    },
    onDefaultMenuByReset() {
      this.maindata.resetSearch()
      this.maindata.reloadData(true, {
        from: 'search',
        act: 'reset'
      }, true)
    },
    buildMainList () {
      this.mainlist = this.maindata.getDictionaryPageList('list')
    },
    setMenu(prop, type, edit, title, index, data) {
      this.menu[prop].type = type
      this.menu[prop].edit = edit
      this.menu[prop].title = title
      this.menu[prop].index = index
      this.menu[prop].data = null
      this.menu[prop].data = data
      this.menu[prop].show = true
    },
    onMenuChange({ record, index }) {
      this.setMenu('main', 'edit', 'change', '修改', index, record)
    },
    onBuild() {
      this.setMenu('main', 'build', 'build', '创建', 0, null)
    }
  }
}
</script>
