import * as React from 'react'
import { getAllRes } from 'Src/globalType/Response'
import { getAllExcitationFn } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'

function GetDeatilFn(value: number) {
  const [Data, setData] = React.useState<getAllRes>()
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
    }
  }, [value])
  return Data
}

export default GetDeatilFn
