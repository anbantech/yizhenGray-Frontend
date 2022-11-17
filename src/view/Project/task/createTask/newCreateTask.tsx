import { Steps } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { RouteComponentProps, StaticContext } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import FirstConfig from './taskConfigCompents/firstConfig'
import SecondConfig from './taskConfigCompents/secondConfig'
import ThirdConfig from './taskConfigCompents/thirdConfig'
import styles from './newCreateTask.less'

const { Step } = Steps

interface taskInfoType {
  editTask: boolean
}
interface taskPropsType<T> {
  taskInfo: T
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
  const { taskInfo } = props.location?.state
  const childRef: ChildRef = {
    firstForm: useRef<StepRef | null>(null),
    secondForm: useRef<StepRef | null>(null),
    thirdForm: useRef<StepRef | null>(null)
  }
  const [timeCount, setTimeCount] = useState(3)
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

  const [current, setCurrent] = useState(2)

  const StepComponentMemo = useMemo(() => <StepComponent current={current} />, [current])
  const nextStep = () => {
    console.log(childRef.firstForm.current)
  }

  const jumpTaskList = () => {
    console.log('1')
  }

  const timeRef = useRef<any>()
  useEffect(() => {
    if (current === 2 && timeCount > 0) {
      timeRef.current = setTimeout(() => {
        setTimeCount(pre => pre - 1)
      }, 1000)
    } else {
      jumpTaskList()
    }
    return () => {
      clearTimeout(timeRef.current)
    }
  }, [current, timeCount])
  return (
    <div className={styles.taskMain}>
      <div className={styles.taskMain_header}>
        <span className={styles.taskMain_title}>{taskInfo?.editTask ? '修改任务' : '新建任务'}</span>
        {StepComponentMemo}
      </div>
      <div className={styles.taskMain_boby}>{itemData[current].content}</div>
      <div className={styles.taskMain_footer}>
        <div className={styles.taskMain_footerConcent}>
          <CommonButton buttonStyle={styles.stepButton} name={`${chartMap_Back[current]}(${timeCount}s)`} type='default' />
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

export default CreateTask
