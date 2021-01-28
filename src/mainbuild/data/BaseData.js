import _func from '@/maindata/func/index'
import DefaultData from './DefaultData'
import OptionData from './../mod/OptionData'
import StatusData from './../mod/StatusData'
import UpdateData from './../mod/UpdateData'
import LifeData from './../mod/LifeData'
import PromiseData from './../mod/PromiseData'

console.log(_func, OptionData, StatusData, UpdateData, LifeData, PromiseData)

class BaseData extends DefaultData {
  constructor (initdata = {}) {
    super(initdata)
  }
}
export default BaseData
