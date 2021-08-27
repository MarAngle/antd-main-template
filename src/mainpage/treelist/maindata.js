import _func from 'complex-func'
import { ListData, SelectList } from 'complex-data'

let preurl = 'http://$local'

let areaSelect = new SelectList({
  name: '区域',
  list: [
    {
      value: 1,
      label: '开发区',
      filter: 'a'
    },
    {
      value: 2,
      label: '东港区',
      filter: 'a'
    },
    {
      value: 3,
      label: '新市区',
      filter: 'b'
    }
  ]
})

console.log(areaSelect.getList('a'))

let maindata = new ListData({
  name: '终端信息管理',
  prop: 'terminalinfolist',
  option: {
  },
  choice: {
    show: true,
    reset: {
      page: {
        page: true
      }
    }
  },
  dictionary: {
    layout: {
      default: {
        label: 6,
        content: 18
      }
    },
    id: {
      prop: 'id',
      data: ''
    },
    list: [
      {
        prop: 'id',
        name: '终端ID',
        originprop: 'id',
        mod: {
          info: {}
        }
      },
      {
        prop: 'name',
        name: '名称',
        originprop: 'name',
        mod: {
          list: {
            width: 120,
            autoText: false,
            align: 'left'
          },
          info: {},
          edit: {
            type: 'input',
            required: true,
            option: {
              type: 'text',
              innerWidth: '100px'
            }
          },
          build: {
            type: 'edit'
          },
          change: {
            type: 'edit'
          }
        }
      },
      {
        prop: 'extra',
        name: 'E名称',
        originprop: 'name',
        mod: {
          list: {
            width: 'auto'
          },
          info: {},
          edit: {
            type: 'input',
            required: true,
            option: {
              type: 'text',
              innerWidth: '100px'
            }
          },
          build: {
            type: 'edit'
          },
          change: {
            type: 'edit'
          }
        }
      },
      {
        prop: 'children',
        name: 'children',
        originprop: 'children',
        mod: {
        }
      }
    ]
  },
  methods: {
    getData: function () {
      return new Promise((resolve, reject) => {
        let postdata = this.getSearch()
        postdata.pageSize = this.getPageData('size')
        postdata.pageNo = this.getPageData('page')
        _func.get({
          url: preurl + '/tree/getdata',
          params: postdata
        }).then(res => {
          this.formatData(res.data.data, res.data.totalCount)
          console.log(this.data.list)
          resolve(res)
        }, res => {
          reject(res)
        })
      })
    }
  },
  search: {
    dictionary: {
      list: [
        {
          prop: 'name',
          name: '名称',
          originprop: 'name',
          mod: {
            info: {},
            edit: {
              type: 'input',
              required: true,
              option: {
                type: 'text',
                innerWidth: '160px'
              },
              on: {
                change(value) {
                  console.log(value)
                }
              }
            },
            build: {
              type: 'edit'
            }
          }
        },
        {
          prop: 'id',
          name: 'ID',
          originprop: 'id',
          mod: {
            info: {},
            edit: {
              type: 'input',
              required: true,
              option: {
                type: 'text',
                innerWidth: '160px'
              },
              on: {
                change(value) {
                  console.log(value)
                }
              }
            },
            build: {
              type: 'edit'
            }
          }
        }
      ]
    }
  },
  extradata: {},
  life: {
    // created: function(target) {
    //   console.log('created', target)
    // },
    // BaseDataCreated: function(target) {
    //   console.log('BaseDataCreated', target)
    // },
    // ComplexDataCreated: function(target) {
    //   console.log('ComplexDataCreated', target)
    // }
  },
  pagination: true
})

// maindata.onLife('created', () => {})

// console.log(maindata.data)

export default maindata
