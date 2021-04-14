import DefaultData from './DefaultData'
import OptionData from './../mod/OptionData'
import StatusData from './../mod/StatusData'
import UpdateData from './../mod/UpdateData'
import LifeData from './../mod/LifeData'
import PromiseData from './../mod/PromiseData'

class BaseData extends DefaultData {
  constructor (initdata = {}) {
    super(initdata)
    // 创建生命周期的名称列表-自动
    this.$LocalTempData.AutoCreateLifeNameList = []
    this.setModule('option', new OptionData())
    this._initBaseData(initdata)
    this.triggerCreateLife('BaseData')
  }
  _initBaseData ({
    life,
    status,
    update
  }) {
    this.setModule('life', new LifeData(life))
    this.setModule('status', new StatusData(status))
    this.setModule('promise', new PromiseData())
    if (update) {
      this.setModule('update', new UpdateData(update))
    }
  }
  /**
   * 设置状态
   * @param {*} data 状态value值
   * @param {*} prop 需要设置的状态
   * @param {*} act 操作判断值 count模式下启用，可选不传/init/reset，基本不用传
   */
  setStatus (data, prop = 'operate', act) {
    this.getModule('status').setData(prop, data, act)
  }
  // 获取对应状态的值
  getStatus (prop = 'operate') {
    return this.getModule('status').getData(prop)
  }
  // 恢复状态
  resetStatus () {
    this.getModule('status').reset()
  }
  // promise相关函数
  setPromise (prop, promisedata) {
    return this.getModule('promise').setData(prop, promisedata)
  }
  getPromise (prop) {
    return this.getModule('promise').getData(prop)
  }
  triggerPromise (prop, option = {}) {
    return this.getModule('promise').triggerData(prop, option)
  }
  // 生命周期函数
  // 设置生命周期函数
  onLife (name, data) {
    if (this.$LocalTempData.AutoCreateLifeNameList.indexOf(name) > -1) {
      this.printInfo(`正在创建一个属于创建生命周期的回调函数${name}，如此函数不是创建生命周期回调请修改函数名，否则请检查代码，理论上当你在设置这个触发函数时创建已经完成，此函数可能永远不会被触发！`)
    }
    return this.getModule('life').on(name, data)
  }
  // 触发特定的生命周期函数
  emitLife (name, id, ...args) {
    this.getModule('life').emit(name, id, ...args)
  }
  // 清楚指定类型指定name的生命周期回调
  offLife (name, id) {
    this.getModule('life').off(name, id)
  }
  // 触发生命周期
  triggerCreateLife (env) {
    if (!env) {
      this.printInfo('triggerCreateLife函数需要传递env参数')
    }
    let lifeName
    if (env == this.constructor.name) {
      lifeName = 'created'
    } else {
      lifeName = env + 'Created'
    }
    this.$LocalTempData.AutoCreateLifeNameList.push(lifeName)
    this.triggerLife(lifeName, this)
  }
  // 触发生命周期
  triggerLife (name, ...args) {
    this.getModule('life').trigger(name, ...args)
  }
  // 清楚指定类型的所有生命周期回调
  clearLife (name) {
    this.getModule('life').clear(name)
  }
  // 生命周期重置
  resetLife () {
    this.getModule('life').reset()
  }
  // 生命周期重置
  destroyLife () {
    this.getModule('life').destroy()
  }

  // 更新相关操作
  setUpdateOffset (offset) {
    this.triggerUpdateMethod('setOffset', offset)
  }
  // 开始更新
  startUpdate (payload) {
    this.triggerUpdateMethod('start', payload)
  }
  // 自动更新
  autoStartUpdate (payload) {
    this.triggerUpdateMethod('autoStart', payload)
  }
  // 触发下一次定时
  nextUpdate (payload) {
    this.triggerUpdateMethod('next', payload)
  }
  // 清除更新
  clearUpdate (payload) {
    this.triggerUpdateMethod('clear', payload)
  }
  // 重置更新
  resetUpdate (payload) {
    this.triggerUpdateMethod('reset', payload)
  }
  triggerUpdateMethod (method, payload, hideError) {
    if (this.getModule('update')) {
      if (this.getModule('update')[method]) {
        this.getModule('update')[method](payload)
      } else {
        this.printInfo(`更新模块不存在${method}方法`)
      }
    } else if (!hideError) {
      this.printInfo(`未定义更新模块`)
    }
  }
  // 自动加载或者更新数据
  autoLoadData (next, ...args) {
    return new Promise((resolve, reject) => {
      if (next === undefined || next === true) {
        next = 'auto'
      }
      let target = ''
      if (next == 'auto') {
        let loadStatus = this.getStatus('load')
        let updateStatus = this.getStatus('update')
        if (loadStatus.value == 'unload') {
          next = 'load'
          target = 'load'
        } else if (loadStatus.value == 'loading') {
          next = 'load'
          target = 'load'
        } else if (updateStatus.value == 'updated') { // loadStatus.value == 'loaded'
          next = 'update'
          target = 'update'
        } else if (updateStatus == 'updating') {
          next = 'update'
          target = 'update'
        }
      }
      // auto 保证数据的更新
      if (next == 'load') {
        args.splice(0, 1, true) // 强制获取新数据
        this.loadData(...args).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      } else if (next == 'update') {
        args.splice(0, 1, false) // update强制换取，此处设置为ing状态不重新拉取
        this.loadUpdateData(...args).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      } else {
        resolve({ next: next, target: target })
      }
    })
  }
  /*
  数据相关函数定义
  加载判断load是否加载成功和强制判断值
  */
  loadData (force, ...args) {
    return new Promise((resolve, reject) => {
      let loadStatus = this.getStatus('load')
      if (loadStatus.value == 'unload') {
        this.triggerGetData(...args)
      } else if (loadStatus.value == 'loading') {
        // 直接then
        if (force) {
          // force = { ing: true }
          if (typeof force == 'object' && force.ing) {
            this.triggerGetData(...args)
          }
        }
      } else if (loadStatus.value == 'loaded') {
        if (force) {
          this.triggerGetData(...args)
        }
      }
      this.triggerPromise('load', {
        errmsg: this.getPrintInfo(`promise模块无load数据(load状态:${loadStatus.value})`)
      }).then(res => {
        resolve(res)
      }, res => {
        reject(res)
      })
    })
  }
  /*
  实现更新函数
  加载判断当前更新状态
  */
  loadUpdateData (force, ...args) {
    return new Promise((resolve, reject) => {
      let updateStatus = this.getStatus('update')
      if (updateStatus.value == 'updated') {
        this.triggerUpdateData(...args)
      } else { // updating
        // 直接then'
        if (force) {
          this.triggerUpdateData(...args)
        }
      }
      this.triggerPromise('update', {
        errmsg: this.getPrintInfo(`promise模块无update数据(update状态:${updateStatus.value})`)
      }).then(res => {
        resolve(res)
      }, res => {
        reject(res)
      })
    })
  }

