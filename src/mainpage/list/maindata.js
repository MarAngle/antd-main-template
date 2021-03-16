import _func from '@/maindata/func/index'
import { ListData } from '@/mainbuild/index'

let maindata = new ListData({
  name: '终端信息管理',
  prop: 'terminalinfolist',
  option: {
  },
  layout: {
    default: {
      main: 24,
      label: {
        span: 6
      },
      content: {
        span: 18
      }
    }
  },
  dictionary: {
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
        prop: 'terminalCode',
        name: '终端编号',
        originprop: 'terminalCode',
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
            rules: [
              {
                required: true,
                validator: function(rule, value, callback) {
                  console.log('rule', value)
                  if (value) {
                    callback()
                  } else {
                    callback(rule.message)
                  }
                }
              }
            ],
            on: {
              input(value) {
                console.log('input', value)
                // if (value) {
                //   form[item.prop] = undefined
                // }
              },
              change(value) {
                console.log('change', value)
                // if (value) {
                //   form[item.prop] = undefined
                // }
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
        prop: 'iccid',
        name: 'ICCID',
        originprop: 'iccid',
        mod: {
          list: {
            width: 180
          },
          info: {},
          edit: {
            type: 'select',
            required: true,
            tips: 'tips',
            rules: [
              {
                required: true,
                validator: function(rule, value, callback) {
                  console.log('rule', value)
                  if (value) {
                    callback()
                  } else {
                    callback(rule.message)
                  }
                }
              }
            ],
            option: {
              search: true,
              list: [
                {
                  value: '1',
                  label: '11'
                },
                {
                  value: '2',
                  label: '22'
                }
              ]
            },
            on: {
              change(value, a, { formData, prop }) {
                if (value) {
                  formData[prop] = undefined
                }
              },
              select(value) {
                console.log('s', value)
              },
              input(value) {
                console.log('i', value)
              }
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
        prop: 'vin',
        name: '绑定车辆VIN码',
        originprop: 'vin',
        mod: {
          list: {
            width: 150
          },
          build: {
            type: 'file',
            required: true,
            option: {
              upload: true,
              fileUpload: function(data) {
                return new Promise((resolve) => {
                  resolve({
                    id: 1,
                    url: 1,
                    data: 1,
                    name: 1
                  })
                })
              }
            }
          }
        }
      },
      {
        prop: 'requestTimes',
        name: '密钥请求次数',
        originprop: 'requestTimes',
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
        prop: 'afterBindRequestTimes',
        name: '车辆绑定后密钥请求次数',
        originprop: 'afterBindRequestTimes',
        mod: {
          list: {
            width: 180
          }
        }
      },
      {
        prop: 'publicKey',
        name: 'RSA公钥',
        originprop: 'publicKey',
        mod: {
          list: {
            width: 180
          },
          info: {}
        }
      },
      {
        prop: 'firmwareVersion',
        name: '当前固件版本号',
        label: {
          default: '当前固件版本号',
          build: '固件版本',
          change: '固件版本'
        },
        originprop: 'firmwareVersion',
        mod: {
          list: {
            width: 150
          },
          info: {},
          edit: {
            type: 'switch',
            required: false,
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
        prop: 'terminalModel',
        name: '终端型号',
        originprop: 'terminalModel',
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
              },
              disabledTime: function(date) {
                console.log(date)
              }
            },
            on: {
              change(value, a, { formData, prop }) {
                console.log(value, a, { formData, prop })
                if (value) {
                  formData[prop] = undefined
                }
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
        prop: 'terminalModelAuthState',
        name: '终端型号授权备案结果',
        originprop: 'terminalModelAuthState',
        mod: {
          // list: {
          //   width: 170
          // },
          info: {}
        }
      },
      {
        prop: 'terminalModelState',
        name: '终端型号备案结果',
        originprop: 'terminalModelState',
        mod: {
          // list: {
          //   width: 160
          // },
          info: {}
        }
      },
      {
        prop: 'chipCode',
        name: '安全芯片编号',
        label: {
          default: '安全芯片编号',
          build: '芯片编号',
          change: '芯片编号'
        },
        originprop: 'chipCode',
        mod: {
          list: {
            width: 120
          },
          edit: {
            type: 'dateRange',
            required: false,
            option: {
              showTime: true,
              disabledDate: {
                start: '2021-03-01 10:00:00',
                end: 'current'
              },
              disabledTime: function(date) {
                console.log(date)
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
        prop: 'chipModel',
        name: '安全芯片型号',
        label: {
          default: '安全芯片型号',
          build: '芯片型号',
          change: '芯片型号'
        },
        originprop: 'chipModel',
        mod: {
          list: {
            width: 120
          },
          info: {},
          edit: {
            type: 'input',
            required: false,
            option: {
              type: 'text',
              maxLength: 5
            },
            func: {
              change(a, b, v) {
                console.log(a, b, v)
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
        prop: 'chipModelState',
        name: '安全芯片型号备案结果',
        originprop: 'chipModelState',
        mod: {
          // list: {
          //   width: 170
          // },
          info: {}
        }
      },
      {
        prop: 'terminalFactoryOrgCode',
        name: '企业社会信用代码',
        originprop: 'terminalFactoryOrgCode',
        mod: {
          list: {
            width: 160
          },
          info: {}
        }
      },
      {
        prop: 'terminalFactoryName',
        name: '终端厂商名称',
        originprop: 'terminalFactoryName',
        mod: {
          list: {
            width: 120
          },
          info: {}
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
        postdata.agreement = 'GB17691'
        this.setExtra('lastPost', postdata)
        _func.get({
          url: 'vehicle/info/terminal/info/page',
          query: postdata,
          token: 'default'
        }).then(res => {
          this.formatData(res.data.data, res.data.totalCount)
          this.getRequestTimes(postdata).then(res => {
            resolve(res)
          }, res => {
            reject(res)
          })
        }, res => {
          reject(res)
        })
      })
    },
    buildItem: function ({ postdata, targetitem, index }) {
      return new Promise((resolve, reject) => {
        postdata.agreement = 'GB17691'
        _func.post({
          url: 'vehicle/info/terminal/info/create',
          data: postdata,
          token: 'default'
        }).then(res => {
          this.reloadData()
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    },
    getRequestTimes: function (postdata) {
      return new Promise((resolve, reject) => {
        postdata.agreement = 'GB17691'
        _func.get({
          url: 'vehicle/info/terminal/info/count/request/times',
          query: postdata,
          token: 'default'
        }).then(res => {
          this.data.requestTimes = res.data.data || 0
          resolve({ status: 'success' })
        }, err => {
          reject(err)
        })
      })
    },
    onExport: function () {
      return new Promise((resolve, reject) => {
        let postdata = this.getExtra('lastPost')
        delete postdata.pageNo
        delete postdata.pageSize
        postdata.agreement = 'GB17691'
        _func.get({
          url: 'vehicle/info/terminal/info/export',
          query: postdata,
          token: 'default'
        }).then(res => {
          resolve({ status: 'success', url: res.data.data })
        }, err => {
          reject(err)
        })
      })
    }
  },
  searchdata: {
    dictionary: {
      list: [
      ]
    }
  },
  extradata: {},
  pagination: true
})

maindata.data.requestTimes = 0

export default maindata
