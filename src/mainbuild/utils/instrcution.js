import InstrcutionData from './../mod/InstrcutionData'

let instrcution = {
  data: {}
}

instrcution.build = function(instrcutionData, prop, extendsProp) {
  let extendsData
  if (extendsProp) {
    extendsData = this.data[extendsProp]
  }
  instrcutionData.name = prop
  this.data[prop] = new InstrcutionData(instrcutionData, extendsData)
  console.log(this.data)
}

export default instrcution
