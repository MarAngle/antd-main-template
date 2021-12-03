import _func from 'complex-func'
import { ListData } from './../../MainPlugin/complex-data-next/index'

let maindata = new ListData({
  module: {
    status: true,
    promise: true,
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
          originProp: 'id',
          mod: {
            info: {}
          }
        },
        {
          prop: '_index',
          name: 'NO',
          originProp: '_index',
          originFrom: 'local',
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
          originProp: 'name',
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
          originProp: 'age',
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
          originProp: 'switch',
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
          originProp: 'complex',
          dictionary: {
            list: [
              {
                prop: 'name',
                name: 'complex-name',
                originProp: 'name',
                mod: {
                  list: {
                    childrenTree: true
                  }
                },
                dictionary: {
                  list: [
                    {
                      prop: 'localinname',
                      name: 'complex-name-inname',
                      originProp: 'inname',
                      mod: {
                        list: {}
                      }
                    },
                    {
                      prop: 'localincode',
                      name: 'complex-name-incode',
                      originProp: 'incode',
                      mod: {
                        list: {}
                      }
                    }
                  ]
                }
              }
            ]
          },
          mod: {
            list: {
              width: 400,
              childrenTree: true
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
          originProp: 'area',
          func: {
            format: function (data) {
              return {
                value: data,
                label: data + 'label'
              }
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
          originProp: 'selectSearch',
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
          originProp: 'file',
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
          originProp: 'outSlot',
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
          originProp: 'date',
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
          originProp: 'dateRange',
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
          originProp: 'button',
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
    }
  }
})

export default maindata
