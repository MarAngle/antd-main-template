import Vue from 'vue'
import { Modal, notification } from 'ant-design-vue'
import _func from 'complex-func'

_func.page.installMod('sider', {
  type: 'default',
  width: 256,
  change(type) {
    this.type = type
    this.width = type == 'mini' ? 80 : 256
  },
  recount(extra) {
    extra.width = extra.width + this.width
    return extra
  }
})
_func.page.installMod('header', {
  height: 64,
  recount(extra) {
    extra.height = extra.height + this.height
    return extra
  }
})
_func.page.init()

Vue.use(_func, {
  notice: {
    data: {},
    methods: {
      showmsg: function (content, type = 'open', title = '通知', duration = 3) {
        this.setmsg({
          message: title,
          description: content,
          duration: duration
        }, type)
      },
      setmsg: function (option, type = 'open') {
        if (notification[type]) {
          notification[type](option)
        } else {
          console.error('notification type is not defined, type reset open')
          notification.open(option)
        }
      },
      alert: function (content, title, next, okText = '确认') {
        this.setmodal({
          title: title,
          content: content,
          okText: okText,
          onOk: function () {
            if (next) {
              next('ok')
            }
          }
        }, 'error')
      },
      confirm: function (content, title, next, okText = '确认', cancelText = '取消') {
        this.setmodal({
          title: title,
          content: content,
          okText: okText,
          cancelText: cancelText,
          onCancel: function () {
            if (next) {
              next('cancel')
            }
          },
          onOk: function () {
            if (next) {
              next('ok')
            }
          }
        }, 'confirm')
      },
      setmodal: function (option, type = 'info') {
        if (Modal[type]) {
          Modal[type](option)
        } else {
          console.error('modal type is not defined, type reset info')
          Modal.info(option)
        }
      }
    }
  },
  require: {
    api: {
      baseURL: 'https://gateway-dev.wuzheng.com.cn/'
    },
    option: {
      headers: {}
    },
    rule: [
      {
        name: '五征',
        prop: 'wuzheng',
        token: {
          check: true,
          fail: function (tokenName, ruleItem) {
            console.log(tokenName, ruleItem)
          },
          data: {
            sign: {
              require: true,
              data: 'sign',
              location: 'params'
            },
            timestamp: {
              require: true,
              location: 'params',
              getData: function () {
                return Date.now()
              }
            },
            Authorization: {
              require: true,
              location: 'header'
            },
            'X-Token-Issuer': {
              require: true,
              location: 'header'
            },
            'X-Request-Id': {
              require: true,
              location: 'header',
              getData: function () {
                return Date.now()
              }
            }
          }
        },
        methods: {
          checkUrl (url) {
            if (url.indexOf('wuzheng.com.cn') > -1) {
              return true
            } else {
              return false
            }
          },
          check (response) {
            let res = {
              status: 'fail'
            }
            if (response.data) {
              res.data = response.data
              if (response.data.result == 'SUCCEED') {
                res.status = 'success'
                res.msg = response.data.errorMessage
              } else if (response.data.result == 'LOGIN') {
                res.status = 'login'
                res.code = response.data.errorCode
                res.msg = response.data.errorMessage
              } else {
                res.code = response.data.errorCode
                res.msg = response.data.errorMessage
              }
            }
            return res
          },
          failMsg (errRes) {
            if (errRes.error.response) {
              if (errRes.error.response.data && errRes.error.response.data.message) {
                // return errRes.error.response.data.message
              }
            }
          }
        }
      },
      {
        name: 'local',
        prop: 'default',
        token: {
          check: true,
          fail: function (tokenName, ruleItem) {
            console.log(tokenName, ruleItem)
          },
          data: {}
        },
        methods: {
          checkUrl (url) {
            if (url.indexOf('http://$local') > -1) {
              return true
            } else {
              return false
            }
          },
          formatUrl (url) {
            url = url.replace(/http:\/\/\$local/, '')
            return url
          },
          check (response) {
            let res = {
              status: 'fail'
            }
            if (response.data) {
              res.data = response.data.result
              if (response.data.result.result == 'SUCCEED') {
                res.status = 'success'
                res.msg = response.data.errorMessage
              } else if (response.data.result.result == 'LOGIN') {
                res.status = 'login'
                res.code = response.data.errorCode
                res.msg = response.data.errorMessage
              } else {
                res.code = response.data.errorCode
                res.msg = response.data.errorMessage
              }
            }
            return res
          },
          failMsg (errRes) {
            if (errRes.error.response) {
              if (errRes.error.response.data && errRes.error.response.data.message) {
                // return errRes.error.response.data.message
              }
            }
          }
        }
      }
    ]
  }
})

// 设置token
console.error('设置TOKEN')
_func.setToken('Authorization', 'eyJhbGciOiJSUzI1NiJ9.eyJYLVVzZXItUm9sZXMiOlt7InJvbGVJZCI6IjEyODEwNjQ5NjUyMjE0NTM4MjUiLCJyb2xlQ29kZSI6Im5ldyIsInJvbGVOYW1lIjoi5paw6IO95rqQIn0seyJyb2xlSWQiOiIxMzUyMTM2OTgzMzExODU1NjE3Iiwicm9sZUNvZGUiOiJlbGVjdHJpY19kYXRhX2FkbWluIiwicm9sZU5hbWUiOiLmlbDmja7nrqHnkIblkZgifSx7InJvbGVJZCI6ImY2ODE3ZjQ4YWY0ZmIzYWYxMWI5ZThiZjE4MmY2MThiIiwicm9sZUNvZGUiOiJhZG1pbiIsInJvbGVOYW1lIjoi566h55CG5ZGYIn1dLCJYLVVzZXItSWQiOiI3MDA0OGJiZDVhYzM0MTNjYjU0NGM2N2FhNWNhYTQ3NyIsInJvbGVzIjoibmV3LGVsZWN0cmljX2RhdGFfYWRtaW4sYWRtaW4iLCJpc3MiOiJlbGVjdHJpYyIsIlgtUmVhbC1OYW1lIjoi5paw6IO95rqQKGVsZWN0cmljKSIsInBpZCI6ImVsZWN0cmljIiwiWC1Vc2VyLU5hbWUiOiJlbGVjdHJpYyIsImV4cCI6MTYxMTMwMzkxMywiaWF0IjoxNjExMjk2NzEzLCJ1c2VybmFtZSI6ImVsZWN0cmljIn0.xZKDVjm7004c9qBemARAo0BWV7W8tgao67_xG2X3DwQoo5Q9BfCL5LpZiRBu-7VkObkFWiQFjbk2ZDOg7kZuY2j71e15cUPH8CZyGOzO6TmHYPodlgD6rT7S3eeTpOvfiy_BKWY2p-EbkW1IRCglr-bQPf6E5utjxUKn9y8LIWb6tlD7ywGB8XZc21YSC5WtWmHc48T4MoippEQMsQlS-MLhvtXBehFpEbhQz9m4-wu78mtKNzpMIliBhDmvXKLAkdw7LICEkwcMcaLgf5khT2TklKu-iE5ij0wcrmGGll-kqZTxwkymCR93fDKsy5Zdlhk_qMOvpNLD20F1bGMQRw', 'wuzheng')
_func.setToken('X-Token-Issuer', 'vehicle-new', 'wuzheng')
// _func.removeToken('Authorization', 'wuzheng')
// -- END
