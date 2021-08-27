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
    <a-button @click="onchange">创建</a-button>
    <div class="mainpagein">
      <a-spin :spinning="loadStatus == 'loading'">
        <ComplexFormView
          v-if="maindata.getSearchInit()"
          :form="maindata.getModule('search').form.build.form"
          :mainlist="maindata.getModule('search').form.build.mainlist"
          :layout="'inline'"
          :type="'build'"
          :footMenu="maindata.getModule('search').menu"
          @menu="onSearchMenu"
        ></ComplexFormView>
        <ComplexInfoView :maindata="maindata" type="info" :data="maindata.data.current" ></ComplexInfoView>
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
  name: `main${maindata.prop}info`,
  components: {
    DefaultEdit
  },
  data () {
    return {
      initType: true,
      maindata: maindata,
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
    onDemo(data) {
      console.log(data)
    },
    pageLoad () {
      this.maindata.onLife('buildCancel', {
        index: 0,
        data: () => {
          this.menu.main.title = '生命周期回调'
        }
      })
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
      this.maindata.reloadData({
        sync: true,
        page: true,
        choice: {
          from: 'search',
          act: 'set'
        }
      })
    },
    onDefaultMenuByReset() {
      this.maindata.resetSearch()
      this.maindata.reloadData({
        sync: true,
        page: true,
        choice: {
          from: 'search',
          act: 'reset'
        }
      })
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
    onchange() {
      // this.maindata.reset()
      this.setMenu('main', 'edit', 'change', '修改', 0, this.maindata.data.current)
    }
  }
}
</script>
