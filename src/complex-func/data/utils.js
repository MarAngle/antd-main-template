import setData from './../option/setData'
import LimitData from './../build/LimitData'

let utils = {
}
// ----- 数据类型判断相关 ----- START
// 判断数组
utils.isArray = function (data) {
  if (Array.isArray) {
    return Array.isArray(data)
  } else {
    return Object.prototype.toString.call(data) === '[object Array]'
  }
}
// 判断文件
utils.isFile = function (data) {
  return Object.prototype.toString.call(data) === '[object File]'
}
// 判断BLOB
utils.isBlob = function (data) {
  return Object.prototype.toString.call(data) === '[object Blob]'
}
// 判断Promise
utils.isPromise = function (fn) {
  return fn && typeof fn.then === 'function' && typeof fn.catch === 'function'
}
// 获取数据类型 undefined boolean string object number function array null reg symbol date
utils.getType = function (data) {
  let type = typeof (data)
  if (type === 'object') {
    if (data === null) {
      type = 'null'
    } else if (this.isArray(data)) {
      type = 'array'
    } else if (this.isFile(data)) {
      type = 'file'
    } else if (this.isBlob(data)) {
      type = 'blob'
    } else if (data instanceof RegExp) {
      type = 'reg'
    } else if (data instanceof Date) {
      type = 'date'
    }
  }
  return type
}
// 复杂数据结构 => 这里指的是赋值是更改的内存指针结构而不是内存地址 function存疑/file待判断
utils.isComplex = function (data) {
  let complex = ['object', 'function', 'array']
  return complex.indexOf(data) > -1
}
// 获取对象是否是复杂类型
utils.checkComplex = function (data) {
  let type = this.getType(data)
  return this.isComplex(type)
}
// ----- 数据类型判断相关 ----- END
// ----- 数据复制相关 ----- START
// 深拷贝数据
utils.deepClone = function (origindata, option) {
  let targetdata
  if (!option) {
    targetdata = JSON.parse(JSON.stringify(origindata))
  } else {
    targetdata = this.deepCloneData(origindata, targetdata, option)
  }
  return targetdata
}

// 深拷贝数据递归=>未使用尾递归，理论上内存占用会较大，等待优化方案
utils.deepCloneData = function(origindata, targetdata, option = {}) {
  // 初始化设置项
  if (option === true) {
    option = {}
  }
  // 格式化类型
  if (!option.type) {
    option.type = 'total'
  }
  // 限制字段设置
  if (!option.limitData) {
    option.limitData = this.getLimitData(option.limit)
  }
  // 被限制字段操作
  if (!option.limittype) {
    option.limittype = 'clear'
  }
  // 深度设置项,为否包括0时不限制深度,数组本身也是深度
  if (!option.depth) {
    option.depth = true
  }
  return this.deepCloneDataNext(origindata, targetdata, option)
}
utils.deepCloneDataNext = function (origindata, targetdata, option = {}, currentnum = 1, currentprop = '') {
  let type = this.getType(origindata)
  // 复杂对象进行递归
  if (type == 'object' || type == 'array') {
    let unDeep = true
    // 检查当前depth
    if (option.depth === true || currentnum <= option.depth + 1) {
      // 此时进行递归操作
      unDeep = false
      // 初始化目标值
      let targetType = this.getType(targetdata)
      let resetTarget = false
      if (option.type == 'total') {
        resetTarget = true
      } else if (targetType != type) {
        resetTarget = true
      }
      if (resetTarget) {
        targetdata = type == 'object' ? {} : []
      }
    }
    if (unDeep) {
      targetdata = origindata
    } else {
      // 当前深度递增
      currentnum++
      for (let i in origindata) {
        let nextprop = currentprop ? currentprop + '.' + i : i
        // 判断下一级的属性是否存在赋值限制，被限制的不进行赋值操作
        if (!option.limitData.getLimit(nextprop)) {
          targetdata[i] = this.deepCloneDataNext(origindata[i], targetdata[i], option, currentnum, nextprop)
        }
      }
    }
  } else if (type === 'date') {
    targetdata = new Date(origindata)
  } else if (type === 'reg') {
    targetdata = new RegExp(origindata)
  } else {
    targetdata = origindata
  }
  return targetdata
}
// 基于origindata更新targetdata数据,type默认为add
utils.updateData = function (targetdata, origindata, option = {}) {
  if (!option.type) {
    option.type = 'add'
  }
  targetdata = this.deepCloneData(origindata, targetdata, option)
  return targetdata
}
/**
 * 基于originlist更新targetlist列表数据
 * @param {*} targetlist 目标列表
 * @param {*} originlist 原数据列表
 * @param {*} payload
 *  type列表转换类型
 *  push布尔值新数据推送与否
 *  check相同判断函数或者属性值
 *  update更新函数或者参数function/object/und
 *  format新数据格式化函数
 *  destroy删除数据回调
 */
