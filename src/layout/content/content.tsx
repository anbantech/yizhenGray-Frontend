import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Project from 'Src/view/Project/project/project'
import Tasks from 'Src/view/Project/task/TaskIndex'
import TasksDetail from 'Src/view/Project/taskDetail/taskDetail'
import OperationTask from 'Src/view/Project/task/createTask/newCreateTask'
import TaskInfo from 'Src/view/Project/taskDetail/taskDetailCompoents/showTaskDetail'
import OneExcitationList from 'Src/view/excitation/Excitation/OneExcitationList'
import TwoExcitationList from 'Src/view/excitation/Excitation/twoExcitationList'
import ThreeExcitationList from 'Src/view/excitation/Excitation/ThreeExcitationList'
import FourExcitationList from 'Src/view/excitation/Excitation/FourExcitaionList'
import DetailTestAlLTable from 'Src/view/Project/taskDetail/tasklog/taskAllLog'
import ExcitationBase from 'Src/view/excitation/ExcitationBase'
import TemplateList from 'Src/view/template/TemplateList/templateList'
import Scale from 'Src/view/Project/taskDetail/Scale/ScaleIndex'

// import CreateResponseTemplateComponent from 'Src/view/template/ResponseTemplate/createResponseTemplate'
import CreateTemplateWrapper from 'Src/view/template/BaseTemplate/createTemplateWrapper'
import ExcitationDraw from 'Src/view/excitation/excitationComponent/excitationDraw'
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
        <Route path='/projects/Tasks/Detail/Scale' exact component={Scale} />
        <Route path='/projects/Tasks/Detail/ScaleDetail' exact component={Scale} />
        <Route path='/OneExcitationList' exact component={OneExcitationList} />
        <Route path='/TwoExcitationList' exact component={TwoExcitationList} />
        <Route path='/ThreeExcitationList' exact component={ThreeExcitationList} />
        <Route path='/FourExcitationList' exact component={FourExcitationList} />
        <Route path='/OneExcitationList/Detail' exact component={ExcitationBase} />
        <Route path='/TwoExcitationList/Detail' exact component={ExcitationBase} />
        <Route path='/ThreeExcitationList/Detail' exact component={ExcitationBase} />
        <Route path='/FourExcitationList/Deatail' exact component={ExcitationBase} />
        <Route path='/OneExcitationList/update' exact component={ExcitationBase} />
        <Route path='/TwoExcitationList/update' exact component={ExcitationBase} />
        <Route path='/ThreeExcitationList/update' exact component={ExcitationBase} />
        <Route path='/FourExcitationList/update' exact component={ExcitationBase} />
        <Route path='/ThreeExcitationList/createDoubleExcitation' exact component={ExcitationBase} />
        <Route path='/FourExcitationList/createGroupExcitation' exact component={ExcitationBase} />
        <Route path='/TwoExcitationList/createDoubleExcitationGroup' exact component={ExcitationBase} />
        <Route path='/OneExcitationList/createExcitation' exact component={ExcitationBase} />
        <Route path='/FourExcitationList/createGroupExcitation/ExcitationDraw' exact component={ExcitationDraw} />
        <Route path='/FourExcitationList/update/ExcitationDraw' exact component={ExcitationDraw} />
        <Route path='/FourExcitationList/Deatail/ExcitationDraw' exact component={ExcitationDraw} />
        <Route path='/templateList' exact component={TemplateList} />
        <Route path='/templateList/template' exact component={CreateTemplateWrapper} />
        <Route path='/templateList/templateDetail' exact component={CreateTemplateWrapper} />
        <Redirect from='/*' to='/' />
      </Switch>
    </div>
  )
}

export default content
