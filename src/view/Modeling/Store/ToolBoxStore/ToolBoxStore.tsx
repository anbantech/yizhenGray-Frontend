export default class ToolBox {
  value: string | undefined

  isCheck: boolean | undefined

  key: string | undefined

  constructor(value: string, isCheck?: boolean, key?: string) {
    this.value = value
    this.isCheck = isCheck
    this.key = key
  }

  // 检查语言格式
  checkLanguageValueFormat(): boolean {
    if (!this.value) return false
    const reg = /^[A-Z_a-z]\w*$/
    return reg.test(this.value)
  }

  // 检查语言长度
  checkLaguageValueLength(): boolean {
    if (!this.value) return false
    const length = this.value.length >= 2 && this.value.length <= 20
    return length
  }

  validateLanguage(): { message: string | undefined; status: string | undefined } {
    if (!this.value) {
      return { message: '请输入名称', status: 'error' }
    }
    if (!this.checkLaguageValueLength()) {
      return { message: '名称长度在2-20个字符之间', status: 'error' }
    }
    const reg = /^[A-Z_a-z]\w*$/
    if (!reg.test(this.value)) {
      return { message: '名称以字母或下划线开头，并仅限使用字母、数字和下划线', status: 'error' }
    }
    return { message: undefined, status: 'success' }
  }

  // 检查16进制
  checkHex(): { message: string | undefined; status: string | undefined } {
    if (this.isCheck && !this.value) {
      return { message: '请输入由0-9,A-F(或a-f)组成的16进制数', status: 'error' }
    }
    const regex = /^(0x)?([\da-f]{1,8})$/i
    if (this.value) {
      if (!regex.test(this.value)) {
        return { message: '请输入由0-9,A-F(或a-f)组成的16进制数', status: 'error' }
      }
      return { message: undefined, status: 'success' }
    }

    return { message: undefined, status: undefined }
  }

  // 检查间隔
  checkInterval(): { message: string | undefined; status: string | undefined } {
    if (this.isCheck && !this.value) {
      return { message: '请输入间隔', status: 'error' }
    }
    const regex = /^\d+$/
    if (this.value) {
      if (!regex.test(this.value)) {
        return { message: '请输入0-65535的整数', status: 'error' }
      }
      const valueNumber = Number(this.value)
      if (valueNumber < 0 || valueNumber > 65535) {
        return { message: '请输入0-65535的整数', status: 'error' }
      }
      return { message: undefined, status: 'success' }
    }

    return { message: undefined, status: undefined }
  }

  // 检查中断
  checkInterrupt(): { message: string | undefined; status: string | undefined } {
    if (this.isCheck && !this.value) {
      return { message: '请输入中断', status: 'error' }
    }
    const regex = /^\d+$/
    if (this.value) {
      if (!regex.test(this.value)) {
        return { message: '请输入0-255的整数', status: 'error' }
      }
      const valueNumber = Number(this.value)
      if (valueNumber < 0 || valueNumber > 255) {
        return { message: '请输入0-255的整数', status: 'error' }
      }
      return { message: undefined, status: 'success' }
    }
    return { message: undefined, status: undefined }
  }

  validate(): { message: string | undefined; status: string | undefined } {
    switch (this.key) {
      case 'name':
        return this.validateLanguage()
      case 'address_length':
        return this.checkHex()
      case 'base_address':
        return this.checkHex()
      case 'relative_address':
        return this.checkHex()
      // case 'address_length':
      //   return this.checkHex()
      case 'period':
        return this.checkInterval()
      case 'interrupt':
        return this.checkInterrupt()
      default:
        return { message: '', status: 'success' }
    }
  }
}
