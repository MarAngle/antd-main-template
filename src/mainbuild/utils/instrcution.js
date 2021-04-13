import InstrcutionData from './../mod/InstrcutionData'

let instrcution = {
  data: new Map()
}

instrcution.build = function(instrcutionData, prop, extendsProp) {
  let extendsData
  if (extendsProp) {
    extendsData = this.data[extendsProp]
  }
  instrcutionData.name = prop
  this.data.set(prop, new InstrcutionData(instrcutionData, this.data, extendsProp))
  console.log(this.data)
}

instrcution.get = function(prop, type) {
  let data = this.data.get(prop)
  if (data) {
    return data.getData(type)
  } else {
    console.error(`instrcution不存在${prop}说明，请检查代码`)
    return null
  }
}

export default instrcution
