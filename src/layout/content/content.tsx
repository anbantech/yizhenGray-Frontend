import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Project from 'Src/view/Project/project/project'
import Tasks from 'Src/view/Project/TaskHome/TaskIndex'
import TasksDetail from 'Src/view/Project/taskDetail/taskDetail'
import OperationTask from 'Src/view/Project/task/createTask/newCreateTask'
import TaskInfo from 'Src/view/Project/taskDetail/taskDetailCompoents/showTaskDetail'
// import OneExcitationList from 'Src/view/excitation/Excitation/OneExcitationList'
// import TwoExcitationList from 'Src/view/excitation/Excitation/twoExcitationList'
// import ThreeExcitationList from 'Src/view/excitation/Excitation/ThreeExcitationList'
// import FourExcitationList from 'Src/view/excitation/Excitation/FourExcitaionList'
import DetailTestAlLTable from 'Src/view/Project/taskDetail/tasklog/taskAllLog'
// import ExcitationBase from 'Src/view/excitation/ExcitationBase'
// import TemplateList from 'Src/view/template/TemplateList/templateList'
import Scale from 'Src/view/Project/taskDetail/Scale/ScaleIndex'
import ExcitationIndex from 'Src/view/NewExcitation/ExcitationIndex'
import ScaleDetail from 'Src/view/Project/taskDetail/Scale/ScaleDetail'
import ScaleInitInfo from 'Src/view/Project/taskDetail/Scale/ScaleInitInfo'
import Modeling from 'Src/view/Modeling/Modeling'
// import CreateResponseTemplateComponent from 'Src/view/template/ResponseTemplate/createResponseTemplate'
// import CreateTemplateWrapper from 'Src/view/template/BaseTemplate/createTemplateWrapper'
// import ExcitationDraw from 'Src/view/excitation/excitationComponent/excitationDraw'
// import ChangeArrgement from 'Src/view/arrgement/changeArrgement'
// import StepSecond from 'Src/view/arrgement/SecondArrgement'
// import UserLog from 'Src/view/uesrManagement/userLog/userLog'
// import UserList from 'Src/view/uesrManagement/userList/userList'

function content() {
  return (
    <div>
      <Switch>
        <Route path='/' exact component={Project} />
        <Route path='/Projects' exact component={Project} />
        <Route path='/Modeling' exact component={Modeling} />
        <Route path='/Projects/Tasks' exact component={Tasks} />
        <Route path='/Projects/Tasks/Detail' exact component={TasksDetail} />
        <Route path='/Projects/Tasks/CreateTask' exact component={OperationTask} />
        <Route path='/Projects/Tasks/FixTask' exact component={OperationTask} />
        <Route path='/Projects/Tasks/Detail/LookTaskDetailInfo' exact component={TaskInfo} />
        <Route path='/Projects/Tasks/Detail/TaskLog' exact component={DetailTestAlLTable} />
        <Route path='/Projects/Tasks/Detail/InitTask' exact component={ScaleInitInfo} />
        <Route path='/Projects/Tasks/Detail/Scale' exact component={Scale} />
        <Route path='/Projects/Tasks/Detail/ScaleDetail' exact component={ScaleDetail} />
        <Route path='/Excitataions' exact component={ExcitationIndex} />
        {/* <Route path='/Excitataions' exact component={OneExcitationList} />
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
        <Route path='/templateList/templateDetail' exact component={CreateTemplateWrapper} /> */}
        <Redirect from='/*' to='/' />
      </Switch>
    </div>
  )
}

export default content
