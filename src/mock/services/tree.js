import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const totalCount = 5701

const getData = (options) => {
  const parameters = getQueryParameters(options)
  const result = []
  let mainSize = 8
  for (let i = 1; i < mainSize; i++) {
    let childItem = BuildTreeData(0, i, 1)
    result.push(childItem)
  }
  return builder({
    result: 'SUCCEED',
    data: result
  })
}

function BuildTreeData (parentId, index, deep) {
  let id = parentId + '' + index
  let data = {
    parentId: parentId,
    id: id,
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
  let childNum = Mock.mock('@integer(0, 10)')
  if (deep < 4 && childNum > 0) {
    data.children = []
    for (let i = 1; i < childNum; i++) {
      let childItem = BuildTreeData(id, i, deep + 1)
      data.children.push(childItem)
    }
  }
  return data
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

Mock.mock(/\/tree\/getdata/, 'get', getData)
Mock.mock(/\/tree\/builditem/, 'get', buildItem)
Mock.mock(/\/tree\/changeitem/, 'get', changeItem)
Mock.mock(/\/tree\/deleteitem/, 'get', deleteItem)
