import React, { useRef, useState } from 'react'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import FirstConfig from './taskConfigCompents/firstConfig'
import styles from './newCreateTask.less'
import { projectInfoType } from '../taskList/task'

interface taskInfoType {
  editTask: boolean
}
interface taskPropsType<T> {
  taskInfo: T
  projectInfo: projectInfoType
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

  const { taskInfo, projectInfo } = props.location?.state
  const [btnLoading, setBtnLoading] = useState(false)
  const createForm = async () => {
    const result = await childRef.firstForm?.current?.save()
    if (result) {
      history.push({
        pathname: '/projects/Tasks',
        state: { projectInfo }
      })
    }
  }
  const cancenlForm = () => {
    history.push({
      pathname: '/projects/Tasks',
      state: { projectInfo }
    })
  }
  const onFieldsChange = (changedFields: any, allFields: any) => {
    const disabledData: any = []
    const errors = allFields.every((item: any) => {
      return item.errors.length === 0
    })
    // eslint-disable-next-line array-callback-return
    allFields.map((item: any) => {
      if (item.name[0] !== 'description') return disabledData.push(item.value)
    })

    const disabledBoolean = disabledData.every((item: any) => {
      return item !== undefined && item !== ''
    })
    if (disabledBoolean && errors) {
      setIsDisableStatus(false)
    } else {
      setIsDisableStatus(true)
    }
  }

  return (
    <div className={styles.taskMain}>
      <div className={styles.taskMain_header}>
        <span className={styles.taskMain_title}>{taskInfo?.editTask ? '修改任务' : '新建任务'}</span>
      </div>
      <div className={styles.taskMain_boby}>
        <FirstConfig ref={childRef.firstForm} taskInfo={taskInfo} id={projectInfo.projectId} onChange={onFieldsChange} />
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
            name={taskInfo?.editTask ? '修改' : '创建'}
            onClick={() => {
              setBtnLoading(true)
              createForm()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default withRouter(CreateTask)
