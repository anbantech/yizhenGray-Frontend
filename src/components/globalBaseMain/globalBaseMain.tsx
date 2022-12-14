import * as React from 'react'
import styles from 'Src/view/Project/task/createTask/newCreateTask.less'

interface ContextProps {
  type?: any
  isFixForm: boolean
  name: string
  info?: any
}

export const GlobalContexted = React.createContext<ContextProps>(null!)
function GlobalBaseMain(props: any) {
  const { name, type, isFixForm, info } = props
  return (
    <GlobalContexted.Provider value={{ type, isFixForm, name, info }}>
      <div className={styles.taskMain}>
        <div className={styles.taskMain_header}>
          <span className={styles.taskMain_title}>{name}</span>
        </div>
        {props.children}
      </div>
    </GlobalContexted.Provider>
  )
}

export default GlobalBaseMain