utils.updateList = function (targetlist, originlist, payload = {}) {
  // 生成check函数
  if (!payload.check) {
    console.error('请传递check函数判断相同对象')
    return
  } else {
    let type = this.getType(payload.check)
    if (type !== 'function') {
      let checkOption = type == 'string' ? { prop: payload.check } : payload.check
      payload.check = function (titem, oitem) {
        if (!checkOption.equal) {
          return titem[checkOption.prop] == oitem[checkOption.prop]
        } else {
          return titem[checkOption.prop] === oitem[checkOption.prop]
        }
      }
    }
  }
  // 默认方法类型
  if (!payload.type) {
    payload.type = 'total'
  }
  // 默认方法类型
  if (payload.push === undefined) {
    payload.push = true
  }
  // 更新操作设置
  let updateType = 'option'
  if (!payload.update) {
    payload.update = {}
  } else {
    let type = this.getType(payload.update)
    if (type == 'function') {
      updateType = 'function'
    }
  }
  // 复制数组数据避免对原数据的修改=>仅限于数组层面
  let cacheoriginlist = originlist.slice()
  let cachetargetproplist = []
  // 相同元素修改
  for (let n = 0; n < targetlist.length; n++) {
    let targetitem = targetlist[n]
    let isFind = false
    for (let i = 0; i < cacheoriginlist.length; i++) {
      let originitem = cacheoriginlist[i]
      if (payload.check(targetitem, originitem)) {
        if (updateType == 'function') {
          payload.update(targetitem, originitem)
        } else {
          this.updateData(targetitem, originitem, payload.update)
        }
        cacheoriginlist.splice(i, 1)
        isFind = true
        break
      }
    }
    if (!isFind) {
      cachetargetproplist.push(n)
    }
  }
  // 旧元素删除判断，当存在未命中的index切type为total时，更新整个数据，删除未命中的数据
  if (cachetargetproplist.length > 0 && payload.type == 'total') {
    for (let k = cachetargetproplist.length - 1; k >= 0; k--) {
      let n = cachetargetproplist[k]
      let dellist = targetlist.splice(n, 1)
      if (payload.destroy) {
        payload.destroy(dellist[0])
      }
    }
  }
  // 新元素加入
  if (payload.push && cacheoriginlist.length > 0) {
    for (let j in cacheoriginlist) {
      let originitem = cacheoriginlist[j]
      if (payload.format) {
        originitem = payload.format(originitem)
      }
      targetlist.push(originitem)
    }
  }
}
// ----- 数据复制相关 ----- END

