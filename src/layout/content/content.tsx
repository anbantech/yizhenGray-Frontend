/*
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-08-25 10:06:25
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-22 16:15:02
 * @FilePath: /yizhen-frontend/src/layout/content/content.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Project from 'Src/view/Project/project/project'
import Tasks from 'Src/view/Project/task/taskList/task'
import OperationTask from 'Src/view/Project/task/createTask/newCreateTask'
import ExcitationList from 'Src/view/excitation/ excitationList'
// import UserLog from 'Src/view/uesrManagement/userLog/userLog'
// import UserList from 'Src/view/uesrManagement/userList/userList'

function content() {
  return (
    <div>
      <Switch>
        <Route path='/' exact component={Project} />
        <Route path='/projects' exact component={Project} />
        <Route path='/projects/Tasks' exact component={Tasks} />
        <Route path='/projects/Tasks/createTask' exact component={OperationTask} />
        <Route path='/projects/Tasks/fixTask' exact component={OperationTask} />
        <Route path='/excitationList' exact component={ExcitationList} />
        <Redirect from='/*' to='/' />
        {/* <Route path='/UserLog' exact component={UserLog} />
        <Route path='/UserList' exact component={UserList} /> */}
      </Switch>
    </div>
  )
}

export default content
