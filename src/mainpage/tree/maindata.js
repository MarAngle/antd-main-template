import _func from 'complex-func'
import { TreeData, SelectList } from 'complex-data'

let preurl = 'http://$local'

let areaSelect = new SelectList({
  name: '区域',
  list: [
    {
      value: 1,
      label: '开发区'
    },
    {
      value: 2,
      label: '东港区'
    },
    {
      value: 3,
      label: '新市区'
    }
  ]
})

let maindata = new TreeData({
  name: '终端信息管理',
  prop: 'terminalinfolist',
  option: {
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
        prop: 'children',
        name: 'children',
        originprop: 'children',
        mod: {
          list: {}
        }
      }
    ]
  },
  methods: {
    getData: function () {
      return new Promise((resolve, reject) => {
        let postdata = this.getSearch()
        _func.get({
          url: preurl + '/tree/getdata',
          params: postdata
        }).then(res => {
          console.log(res.data.data)
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
  extradata: {}
})

export default maindata