// ----- 对象相关操作 ----- START
// 判断对象存在属性
utils.hasProp = function (item, prop) {
  if (!item[prop]) {
    if (!Object.prototype.hasOwnProperty.call(item, prop)) {
      for (let n in item) {
        if (n == prop) {
          return true
        } else {
          return false
        }
      }
    } else {
      return true
    }
  } else {
    return true
  }
}
// 对象转换为formdata数据
utils.jsonToForm = function (jsonData) {
  let formData = new FormData()
  for (let v in jsonData) {
    let type = utils.getType(jsonData[v])
    if (type === 'object') {
      formData.append(v, this.jsonToForm(jsonData[v]))
    } else {
      formData.append(v, jsonData[v])
    }
  }
  return formData
}
// 添加数据
utils.appendProp = function (data, propname, propdata, type = 'json') {
  if (type == 'json') {
    data[propname] = propdata
  } else if (type == 'formdata') {
    data.append(propname, propdata)
  }
}
utils.showJson = function (json) {
  console.log(JSON.stringify(json))
}
// 获取对象的属性，该函数用户获取对象不确定是否存在时调用
utils.getProp = function (targetdata, prop, nocontent = false) {
  if (targetdata && targetdata[prop]) {
    return targetdata[prop]
  } else {
    return nocontent
  }
}
// 根据属性列表获取对象属性
utils.getPropByList = function (targetdata, propList) {
  let res = targetdata
  propList = propList.filter(item => item && item.trim())
  for (let n = 0; n < propList.length; n++) {
    if (res[propList[n]]) {
      // res = null
      res = res[propList[n]]
    } else {
      res = null
      break
    }
  }
  return res
}
// 根据属性列表设置属性
utils.setPropByList = function (targetdata, propList, propData, useSetData) {
  let res = targetdata
  for (let n = 0; n < propList.length; n++) {
    if (n < propList.length - 1) {
      if (!res[propList[n]]) {
        res[propList[n]] = {}
      }
      res = res[propList[n]]
    } else {
      if (!useSetData) {
        res[propList[n]] = propData
      } else {
        setData.set(res, propList[n], propData)
      }
    }
  }
}
// 根据'mainprop.prop'格式字符串获取对象值
utils.getPropByStr = function (targetdata, strProp) {
  if (!targetdata || !strProp) {
    return false
  } else if (strProp.indexOf('.') > -1) {
    let list = strProp.split('.')
    let res = this.getPropByList(targetdata, list)
    return res
  } else {
    return targetdata[strProp]
  }
}
// 根据a.b字符串设置属性
utils.setPropByStr = function (targetdata, strProp, propData, useSetData) {
  if (!targetdata || !strProp) {
    return false
  } else {
    let list = strProp.split('.')
    this.setPropByList(targetdata, list, propData, useSetData)
  }
}
// 格式化对象
utils.formatDataByType = function (data, type = 'string') {
  let res
  if (type == 'boolean') {
    if (data) {
      res = true
    } else {
      res = false
    }
  } else if (type == 'number') {
    res = this.getNum(data, 'origin')
  } else {
    res = data
  }
  return res
}

// 根据type设置对象属性值
utils.setStrPropByType = function (item, prop, data, type = 'string', useSetData) {
  let targetdata = this.formatDataByType(data, type)
  this.setPropByStr(item, prop, targetdata, useSetData)
}
// 根据item[prop]不存在时赋值默认值defaultdata
utils.reBuildProp = function (item, prop, defaultdata) {
  if (!this.hasProp(item, prop)) {
    item[prop] = defaultdata
  }
}
// 基于新数据格式化当前数据函数
utils.mergeData = function (data, currentdata) {
  if (!currentdata) {
    currentdata = {}
  }
  for (let n in currentdata) {
    let type = this.getType(currentdata[n])
    if (type == 'object') {
      if (!data[n]) {
        data[n] = {}
      }
      this.mergeData(data[n], currentdata[n])
    } else {
      data[n] = currentdata[n]
    }
  }
  return data
}
// 格式化对象
utils.formatItem = function (originitem, option, targetitem = {}) {
  let optionData = option.data
  let optionUnadd = option.unadd
  for (let n in originitem) {
    if (optionData[n]) {
      targetitem[optionData[n]] = originitem[n]
    } else {
      if (!optionUnadd) {
        targetitem[n] = originitem[n]
      }
    }
  }
  return targetitem
}

