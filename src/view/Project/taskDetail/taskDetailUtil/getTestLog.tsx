import * as React from 'react'
import { useEffect } from 'react'
import { testlogs } from 'Src/globalType/Param'
import { getTestingLog } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'

function UseGetTestLog(params: testlogs) {
  const [total, setTotal] = React.useState(-1)
  const [logData, setLogData] = React.useState([])
  const getlog = async (value: testlogs) => {
    try {
      const log = await getTestingLog(value)
      if (log.data) {
        setLogData(log.data.results as any)
        setTotal(log.data.total)
      }
      return log
    } catch (error) {
      throwErrorMessage(error)
    }
  }
  useEffect(() => {
    if (params) {
      getlog(params)
    }
  }, [params])

  return [total, logData]
}

export { UseGetTestLog }
