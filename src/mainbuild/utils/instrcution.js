import InstrcutionData from './../mod/InstrcutionData'

let instrcution = {
  data: new Map()
}

instrcution.build = function(instrcutionData) {
  this.data.set(instrcutionData.prop, new InstrcutionData(instrcutionData, this.data))
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

console.log(instrcution)

export default instrcution