// 格式化微tree
utils.formatTree = function (originList, option = {}) {
  let idprop = option.id || 'id'
  let parentidprop = option.parentid || 'parentid'
  let childrenprop = option.children || 'children'
  let temp = {}
  let mainlist = []
  for (let n in originList) {
    this.formatTreeNext(temp, originList[n], idprop, parentidprop, childrenprop)
  }
  for (let n in temp) {
    if (!temp[n].isdata) {
      mainlist = mainlist.concat(temp[n].data[childrenprop])
    }
  }
  temp = null
  return mainlist
}
/*
1.不存在父节点则说明为根节点
2.存在父节点
  1.判断自己的数据是否已经模拟，创建或者赋值
  2.判断父节点是否存在，挂载上去
*/
utils.formatTreeNext = function (temp, oitem, idprop, parentidprop, childrenprop) {
  let itemTemp = temp[oitem[idprop]]
  // 存在值则说明此时存在虚拟构建的数据
  if (itemTemp) {
    itemTemp.isdata = true
    for (let n in oitem) {
      itemTemp.data[n] = oitem[n]
    }
  } else {
    // 遍历到此时暂时未有该对象的子对象出现，因此直接实际构建数据
    oitem[childrenprop] = []
    itemTemp = {
      isdata: true,
      data: oitem
    }
    temp[oitem[idprop]] = itemTemp
  }
  let parentTemp = temp[oitem[parentidprop]]
  // 存在父节点则插入数据到父节点的列表中，此时不需要判断父节点的构建是否是虚拟构建
  if (parentTemp) {
    parentTemp.data[childrenprop].push(itemTemp.data)
  } else {
    // 不存在父节点则虚拟构建父节点并直接赋值到列表中
    parentTemp = {
      isdata: false, // 数据实际构建判断
      data: {
        [childrenprop]: [itemTemp.data]
      }
    }
    temp[oitem[parentidprop]] = parentTemp
  }
}
utils.buildWatch = function({ data, prop, func }) {
  let type = this.getType(data)
  if (type !== 'object') {
    console.error('buildWatch中data只能接收object')
    return false
  }
  if (!prop) {
    console.error('buildWatch中需要传递prop')
    return false
  }
  if (!func) {
    console.error('buildWatch中需要传递func')
    return false
  }
  const property = Object.getOwnPropertyDescriptor(data, prop)
  if (property && property.configurable === false) {
    console.error('data配置中configurable为false')
    return false
  }
  const getter = property && property.get
  const setter = property && property.set
  if ((getter && !setter) || (!getter && setter)) {
    console.error('data配置中getter和setter仅存在一项，需要同时配置')
    return false
  }
  let val
  if ((!getter)) {
    val = data[prop]
  }
  Object.defineProperty(data, prop, {
    get: function() {
      const value = getter ? getter.call(data) : val
      return value
    },
    set: function(newVal) {
      const value = getter ? getter.call(data) : val
      if (newVal !== value) {
        if (setter) {
          setter.call(data, newVal)
        } else {
          val = newVal
        }
        if (func) {
          func(newVal, value)
        }
      }
    }
  })
}
// ----- 对象相关操作 ----- END

// ----- 数组相关操作 ----- START
// 判断数据在数组中
utils.inArray = function (item, list) {
  if (list.indexOf(item) > -1) {
    return true
  } else {
    return false
  }
}
utils.clearArray = function (list) {
  list.splice(0, list.length)
}
// 数组属性快速输出
utils.showArrayProp = function (list, prop) {
  let proplist = []
  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    proplist.push(this.getPropByStr(item, prop))
  }
  console.log(JSON.stringify(proplist))
}
// 数组排序
utils.orderArrayByProp = function (list, { prop, rule }) {
  for (let i = 0; i < rule.length; i++) {
    let ruleprop = rule[i]
    for (let n = i; n < list.length; n++) {
      let item = list[n]
      if (this.getPropByStr(item, prop) == ruleprop) {
        // 当前位置删除并在需求位置添加上
        list.splice(n, 1)
        list.splice(i, 0, item)
        break
      }
    }
  }
}
utils.arrayClearOther = function (list, index, startIndex = 0) {
  if (list.length - 1 >= index) {
    // 删除index + 1到结束
    let endIndex = index + 1
    if (endIndex < startIndex) {
      endIndex = startIndex
    }
    let endNum = list.length - endIndex
    list.splice(endIndex, endNum)
    // 删除开始到index - 1
    let startNum = index - startIndex
    if (startNum > 0) {
      list.splice(startIndex, startNum)
    }
  }
}
// ----- 数组相关操作 ----- END

// ----- 数字相关 ----- START
// 数字操作
utils.getNum = function (original, type = 'round', radix = 2, NANZERO = true) { // 格式化数字
  let num = parseFloat(original)
  if (isNaN(num)) {
    if (NANZERO) {
      num = 0
      console.log('NAN is find')
    }
  } else if (type != 'origin' && Math.round(num) !== num) { // 如果是小数
    let rate = Math.pow(10, radix)
    num = Math[type](num * rate) / rate
  }
  return num
}
// 获取从start开始, 最大值为size - 1 的随机数,开始和结束的可能平均
utils.getRandomNum = function (start = 0, size = 10) {
  return start + Math.floor(Math.random() * size)
}
// 从列表中随机取值
utils.getRandomInList = function (list) {
  let size = list.length
  let index = this.getRandomNum(0, size)
  return list[index]
}
// ----- 数字相关 ----- END