  // 触发目标函数并伴随对应的操作值变动--未发现对应函数时报错
  triggerMethod (target, ...args) {
    return new Promise((resolve, reject) => {
      if (this[target]) {
        this.setStatus('operating')
        this[target](...args).then(res => {
          this.setStatus('operated')
          resolve(res)
        }, res => {
          this.setStatus('operated')
          console.error(res)
          reject(res)
        })
      } else {
        this.printInfo(`未定义${target}函数，triggerMethod函数触发失败！`)
        reject({ status: 'fail', code: 'noMethod' })
      }
    })
  }

  // 触发目标函数并伴随对应的操作值变动--未发现对应函数时报错
  triggerMethodByOperate (target) {
    return new Promise((resolve, reject) => {
      if (this[target]) {
        let operate = this.getStatus()
        if (operate.value == 'operated') {
          this.triggerMethod(...arguments).then(res => {
            resolve(res)
          }, res => {
            reject(res)
          })
        } else {
          this.printInfo(`当前操作状态为:${operate.label}，${target}函数操作互斥，triggerMethodByOperate函数失败！`)
          reject({ status: 'fail', code: 'clash' })
        }
      } else {
        this.printInfo(`未定义${target}函数，triggerMethodByOperate函数触发失败！`)
        reject({ status: 'fail', code: 'noMethod' })
      }
    })
  }

  // 触发加载数据操作
  triggerGetData (...args) {
    return this.setPromise('load', new Promise((resolve, reject) => {
      // 触发生命周期加载前事件
      this.triggerLife('beforeLoad', ...args)
      this.setStatus('loading', 'load')
      args.unshift('getData')
      this.triggerMethod(...args).then(res => {
        this.setStatus('loaded', 'load')
        // 触发生命周期加载完成事件
        this.triggerLife('loaded', ...args)
        resolve(res)
      }, res => {
        this.setStatus('unload', 'load')
        // 触发生命周期加载失败事件
        this.triggerLife('loadFail', ...args)
        reject(res)
      })
    }))
  }
  // 触发更新数据操作
  triggerUpdateData (...args) {
    return this.setPromise('update', new Promise((resolve, reject) => {
      this.setStatus('updating', 'update')
      // 触发生命周期更新前事件
      this.triggerLife('beforeUpdate', ...args)
      args.unshift('updateData')
      this.triggerMethod(...args).then(res => {
        this.setStatus('updated', 'update')
        // 触发生命周期更新完成事件
        this.triggerLife('updated', ...args)
        resolve(res)
      }, res => {
        this.setStatus('updated', 'update')
        // 触发生命周期加载失败事件
        this.triggerLife('updateFail', ...args)
        reject(res)
      })
    }))
  }
  // 销毁回调操作
  destroy (...args) {
    this.triggerLife('beforeDestroy', ...args)
    this.reset()
    this.triggerLife('destroyed', ...args)
  }
  // 重置回调操作=>不清楚额外数据以及生命周期函数
  reset (...args) {
    this.triggerLife('beforeReset', ...args)
    // 重置状态
    this.resetStatus()
    this.triggerLife('reseted', ...args)
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'DefaultData',
        describe: '实现option/status/update/life/promise数据的加载,需要定义getData函数',
        build: [
          {
            prop: 'initdata',
            type: 'object',
            describe: '构建参数',
            required: true,
            data: [
              {
                prop: 'life',
                type: 'object',
                required: false,
                describe: 'life加载数据,仅此处定义created生命周期时可实现触发'
              },
              {
                prop: 'status',
                type: 'object',
                required: false,
                describe: 'status加载数据'
              },
              {
                prop: 'update',
                type: 'object',
                required: false,
                describe: 'update加载数据'
              }
            ]
          }
        ],
        data: [
          {
            prop: 'module',
            extend: true,
            describe: '模块数据1',
            data: [
              {
                prop: 'life',
                class: 'LifeData',
                describe: '属性'
              },
              {
                prop: 'status',
                class: 'StatusData',
                describe: '属性'
              },
              {
                prop: 'promise',
                class: 'PromiseData',
                describe: '属性'
              },
              {
                prop: 'update',
                class: 'UpdateData',
                describe: '属性'
              }
            ]
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

BaseData.initInstrcution()

console.log(BaseData.getInstrcution('data'))

export default BaseData
