import _func from 'complex-func'
import { ListData, SelectList, SelectData } from 'complex-data'

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
            width: 70,
            fixed: 'left'
          }
        }
      },
      {
        prop: 'name',
        name: '名称(字符串)',
        originprop: 'name',
        func: {
          format(data) {
            return data + '1111111111111111111111111111111111111'
          }
        },
        mod: {
          list: {
            width: 160
          },
          info: {},
          edit: {
            type: 'input',
            required: true,
            option: {
              type: 'text',
              width: '100px'
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
        name: '年龄(数字)',
        originprop: 'age',
        mod: {
          list: {
            width: 140
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
        prop: 'switch',
        name: '开关(SWITCH)',
        originprop: 'switch',
        mod: {
          list: {
            width: '',
            scrollWidth: 60
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
        prop: 'complex',
        showprop: 'name',
        // showprop: 'name.localinname',
        name: '字典递归(对象)',
        originprop: 'complex',
        dictionary: {
          list: [
            {
              prop: 'name',
              name: 'complex-name',
              originprop: 'name',
              mod: {},
              dictionary: {
                list: [
                  {
                    prop: 'localinname',
                    name: 'complex-name-inname',
                    originprop: 'inname',
                    mod: {}
                  },
                  {
                    prop: 'localincode',
                    name: 'complex-name-incode',
                    originprop: 'incode',
                    mod: {}
                  }
                ]
              }
            }
          ]
        },
        mod: {
          list: {
            width: '',
            scrollWidth: 120
          },
          info: {}
        }
      },
      {
        prop: 'area',
        showprop: {
          default: 'label',
          build: 'value',
          change: 'value'
        },
        name: '区域(对象:选择器)',
        originprop: 'area',
        func: {
          format: function (data) {
            return areaSelect.getItem(data)
          }
        },
        mod: {
          list: {
            width: 160
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
        name: '(检索下拉:分页)',
        originprop: 'selectSearch',
        func: {
          edit() {
            return '10'
          }
        },
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
                  setTimeout(() => {
                    let pageCurrent = this.pagination.getPage()
                    let pageSizeCurrent = this.pagination.getSize()
                    let list = []
                    for (let n = pageCurrent * pageSizeCurrent; n < (pageCurrent + 1) * pageSizeCurrent; n++) {
                      let item = {
                        value: `${n}`,
                        label: `page${pageCurrent}size${pageSizeCurrent}id${n}label${value}`
                      }
                      list.push(item)
                    }
                    this.option.list = []
                    this.option.list = list
                    this.pagination.setTotal(100)
                    resolve()
                  }, 3000)
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
        name: '文件(UPLOAD)',
        originprop: 'file',
        mod: {
          list: {
            width: 150
          },
          build: {
            type: 'file',
            required: true,
            option: {
              upload: false,
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
        name: 'INPUT(V-MODEL插槽)',
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
        prop: 'date',
        name: '(日期)',
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
        name: '(日期范围)',
        originprop: 'dateRange',
        mod: {
          list: {
            width: 120
          },
          edit: {
            type: 'dateRange',
            required: false,
            on: {
              change(...args) {
                console.log(...args)
              }
            },
            option: {
              showTime: true,
              limit: {
                type: 'sec',
                num: 5 * 24 * 60 * 60,
                msg: '时间间隔最大为5天！'
              },
              disabledDate: {
                start: '2021-06-01 10:00:00',
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
        name: '(按钮)',
        originprop: 'button',
        mod: {
          list: {
            width: 120,
            fixed: 'right'
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
  update: {
    offset: 2000,
    methods: {
      trigger(next, num) {
        console.log(num)
        maindata.loadData(true).then(() => {
          if (num >= 3) {
            next(false)
          } else {
            next()
          }
        }, () => {
          next()
        })
      }
    }
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
          prop: 'companyName',
          name: '企业名称',
          originprop: 'companyName',
          mod: {
            info: {},
            edit: {
              type: 'input',
              required: true,
              width: '160px',
              option: {
                type: 'text'
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
          prop: 'name',
          name: '名称',
          originprop: 'name',
          mod: {
            info: {},
            edit: {
              type: 'input',
              required: true,
              width: '160px',
              option: {
                type: 'text'
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
              width: '160px',
              required: true,
              option: {
                type: 'text'
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
          prop: 'cascader',
          name: 'cascader',
          originprop: 'cascader',
          mod: {
            info: {},
            edit: {
              type: 'cascader',
              width: '160px',
              required: true,
              option: {
                options: [],
                // changeOnSelect: true,
                loadData: function(selectedOptions) {
                  const targetOption = selectedOptions[selectedOptions.length - 1]
                  targetOption.loading = true;
                  setTimeout(() => {
                    targetOption.loading = false
                    targetOption.children = [
                      {
                        label: `${targetOption.label} Dynamic 1`,
                        value: 'dynamic1'
                      },
                      {
                        label: `${targetOption.label} Dynamic 2`,
                        value: 'dynamic2'
                      }
                    ]
                    this.option.options = [...this.option.options]
                  }, 1000);
                }
              },
              on: {
              },
              methods: {
                getData(value) {
                  return new Promise((resolve) => {
                    this.option.options = [
                      {
                        value: 'zhejiang',
                        label: 'Zhejiang',
                        isLeaf: false
                      },
                      {
                        value: 'jiangsu',
                        label: 'Jiangsu',
                        isLeaf: false
                      }
                    ]
                    resolve()
                  })
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
    // BaseDataBeforeCreate: function (target, initdata) {
    //   console.log('BaseDataBeforeCreate', target, initdata)
    // },
    // BaseDataCreated: function (target) {
    //   console.log('BaseDataCreated', target)
    // }
    // ComplexDataCreated: function (target) {
    //   console.log('ComplexDataCreated', target)
    // }
  },
  pagination: true
})

export default maindata
