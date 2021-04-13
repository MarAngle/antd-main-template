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

export default instrcution
