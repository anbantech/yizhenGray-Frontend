import * as React from 'react'
import { TaskDetail } from 'Src/services/api/taskApi'

function GetTaskDetail() {
  const [task_detail, setTaskDetail] = React.useState<any>()
  const getDetail = async (id: string) => {
    const res = await TaskDetail(id)
    if (res.data) {
      setTaskDetail(res.data)
    }
  }
  return [task_detail, getDetail]
}

export { GetTaskDetail }