// ----- 字符串相关 ----- START
let letterData = {
  small: [],
  big: [],
  number: []
}
for (let bi = 97; bi < 123; bi++) {
  letterData.small.push(String.fromCharCode(bi))
}
for (let si = 65; si < 91; si++) {
  letterData.big.push(String.fromCharCode(si))
}
for (let ni = 0; ni < 10; ni++) {
  letterData.number.push(ni.toString())
}
// 字符串函数
utils.fillStr = function (str, interval = '0', target = 2, type = 'head') {
  str = str.toString()
  interval = interval.toString()
  for (let i = 0; str.length < target; i++) {
    if (type == 'head') {
      str = interval + str
    } else if (type == 'foot') {
      str = str + interval
    } else {
      return str
    }
  }
  return str
}
// 清除开始结束空格，仅对字符串有效
utils.trimData = function (data) {
  let type = this.getType(data)
  if (type == 'string') {
    data = data.trim()
  }
  return data
}
// 获取随机字符串
utils.getRandomData = function ({ size, letter }) {
  let data = ''
  for (let n = 0; n < size; n++) {
    data = data + this.getRandomLetter(letter)
  }
  return data
}
// 获取随机字符=>列表生成考虑提前，避免重复逻辑，分离该函数
utils.getRandomLetter = function (letter) {
  let list = []
  if (!letter) {
    letter = {
      small: true,
      big: true,
      number: true
    }
  }
  if (letter.small) {
    list = list.concat(letterData.small)
  }
  if (letter.big) {
    list = list.concat(letterData.big)
  }
  if (letter.number) {
    list = list.concat(letterData.number)
  }
  return this.getRandomInList(list)
}
// 查找target在目标字符串中的次数和位置
utils.findTargetInStr = function(str, target, option = {}) {
  if (str && target) {
    str = str.toString()
    target = target.toString()
    let limitNum = option.limitNum || false
    if (option.case) {
      str = str.toUpperCase()
      target = target.toUpperCase()
    }
    return this.findTargetInStrNext(str, target, limitNum)
  } else {
    console.error('str/target参数不存在')
    return []
  }
}

utils.findTargetInStrNext = function(str, target, limitNum, list = [], index = 0) {
  let data = str.indexOf(target, index)
  if (data > -1) {
    list.push(data)
    if (limitNum === false || limitNum > list.length) {
      list = this.findTargetInStrNext(str, target, limitNum, list, data + target.length)
    }
  }
  return list
}
// ----- 字符串相关 ----- END

// ----- 日期相关 ----- START

let timeOption = [
  {
    prop: 'year',
    func: 'getFullYear',
    offset: 0,
    maxsize: 4
  },
  {
    prop: 'month',
    func: 'getMonth',
    offset: 1,
    maxsize: 2
  },
  {
    prop: 'day',
    func: 'getDate',
    offset: 0,
    maxsize: 2
  },
  {
    prop: 'hour',
    func: 'getHours',
    offset: 0,
    maxsize: 2
  },
  {
    prop: 'min',
    func: 'getMinutes',
    offset: 0,
    maxsize: 2
  },
  {
    prop: 'sec',
    func: 'getSeconds',
    offset: 0,
    maxsize: 2
  }
]
// 日期操作函数
utils.buildTimeData = function () {
  return {
    date: null,
    origin: {}, // 数字数据
    str: {} // 字符串数据
  }
}
utils.getTimeData = function (act, time) {
  let TimeData = this.buildTimeData()
  if (act == 'time') {
    TimeData.date = new Date(time)
  } else if (act == 'date') {
    TimeData.date = time
  }
  this.formatTimeData(TimeData)
  return TimeData
}
utils.formatTimeData = function (TimeData) {
  TimeData.origin.time = TimeData.date.getTime()
  TimeData.str.time = TimeData.origin.time.toString()
  for (let n in timeOption) {
    let titem = timeOption[n]
    TimeData.origin[titem.prop] = TimeData.date[titem.func]() + titem.offset
    TimeData.str[titem.prop] = this.fillStr(TimeData.origin[titem.prop], '0', titem.maxsize)
  }
}
utils.timeToStr = function (time, start = 0, end = 5, spitlist, nofill) {
  if (!spitlist) {
    spitlist = ['-', '-', ' ', ':', ':', '']
  }
  let res = ''
  let dateObj = new Date(time)
  for (let i = start; i <= end; i++) {
    if (!nofill) {
      res += this.fillStr(dateObj[timeOption[i].func]() + timeOption[i].offset)
    } else {
      res += (dateObj[timeOption[i].func]() + timeOption[i].offset).toString()
    }
    if (spitlist[i]) {
      res += spitlist[i]
    }
  }
  return res
}
utils.formatDate = function (targetdate, formatdata) {
  if (!formatdata) {
    formatdata = {
      year: targetdate.getFullYear()
    }
  }
  let d = {}
  for (let n in timeOption) {
    let titem = timeOption[n]
    d[titem.prop] = formatdata[titem.prop] !== undefined ? formatdata[titem.prop] : targetdate[titem.func]()
  }
  return new Date(d.year, d.month, d.day, d.hour, d.min, d.sec)
}

