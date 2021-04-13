import InstrcutionData from './../mod/InstrcutionData'

let instrcution = {
  data: {}
}

instrcution.build = function(instrcutionData, prop) {
  this.data[prop] = new InstrcutionData(instrcutionData)
  console.log(this.data)
}

export default instrcution
