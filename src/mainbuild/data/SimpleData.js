class SimpleData {
  _getPrintInfo (content) {
    return `${this._selfName()}:${content}`
  }
  _printInfo (content, type = 'error', nextContent, nextType = type) {
    console[type](this._getPrintInfo(content))
    if (nextContent) {
      console[nextType](nextContent)
    }
  }
  _selfName () {
    return `[CLASS:${this.constructor.name}]`
  }
}

export default SimpleData
