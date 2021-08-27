import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const totalCount = 5701

const getData = (options) => {
  const parameters = getQueryParameters(options)
  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      id: tmpKey,
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
    })
  }

  return builder({
    result: 'SUCCEED',
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
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

Mock.mock(/\/list\/getdata/, 'get', getData)
Mock.mock(/\/list\/builditem/, 'get', buildItem)
Mock.mock(/\/list\/changeitem/, 'get', changeItem)
Mock.mock(/\/list\/deleteitem/, 'get', deleteItem)
