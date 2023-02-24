import * as React from 'react'
import { excitationRes, getAllRes } from 'Src/globalType/Response'
import { getAllExcitationFn, getExcitationFn_1 } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'

function GetDeatilFn(value: number | undefined) {
  const [Data, setData] = React.useState<getAllRes | ''>()
  const getDetailFn = async (value: number) => {
    try {
      const res = await getAllExcitationFn(value)
      if (res.data) {
        setData(res.data)
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  }
  React.useEffect(() => {
    if (value) {
      getDetailFn(value)
    } else {
      setData('')
    }
  }, [value])
  return Data
}

function GetDeatilExcitation(value: number) {
  const [Data, setData] = React.useState<excitationRes>()
  const getDetailFn = async (value: number) => {
    try {
      const res = await getExcitationFn_1(value)
      if (res.data) {
        setData(res.data)
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  }
  React.useEffect(() => {
    if (value) {
      getDetailFn(value)
    }
  }, [value])
  return Data
}
export { GetDeatilFn, GetDeatilExcitation }