// 格式化数组
utils.formatList = function (originlist, option, targetlist = []) {
  for (let n in originlist) {
    let item = this.formatItem(originlist[n], option)
    targetlist.push(item)
  }
  return targetlist
}
// ----- 日期相关 ----- END

// ----- 本地缓存函数 ----- START
let localTemp = {
  pre: 'default'
}
utils.setLocalTempPre = function (pre) {
  localTemp.pre = pre
}
// 设置缓存
utils.setLocalTemp = function (prop, data, time) {
  prop = `${localTemp.pre}-${prop}`
  localStorage.setItem(prop, data)
  if (time) {
    let timeprop = prop + '_time'
    localStorage.setItem(timeprop, new Date().getTime())
  }
}
// 获取缓存
utils.getLocalTemp = function (prop, time, refresh) {
  prop = `${localTemp.pre}-${prop}`
  let data = localStorage.getItem(prop)
  if (data && time) {
    let timeprop = prop + '_time'
    let currenttime = new Date().getTime()
    let localtime = localStorage.getItem(timeprop)
    time = time * 60
    if ((currenttime - localtime) > time) {
      data = false
    } else if (refresh) {
      localStorage.setItem(timeprop, currenttime)
    }
  }
  return data
}
// 清除缓存
utils.removeLocalTemp = function (prop, time) {
  prop = `${localTemp.pre}-${prop}`
  localStorage.removeItem(prop)
  if (time) {
    let timeprop = prop + '_time'
    localStorage.removeItem(timeprop)
  }
}
// ----- 本地缓存函数 ----- END

// ----- 功能函数 ----- START
utils.getCharCode = function (str, index = 0) {
  return str.charCodeAt(index)
}
utils.strCodeNum = function (str) {
  let num = 0
  for (let n = 0; n < str.length; n++) {
    num = num + this.getCharCode(str, n)
  }
  return num
}
// 字符转换
utils.encodeURI = function (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16)
  })
}
// 获取query字段
utils.getQueryUrl = function (url) {
  return url.split('?')[1]
}
// 解析query数据（#判断根据实际情况）
utils.getQueryData = function (url) {
  let querydata = {}
  let queryurl = this.getQueryUrl(url)
  if (queryurl) {
    let querylist = queryurl.split('&')
    for (let n in querylist) {
      let oitem = querylist[n]
      if (oitem) {
        oitem = oitem.split('=')
        querydata[oitem[0]] = oitem[1]
      }
    }
  }
  return querydata
}
// 设置query url
utils.formatQueryUrl = function (url, data) {
  let type = 'init'
  if (url.indexOf('?') > -1) {
    type = 'extra'
  }
  if (type == 'init') {
    url += '?'
  } else if (type == 'extra') {
    url += '&'
  }
  for (let n in data) {
    url = url + n + '=' + this.encodeURI(data[n])
    url += '&'
  }
  return url.substring(0, url.length - 1)
}
// ----- 功能函数 ----- END

// ----- 公用函数 ----- START
// 更改list列表中选择的prop属性为指定值target,存在item则item更改为itemtarget
utils.choiceProp = function (list, prop, target = false, item, itemtarget = true) {
  for (let n in list) {
    list[n][prop] = target
  }
  if (item) {
    item[prop] = itemtarget
  }
}
utils.downloadBlob = function (blobvalue, type, name) {
  let blob
  if (typeof window.Blob == 'function') {
    blob = new Blob([blobvalue], { type: type })
  } else {
    let BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder
    let bb = new BlobBuilder()
    bb.append(blobvalue)
    blob = bb.getBlob(type)
  }
  let URL = window.URL || window.webkitURL
  let bloburl = URL.createObjectURL(blob)
  if (this.downloadFileByAnchor(bloburl, name)) {
    return true
  } else if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, name)
    return true
  } else {
    location.href = bloburl
    return true
  }
}

