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
import TasksDetail from 'Src/view/Project/taskDetail/taskDetail'
import OperationTask from 'Src/view/Project/task/createTask/newCreateTask'
import TaskInfo from 'Src/view/Project/taskDetail/taskDetailCompoents/showTaskDetail'
import ExcitationList from 'Src/view/excitation/excitationList'
import DetailTestAlLTable from 'Src/view/Project/taskDetail/tasklog/taskAllLog'
import ExcitationBase from 'Src/view/excitation/ExcitationBase'
import TemplateList from 'Src/view/template/TemplateList/templateList'
// import CreateResponseTemplateComponent from 'Src/view/template/ResponseTemplate/createResponseTemplate'
import CreateTemplateWrapper from 'Src/view/template/BaseTemplate/createTemplateWrapper'
// import ChangeArrgement from 'Src/view/arrgement/changeArrgement'
// import StepSecond from 'Src/view/arrgement/SecondArrgement'

// import UserLog from 'Src/view/uesrManagement/userLog/userLog'
// import UserList from 'Src/view/uesrManagement/userList/userList'

function content() {
  return (
    <div>
      <Switch>
        <Route path='/' exact component={Project} />
        <Route path='/projects' exact component={Project} />
        <Route path='/projects/Tasks' exact component={Tasks} />
        <Route path='/projects/Tasks/Detail' exact component={TasksDetail} />
        <Route path='/projects/Tasks/createTask' exact component={OperationTask} />
        <Route path='/projects/Tasks/fixTask' exact component={OperationTask} />
        <Route path='/projects/Tasks/Detail/lookTaskDetailInfo' exact component={TaskInfo} />
        <Route path='/projects/Tasks/Detail/TaskLog' exact component={DetailTestAlLTable} />
        <Route path='/excitationList' exact component={ExcitationList} />
        <Route path='/excitationList/Deatail' exact component={ExcitationBase} />
        <Route path='/excitationList/createOneExcitation' exact component={ExcitationBase} />
        <Route path='/excitationList/createDoubleExcitation' exact component={ExcitationBase} />
        <Route path='/excitationList/createGroupExcitation' exact component={ExcitationBase} />
        <Route path='/templateList' exact component={TemplateList} />
        <Route path='/templateList/template' exact component={CreateTemplateWrapper} />
        {/* <Route path='/excitationList/createGroupExcitation' exact component={ExcitationBase} /> */}
        {/* <Route path='/Arrgemnt/StepSecond' exact component={StepSecond} /> */}
        {/* <Route path='/Arrgemnt/ChangeArrgement' exact component={ChangeArrgement} /> */}
        {/* <Route path='/Arrgemnt/NewArrgement/responseTemplate' exact component={CreateResponseTemplateComponent} />
        <Route path='/Arrgemnt/StepSecond/responseTemplate' exact component={CreateResponseTemplateComponent} />
        <Route path='/Arrgemnt/NewArrgement/baseTemplate' exact component={createTemplateWrapper} />
        <Route path='/Arrgemnt/StepSecond/baseTemplate' exact component={createTemplateWrapper} /> */}
        <Redirect from='/*' to='/' />
        {/* <Route path='/UserLog' exact component={UserLog} />
        <Route path='/UserList' exact component={UserList} /> */}
      </Switch>
    </div>
  )
}

export default content
