let utils = {}

utils.deepClone = function (origindata, option) {
  let targetdata
  if (!option) {
    targetdata = JSON.parse(JSON.stringify(origindata))
  } else {
    targetdata = this.deepCloneData(origindata, targetdata, option)
  }
  return targetdata
}
utils.updateData = function (targetdata, origindata, option = {}) {
  if (!option.type) {
    option.type = 'add'
  }
  return this.deepCloneData(origindata, targetdata, option)
}
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
  this.deepCloneDataNext(origindata, targetdata, option = {})
}
utils.deepCloneDataNext = function(origindata, targetdata, option = {}, currentnum = 1, currentprop = '') {
  let type = this.getType(origindata)
  if (type === 'object' || type == 'array') {
    // 对象深拷贝操作,根据深度判断
    if (option.depth === true || currentnum <= option.depth + 1) {
      // 当前深度递增
      currentnum++
      // 初始化目标值
      let targetType = this.getType(targetdata)
      if (targetType != type) {
        targetdata = type == 'object' ? {} : []
      }
      // 已操作字段缓存
      let cache
      if (option.type == 'total') {
        cache = []
        if (type == 'array' && targetdata.length > origindata.length) {
          // 数组全复制情况下直接将长度重置，避免原数据过长导致判断增多
          targetdata.splice(0, origindata.length)
        }
      }
      for (let i in origindata) {
        let nextprop = currentprop ? currentprop + '.' + i : i
        // 判断下一级的属性是否存在赋值限制，被限制的不进行赋值操作
        if (!option.limitData.getLimit(nextprop)) {
          targetdata[i] = this.deepCloneDataNext(origindata[i], targetdata[i], option, currentnum, nextprop)
          if (cache) {
            cache.push(i)
          }
        } else if (option.limittype !== 'clear') {
          cache.push(i)
        }
      }
      if (option.type == 'total' && cache.length > 0) {
        for (let n in targetdata) {
          if (cache.indexOf(n) < 0) {
            // 原数据自有字段删除
            delete targetdata[n]
          }
        }
      }
    } else {
      // 对象浅拷贝操作
      targetdata = origindata
    }
  } else if (type === 'null') {
    targetdata = null
  } else if (type === 'date') {
    targetdata = new Date(origindata)
  } else if (type === 'reg') {
    targetdata = new RegExp(origindata)
  } else {
    targetdata = origindata
  }
  return targetdata
}


