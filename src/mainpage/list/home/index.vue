<style lang='less' scoped>
.mainpage{
  background-color: #fff;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 20px 20px 20px 20px;
  border-radius: 4px;
  .mainpagein{
    width: 100%;
    height: auto;
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
    box-sizing: border-box;
    width: 100px;
    margin-right: 10px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px #eee solid;
  }
  margin-bottom: 10px;
}

</style>
<template>
  <div class="mainpage" >
    <div style="width: 100px">
      <ComplexModAutoTextHeight :auto="true" :text="'1222222122222212222221222222'" />
    </div>
    <a-button @click="onBuild">创建</a-button>
    <a-button @click="onReset">reset</a-button>
    <div class="mainpagein">
      <a-spin :spinning="loadStatus == 'loading'">
        <ComplexModAutoMenu style="margin-top: 19px;" :height="59" :defaultOpen="true" :auto="{ menu: { style: { lineHeight: '40px' } } }" >
          <ComplexFormView
            v-if="maindata.getSearchInit()"
            :class="{ local: true }"
            :form="maindata.getModule('search').form.build.form"
            :mainlist="maindata.getModule('search').form.build.mainlist"
            :layout="'inline'"
            :type="'build'"
            :footMenu="maindata.getModule('search').menu"
            :auto="{
              foot: {
                loading: operateStatus == 'operating'
              }
            }"
            @menu="onSearchMenu"
          ></ComplexFormView>
          <div slot="menu" slot-scope="slotScope">
            <p>
              <a-icon class="complex-auto-menu-main-icon" type="up" />
              <span>{{ slotScope.open ? 1 : 2 }}</span>
            </p>
          </div>
        </ComplexModAutoMenu>
        <ComplexTableView
          :class="'local-table'"
          :maindata="maindata"
          :columnList="mainlist"
          :scrollOption="{
            recount: _func.page.recount.main,
            width: 'auto'
          }"
          :auto="{
            pagination: {
              default: {
                type: 'choice',
                option: {
                  menu: true
                }
              }
            }
          }"
          :tableOption="{
            props: {
              expandedRowKeys: expandList,
              expandRowByClick: true
            },
            on: {
              expandedRowsChange: expandedRowsChange
            }
          }"
        >
          <span slot="name-title" >
            <span>自定义标题</span>
          </span>
          <template slot="button" slot-scope="slotProps">
            <span class="menulist" @click="onMenuChange(slotProps)">
              <a>修改</a>
            </span>
          </template>
          <!-- <template slot="pagination_default">
            <span style="padding-right: 10px;">
              已选择: {{ maindata.getChoiceData('id').length }}
            </span>
          </template> -->
          <template slot="expandedRowRender">
            <span style="padding-right: 10px;">
              额外展开行
            </span>
          </template>
        </ComplexTableView>
      </a-spin>
    </div>
    <ComplexModAutoModal
      :optionProps="{
        width: 600,
        destroyOnClose: true
      }"
      :auto="{
        ok: false
      }"
      :onEvent="onEditEvent"
      ref="edit"
    >
      <EditView slot-scope="slotScope" :maindata="maindata" :maxHeight="slotScope.height" ref="editView" />
    </ComplexModAutoModal>
  </div>
</template>

<script>
import maindata from './../maindata'
import EditView from './mod/EditView'

export default {
  name: `main${maindata.prop}list`,
  components: {
    EditView
  },
  data () {
    return {
      initType: true,
      maindata: maindata,
      mainlist: [],
      expandList: []
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
    expandedRowsChange(keys) {
      this.expandList = keys
    },
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
      this.buildMainList()
      this.maindata.loadData(this.initType).then(res => {
        // this.maindata.startUpdate()
        // this.maindata.triggerModuleMethod('update1', 'setaOffset')
        // setTimeout(() => {
        //   console.log('延时5s触发停止更新')
        //   this.maindata.clearUpdate()
        // }, 5000);
      }, res => {
        console.error(res)
      })
    },
    onSearchMenu(act) {
      console.log(act)
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
    buildMainList () {
      this.mainlist = this.maindata.getDictionaryPageList('list')
    },
    onBuild() {
      this.$refs.edit.show('新增项目')
      this.$nextTick(() => {
        this.$refs.editView.show('build', 'build', null)
      })
    },
    onMenuChange({ record }) {
      this.$refs.edit.show('编辑项目')
      this.$nextTick(() => {
        this.$refs.editView.show('change', 'change', record)
      })
    },
    onReset() {
      this.maindata.reset({
        // status: false,
        // data: {
        //   list: false
        // }
      })
      console.log(this.maindata)
    },
    onEditEvent(act) {
      if (act == 'ok') {
        this.$refs.editView.handle((promise) => {
          if (promise) {
            promise.then(res => {
              this.$refs.edit.hide()
            }, () => {})
          }
        })
      }
    }
  }
}
</script>
