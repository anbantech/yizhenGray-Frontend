import SearchInput from 'Src/components/Input/searchInput/searchInput'
import CreateButton from 'Src/components/Button/createButton'
import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { RouteComponentProps, StaticContext, withRouter } from 'react-router'

import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import globalStyle from 'Src/view/Project/project/project.less'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from 'Src/view/Project/task/taskList/task.less'

const ExcitationLeft: React.FC<RouteComponentProps<any, StaticContext>> = props => {
  const layoutRef = useRef<any>()

  // 任务列表参数
  const [params, setParams] = useState<Resparams>({})
  // 动态设置虚拟列表高度
  const [height, setHeight] = useState(700)
  // 项目管理
  const [taskLists, setTaskList] = useState<any>([])

  // 数据是否还有更多
  const [hasMoreData, setHasMore] = useState(true)

  // 弹窗
  const [modalData, setModalData] = useState({ taskId: '', fixTitle: false, isModalVisible: false })

  //  删除弹出框
  const [CommonModleStatus, setCommonModleStatus] = useState<boolean>(false)

  //
  const [spinning, setSpinning] = useState(false)

  // 新建任务
  const createNewExcitationList = () => {}

  // 更新参数获取列表
  const updateParams = (value: string) => {
    setTaskList([])
    setParams({ ...params, key_word: value, page: 1 })
  }

  //  更改页码
  const loadMoreData = () => {
    const newPage = params.page_size + 10
    setParams({ ...params, page_size: newPage })
  }

  // 删除弹出框函数
  const CommonModleClose = (value: boolean) => {
    setCommonModleStatus(value)
  }

  const deleteExcitation = () => {}

  // 获取激励列表
  const getExcitationList = React.useCallback(async () => {}, [])

  // 跳转修改任务
  const fixTask = () => {}

  useEffect(() => {}, [])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect
        let num = 700
        if (height >= 1940 && height >= 2300) {
          num = height * 0.8
        } else if (height >= 1400 && height <= 1940) {
          num = height * 0.5
        } else {
          num = height * 0.2
        }
        setHeight(height - Math.ceil(num as number))
      }
    })

    if (layoutRef.current) {
      resizeObserver.observe(layoutRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className={styles.taskLeft_list} ref={layoutRef}>
      <div className={globalStyle.AnBan_header}>
        <div className={styles.taskHeadr}>
          <span className={styles.taskLeft_header_title}>激励配置</span>
          <CreateButton
            width='100%'
            height='36px'
            borderRadius='4px'
            name='新建激励发送列表'
            size='small'
            type='primary'
            onClick={createNewExcitationList}
          />
        </div>
        <SearchInput className={styles.taskInput} placeholder='根据名称搜索任务' onChangeValue={updateParams} />
      </div>
      <div className={styles.concentBody}>
        <InfiniteScroll
          dataLength={taskLists.length}
          next={loadMoreData}
          hasMore={hasMoreData}
          height={height}
          loader={
            <p style={{ textAlign: 'center' }}>
              <div className={styles.listLine} />
              <div className={styles.concentList}>内容已经加载完毕</div>
            </p>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <div className={styles.listLine} />
              <div className={styles.concentList}>内容已经加载完毕</div>
            </p>
          }
        >
          {/* {taskLists.map((item: any) => {
            return (
              <div
                tabIndex={item.id}
                role='button'
                className={modalData.taskId === item.id ? styles.itemActive : styles.item}
                onClick={() => {
                  updateInstanceList(item.id)
                }}
                key={item.id}
              >
                <span>
                  <img className={[2, 3, 4, 7, 8].includes(item.status) ? styles.iconShow : styles.icon} src={testing} alt='' />
                  {item.name}
                </span>
                <div className={styles.icon_layout}>
                  <div
                    role='time'
                    onClick={() => {
                      fixTask(item)
                    }}
                    className={styles.taskListLeft_editImg}
                  />
                  <div
                    role='time'
                    className={styles.taskListLeft_detailImg}
                    onClick={() => {
                      CommonModleClose(true)
                    }}
                  />
                </div>
              </div>
            )
          })} */}
        </InfiniteScroll>
      </div>
      <CommonModle
        IsModalVisible={CommonModleStatus}
        spinning={spinning}
        deleteProjectRight={deleteExcitation}
        CommonModleClose={CommonModleClose}
        ing='删除中'
        name='删除激励发送列表'
        concent='是否确认删除？'
      />
    </div>
  )
}

export default withRouter(ExcitationLeft)
