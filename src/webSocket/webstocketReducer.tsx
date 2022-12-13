export const statusStore = {
  name: null,
  id: null,
  status: null
}

export function WebStocketReducer(state: any, action: any) {
  switch (action.type) {
    case 'STATUS':
      return { ...state }
    default:
      throw new Error('错误')
  }
}
