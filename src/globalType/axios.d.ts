import axios from 'axios'
interface ResponseData<T> {
  code: number
  data: T | null | undefined
  message: string
}

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<ResponseData<T>> {}
}
