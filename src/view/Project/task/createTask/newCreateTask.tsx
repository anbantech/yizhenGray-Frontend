import { Steps } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import FirstConfig from './taskConfigCompents/firstConfig'
import SecondConfig from './taskConfigCompents/secondConfig'
import ThirdConfig from './taskConfigCompents/thirdConfig'
import styles from './newCreateTask.less'
import { projectInfoType } from '../taskList/task'

const { Step } = Steps

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
  secondForm: React.MutableRefObject<StepRef | null>
  thirdForm: React.MutableRefObject<StepRef | null>
}
const chartMap_Back = ['取消', '上一步', '返回列表']
const chartMap_go = ['下一步', '下一步', '完成']
const firstFormBaseData = {
  description: undefined,
  host: undefined,
  name: undefined,
  password: undefined,
  username: undefined
}
const StepComponent = (props: { current: number }) => {
  const { current } = props
  return (
    <>
      <Steps current={current} size='small' className={styles.taskMain_step}>
        <Step title='填写基本信息' />
        <Step title='配置激励' />
        <Step title='创建完成' />
      </Steps>
    </>
  )
}
const CreateTask: React.FC<RouteComponentProps<any, StaticContext, taskPropsType<taskInfoType>>> = props => {
  const history = useHistory()

  const childRef: ChildRef = {
    firstForm: useRef<StepRef | null>(null),
    secondForm: useRef<StepRef | null>(null),
    thirdForm: useRef<StepRef | null>(null)
  }

  const { taskInfo, projectInfo } = props.location?.state
  const [current, setCurrent] = useState(0)

  const [timeCount, setTimeCount] = useState(3)

  const [taskStepDataObj, setTaskStepDataObj] = useState({ firstFormData: firstFormBaseData, secondFormData: {} })

  const itemData = [
    {
      title: '填写基本信息',
      content: <FirstConfig ref={childRef.firstForm} />
    },
    {
      title: '配置激励',
      content: <SecondConfig />
    },
    {
      title: '创建完成',
      content: <ThirdConfig />
    }
  ]

  const StepComponentMemo = useMemo(() => <StepComponent current={current} />, [current])
  const jumpTaskList = () => {
    history.push({
      pathname: '/projects/Tasks',
      state: { projectInfo }
    })
  }

  const timeRef = useRef<any>()
  //  步骤一
  const firstFormFn = () => {
    const formData = childRef.firstForm.current?.save()
    if (formData) {
      setTaskStepDataObj({ ...taskStepDataObj, firstFormData: formData })
    }
    setCurrent(pre => {
      return pre + 1
    })
  }
  // 步骤二
  const secondFormFn = () => {
    const formData = childRef.secondForm.current?.save()
    if (formData) {
      setTaskStepDataObj({ ...taskStepDataObj, secondFormData: formData })
    }
    setCurrent(pre => {
      return pre + 1
    })
  }
  // 下一步...完成 根据current进行不同操作逻辑
  const nextStep = () => {
    switch (current) {
      case 0:
        firstFormFn()
        break
      case 1:
        secondFormFn()
        break
      default:
        jumpTaskList()
    }
  }
  // 上一步...完成 根据current 进行不同操作
  const backStep = () => {
    if (current === 2) {
      jumpTaskList()
    } else {
      setCurrent(pre => {
        return pre - 1
      })
    }
  }
  useEffect(() => {
    if (current === 2) {
      if (timeCount > 0) {
        timeRef.current = setTimeout(() => {
          setTimeCount(pre => pre - 1)
        }, 1000)
      } else {
        jumpTaskList()
      }
    }
    return () => {
      clearTimeout(timeRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, timeCount])
  return (
    <div className={styles.taskMain}>
      <div className={styles.taskMain_header}>
        <span className={styles.taskMain_title}>{taskInfo?.editTask ? '修改任务' : '新建任务'}</span>
        {StepComponentMemo}
      </div>
      <div className={styles.taskMain_boby}>{itemData[current]?.content}</div>
      <div className={styles.taskMain_footer}>
        <div className={styles.taskMain_footerConcent}>
          <CommonButton
            buttonStyle={styles.stepButton}
            name={current === 2 ? `${chartMap_Back[current]}(${timeCount}s)` : `${chartMap_Back[current]}`}
            type='default'
            onClick={() => {
              backStep()
            }}
          />
          <CommonButton
            buttonStyle={styles.stepButton}
            type='primary'
            name={`${chartMap_go[current]}`}
            onClick={() => {
              nextStep()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default withRouter(CreateTask)
