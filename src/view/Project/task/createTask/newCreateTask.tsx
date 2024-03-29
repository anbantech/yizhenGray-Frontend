import React, { useRef, useState } from 'react'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import FirstConfig from './taskConfigCompents/firstConfig'
import styles from './newCreateTask.less'
import { projectInfoType } from '../taskList/task'

type originalDataType = Record<string, unknown>

interface taskInfoType {
  editTaskMode: boolean
  data: originalDataType
}
interface taskPropsType<T> {
  taskInfo: T
  projectInfo: projectInfoType
  fromDataTask: any
}
export interface StepRef {
  save: () => void
  delete: () => void
  validate: () => boolean
  clearInteraction: () => void
}

interface ChildRef {
  firstForm: React.MutableRefObject<StepRef | null>
}

const CreateTask: React.FC<RouteComponentProps<any, StaticContext, taskPropsType<taskInfoType>>> = props => {
  const history = useHistory()

  const childRef: ChildRef = {
    firstForm: useRef<StepRef | null>(null)
  }
  const [isDisableStatus, setIsDisableStatus] = React.useState<boolean>(true)

  const { taskInfo, projectInfo, fromDataTask } = props.location?.state
  const [btnLoading, setBtnLoading] = useState(false)
  const createForm = async () => {
    setBtnLoading(true)
    const result = await childRef.firstForm?.current?.save()
    if (result) {
      if ((result as Record<string, any>).code) {
        setBtnLoading(false)
      } else {
        history.push({
          pathname: '/Projects/Tasks',
          state: { projectInfo }
        })
      }
    } else {
      setBtnLoading(false)
    }
  }
  const cancenlForm = () => {
    history.push({
      pathname: '/Projects/Tasks',
      state: { projectInfo }
    })
  }

  const onChange = (val: boolean) => {
    setIsDisableStatus(val)
  }

  return (
    <div className={styles.taskMain}>
      <div className={styles.taskMain_header}>
        <span className={styles.taskMain_title}>{taskInfo?.editTaskMode ? '修改任务' : '新建任务'}</span>
      </div>
      <div className={styles.taskMain_boby}>
        <FirstConfig
          ref={childRef.firstForm}
          taskInfo={taskInfo}
          fromDataTask={fromDataTask}
          projectInfo={projectInfo}
          id={projectInfo.projectId}
          onChange={onChange}
          cancenlForm={cancenlForm}
        />
      </div>
      <div className={styles.taskMain_footer}>
        <div className={styles.taskMain_footerConcent}>
          <CommonButton
            buttonStyle={styles.stepButton}
            name='取消'
            type='default'
            onClick={() => {
              cancenlForm()
            }}
          />
          <CommonButton
            buttonStyle={styles.stepButton}
            type='primary'
            disabled={isDisableStatus}
            loading={btnLoading}
            name={taskInfo?.editTaskMode ? '修改' : '新建'}
            onClick={() => {
              createForm()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default withRouter(CreateTask)