utils.downloadFileByAnchor = function (url, name) {
  let anchor = document.createElement('a')
  if ('download' in anchor) {
    anchor.setAttribute('download', name)
    anchor.href = url
    anchor.click()
    anchor = null
    return true
  } else {
    return false
  }
}

utils.downloadFile = function (data) {
  if (data) {
    let type = this.getType(data)
    if (type == 'string') {
      data = {
        url: data
      }
    }
    if (!data.name) {
      data.name = ''
    }
    if (this.downloadFileByAnchor(data.url, data.name)) {
      return true
    } else {
      this.openWindow(data.url)
      return true
    }
  } else {
    return false
  }
}
utils.openWindow = function (url, type = '_blank') {
  window.open(url, type)
}
// ----- 公用函数 ----- END

// ----- 复杂函数 ----- START
// 触发函数
utils.triggerFunc = function (func, ...args) {
  if (func && this.getType(func) === 'function') {
    func(...args)
    return true
  } else {
    return false
  }
}
// 触发Promise函数
utils.triggerPromise = function({
  func,
  args,
  promise,
  error,
  start,
  success,
  fail,
  finish
}) {
  let next = true
  let code = ''
  if (!promise) {
    if (!func) {
      next = false
      code = 'noArgs'
    } else {
      if (!args) {
        args = []
      }
      promise = func(...args)
    }
  }
  if (next) {
    if (!this.isPromise(promise)) {
      next = false
      code = 'notPromise'
    }
  }
  if (next) {
    this.triggerFunc(start)
    promise.then(res => {
      this.triggerFunc(success, res)
      this.triggerFunc(finish, res)
    }, err => {
      this.triggerFunc(fail, err)
      this.triggerFunc(finish, err)
    })
  } else {
    if (!this.triggerFunc(error, code)) {
      console.error(`triggerPromise函数运行错误，code: ${code}`)
    }
  }
}

// 获取限制对象
utils.getLimitData = function (option) {
  return new LimitData(option)
}
// 文件属性转换
utils.transformFile = function (from, to, data, filename) {
  return new Promise((resolve) => {
    if (from == 'BASE64') {
      let arr = data.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      if (to == 'BLOB') {
        resolve({ data: new Blob([u8arr], { type: mime }) })
      } else if (to == 'FILE') {
        console.log('this is never use, func this name')
        resolve({ data: new File([u8arr], '', { type: mime }) })
      }
    } else if (from == 'FILE') {
      if (to == 'BASE64') {
        let reader = new FileReader()
        reader.readAsDataURL(data)
        reader.onload = function (e) {
          resolve({ data: e.target.result })
        }
      } else if (to == 'BLOB') {
        resolve({ data: new Blob([data], { type: data.type }) })
      }
    } else if (from == 'BLOB') {
      if (to == 'BASE64') {
        let reader = new FileReader()
        reader.readAsDataURL(data)
        reader.onload = function (e) {
          resolve({ data: e.target.result })
        }
      } else if (to == 'FILE') {
        if (!filename) {
          let suffix = data.type.split('/')[1]
          filename = 'newfile.' + suffix
        }
        resolve({ data: new File([data], filename, { type: data.type }) })
      }
    }
  })
}

// 函数防抖，触发事件N秒后执行函数，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
// 非立即执行的意思是触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
// 立即执行的意思是触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果。
/**
* @desc 函数防抖
* @param func 函数
* @param wait 延迟执行毫秒数
* @param immediate true 表立即执行，false 表非立即执行
*/
utils.debounce = function (func, wait, immediate) {
  let timeout
  return function () {
    const context = this
    const args = [...arguments]
    if (timeout) {
      clearTimeout(timeout)
    }
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        func.apply(context, args)
      }
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}
// 函数节流，就是指连续触发事件但是在 n 秒中只执行一次函数。 节流会稀释函数的执行频率
// 时间戳版和定时器版的节流函数的区别就是，时间戳版的函数触发是在时间段内开始的时候，而定时器版的函数触发是在时间段内结束的时候。
/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
utils.throttle = function (func, wait, type = 1) {
  let previous, timeout
  if (type === 1) {
    previous = 0
  }
  return function () {
    let context = this
    let args = arguments
    if (type === 1) {
      let now = Date.now()
      if (now - previous > wait) {
        func.apply(context, args)
        previous = now
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null
          func.apply(context, args)
        }, wait)
      }
    }
  }
}
// ----- 复杂函数 ----- END

export default utils
