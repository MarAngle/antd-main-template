import _func from '@/maindata/func/index'
import { ListData, SelectList } from '@/mainbuild/index'

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
        prop: '_index',
        name: 'NO',
        originprop: '_index',
        originfrom: 'local',
        mod: {
          list: {
            width: 70
          }
        }
      },
      {
        prop: 'name',
        name: '名称',
        originprop: 'name',
        mod: {
          list: {
            width: 120
          },
          info: {},
          edit: {
            type: 'input',
            required: true,
            option: {
              type: 'text',
              innerWidth: '100px'
            },
            on: {
              change(value, { formData }) {
                console.log(value)
                formData.file = undefined
              }
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
        prop: 'age',
        name: '年龄',
        originprop: 'age',
        mod: {
          list: {
            width: 120
          },
          info: {},
          edit: {
            type: 'inputNumber',
            required: true,
            option: {
              min: 0,
              max: 200
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
        prop: 'area',
        showprop: {
          default: 'label',
          build: 'value',
          change: 'value'
        },
        name: '区域',
        originprop: 'area',
        func: {
          format: function (data) {
            return areaSelect.getItem(data)
          }
        },
        mod: {
          list: {
            width: 120
          },
          info: {},
          edit: {
            type: 'select',
            required: true,
            option: {
              list: areaSelect.getList()
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
        prop: 'selectSearch',
        name: '检索下拉',
        originprop: 'selectSearch',
        mod: {
          info: {},
          edit: {
            type: 'select',
            required: true,
            tips: '这里是提示！',
            option: {
              search: true,
              list: []
            },
            pagination: true,
            methods: {
              getData(value) {
                return new Promise((resolve, reject) => {
                  let pageCurrent = this.pagination.getPage()
                  let pageSizeCurrent = this.pagination.getSize()
                  let list = []
                  for (let n = pageCurrent * pageSizeCurrent; n < (pageCurrent + 1) * pageSizeCurrent; n++) {
                    let item = {
                      value: `page${pageCurrent}size${pageSizeCurrent}id${n}value${value}`,
                      label: `page${pageCurrent}size${pageSizeCurrent}id${n}label${value}`
                    }
                    list.push(item)
                  }
                  this.option.list = []
                  this.option.list = list
                  this.pagination.setTotal(100)
                  resolve()
                })
              }
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
        prop: 'file',
        name: '文件',
        originprop: 'file',
        mod: {
          list: {
            width: 150
          },
          build: {
            type: 'file',
            required: true,
            option: {
              upload: true,
              fileUpload: function ({ file }) {
                return new Promise((resolve) => {
                  resolve({
                    id: 1,
                    url: '',
                    data: 'url' + file.name,
                    name: file.name
                  })
                })
              }
            }
          }
        }
      },
      {
        prop: 'outSlot',
        name: 'INPUT插槽',
        originprop: 'outSlot',
        mod: {
          list: {
            width: 120
          },
          build: {
            type: 'input',
            required: true,
            option: {
              maxLength: 2,
              slot: 'model'
            }
          }
        }
      },
      {
        prop: 'switch',
        name: '开关',
        originprop: 'switch',
        mod: {
          list: {
            width: 150
          },
          info: {},
          edit: {
            type: 'switch',
            required: false
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
        prop: 'date',
        name: '日期',
        originprop: 'date',
        mod: {
          list: {
            width: 120
          },
          info: {},
          edit: {
            type: 'date',
            required: false,
            option: {
              showTime: true,
              disabledDate: {
                start: '2021-03-01 10:00:00',
                end: 'current'
              }
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
        prop: 'dateRange',
        name: '日期范围',
        originprop: 'dateRange',
        mod: {
          list: {
            width: 120
          },
          edit: {
            type: 'dateRange',
            required: false,
            option: {
              showTime: true,
              innerWidth: '100%',
              disabledDate: {
                start: '2021-03-01 10:00:00',
                end: 'current'
              }
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
        prop: 'button',
        name: '按钮',
        originprop: 'button',
        mod: {
          list: {
            width: 120
          },
          build: {
            type: 'button',
            required: false,
            option: {
              name: '按钮'
            }
          }
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
          url: preurl + '/list/getdata',
          params: postdata
        }).then(res => {
          this.formatData(res.data.data, res.data.totalCount)
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
    // dictionaryListUpdated: function (...args) {
    //   console.log('dictionaryListUpdated', ...args)
    // },
    // created: function (target) {
    //   console.log('created', target)
    // },
    // BaseDataCreated: function (target) {
    //   console.log('BaseDataCreated', target)
    // },
    // ComplexDataCreated: function (target) {
    //   console.log('ComplexDataCreated', target)
    // }
  },
  pagination: true
})

maindata.onLife('loaded', {
  immediate: true,
  data: () => {
    console.log('loaded')
  }
})

maindata.watchName = '111'

_func.watchObjectProp({
  data: maindata,
  prop: 'watchName',
  func: function(v, o) {
    console.log(v, o)
  }
})

maindata.data.newList = []

_func.watchObjectProp({
  data: maindata.data,
  prop: 'newList',
  func: function(v, o) {
    console.log(v, o)
  }
})

maindata.triggerMethod(function() {
  return new Promise((resolve, reject) => {
    resolve({ name: 1 })
  })
})

export default maindata
