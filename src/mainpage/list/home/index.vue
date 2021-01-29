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
    <div class="mainpagein">
      <a-spin :spinning="loadStatus == 'loading'">
        <!-- <LocalFormViewModel
          v-if="maindata.searchdata.show"
          :layout="'inline'"
          :form="maindata.searchdata.mod.edit.form"
          :mainlist="maindata.searchdata.mainlist"
          :menudata="searchmenu"
          @button="onSearchMenu"
        >
          <template slot="menu_requestTimes">
            <span class="menulist">
              <span>密钥请求总次数：</span>
              <span class="hightext">{{ maindata.data.requestTimes }}次</span>
            </span>
          </template>
        </LocalFormViewModel> -->
        <LocalTableList :maindata="maindata" :columnList="mainlist" @onPage="onPage" >
          <template slot="_index" slot-scope="slotProps">
            <span class="menulist">
              <a>{{ CountIndex(slotProps.index) }}</a>
            </span>
          </template>
          <template slot="menu" slot-scope="slotProps">
            <span class="menulist">
              <a @click="onDefaultMenuByInfo(slotProps)">查看</a>
            </span>
          </template>
        </LocalTableList>
        <!-- 弹窗区域 -->
      </a-spin>
    </div>
  </div>
</template>

<script>
import maindata from './../maindata'

export default {
  name: `main${maindata.prop}list`,
  data () {
    return {
      initType: true,
      maindata: maindata,
      modlist: maindata.getModList('list'),
      mainlist: [],
      menu: {
        main: {
          num: 0,
          index: 0,
          type: 'build',
          edit: 'build',
          title: '创建'
        },
        info: {
          num: 0,
          index: 0
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
    },
    searchmenu () {
      let list = [
        {
          type: 'default',
          icon: 'download',
          name: '请求次数',
          act: 'requestTimes'
        }
      ]
      list = list.concat(this.maindata.searchdata.menu)
      let nextlist = [
        {
          type: 'primary',
          icon: 'plus',
          name: '新建',
          act: 'build'
        },
        {
          type: 'default',
          icon: 'download',
          name: '导出',
          act: 'export'
        }
      ]
      list = list.concat(nextlist)
      for (let n in list) {
        let item = list[n]
        item.loading = this.operateStatus == 'operating'
      }
      return list
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
      this.mainlist = this.maindata.getPageList('list', this.modlist)
    },
    onSearchMenu (act, data) {
      if (act == 'search') {
        this.onDefaultMenuBySearch()
      } else if (act == 'reset') {
        this.onDefaultMenuByReset()
      } else if (act == 'build') {
        this.onDefaultMenuByBuild()
      } else if (act == 'export') {
        this.maindata.triggerTargetMethod('onExport').then(res => {
          this._func.downloadFile(res.url)
        }, res => {})
      }
    },
    onDefaultMenuBySearch () {
      this.maindata.setSearch()
      this.maindata.reloadData(true)
    },
    onDefaultMenuByReset () {
      this.maindata.resetSearch()
      this.maindata.reloadData(true)
    },
    onDefaultMenuByBuild () {
      this.onEditMenu('build', 'build', 0, '新建' + this.maindata.name)
    },
    onEditMenu (type, edit, index, title) {
      this.menu.main.type = type
      this.menu.main.edit = edit
      this.menu.main.index = index
      this.menu.main.title = title
      this.menu.main.num++
    },
    onDefaultMenuByChange (data) {
      this.maindata.triggerGetInfo(data.index).then(res => {
        this.onEditMenu('change', 'change', data.index, '编辑' + this.maindata.name)
      }, res => {
        this._func.showmsg(res.message || '详情数据拉取失败', 'error')
      })
    },
    onDefaultMenuByInfo (data) {
      this.maindata.triggerGetInfo(data.index).then(res => {
        this.menu.info.index = data.index
        this.menu.info.num++
      }, res => {
        console.error(res)
        this._func.showmsg(res.message || '详情数据拉取失败', 'error')
      })
    },
    onDefaultMenuByDel (data) {
      this._func.alert('确认删除？', false, (act) => {
        if (act == 'ok') {
          this.maindata.delItem(data.index).then(res => {
            this._func.showmsg('删除成功', 'success')
          }, res => {
            console.error(res)
            this._func.showmsg(res.message || '删除失败', 'error')
          })
        }
      })
    },
    onPage () { // 数据再tabellist中已经重新拉取
    },
    editCallback (postdata, type, index) {
      return new Promise((resolve, reject) => {
        if (type == 'change') {
          this.maindata.triggerChangeItem(postdata, index).then(res => {
            resolve(res)
          }, res => {
            reject(res)
          })
        } else if (type == 'build') {
          this.maindata.triggerBuildItem(postdata).then(res => {
            resolve(res)
          }, res => {
            reject(res)
          })
        }
      })
    }
  }
}
</script>
