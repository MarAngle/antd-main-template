import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const getData = (options) => {
  const result = {
      id: 1,
      name: Mock.mock('@integer(0, 3)'),
      age: Mock.mock('@integer(0, 3)'),
      area: Mock.mock('@integer(1, 3)'),
      object: {
        value: Mock.mock('@integer(0, 1)'),
        label: '类型' + Mock.mock('@integer(0, 1)')
      },
      complex: {
        name: {
          inname: Mock.mock('@integer(0, 100)'),
          incode: Mock.mock('@integer(0, 100)')
        }
      },
      file: Mock.mock('@integer(0, 3)'),
      outSlot: Mock.mock('@integer(1, 3)'),
      switch: Mock.mock('@integer(1, 3)') == 2,
      date: Mock.mock('@datetime'),
      dateRange: [Mock.mock('@datetime'), Mock.mock('@datetime')]
    }

  return builder({
    result: 'SUCCEED',
    data: result
  })
}

const buildItem = (options) => {
  const parameters = getQueryParameters(options)
  const result = {}
  return builder({
    result: 'SUCCEED',
    data: result
  })
}
const changeItem = (options) => {
  const parameters = getQueryParameters(options)
  const result = {}
  return builder({
    result: 'SUCCEED',
    data: result
  })
}
const deleteItem = (options) => {
  const parameters = getQueryParameters(options)
  const result = {}
  return builder({
    result: 'SUCCEED',
    data: result
  })
}

Mock.mock(/\/info\/getdata/, 'get', getData)
Mock.mock(/\/info\/builditem/, 'get', buildItem)
Mock.mock(/\/info\/changeitem/, 'get', changeItem)
Mock.mock(/\/info\/deleteitem/, 'get', deleteItem)
