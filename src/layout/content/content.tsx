import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Project from 'Src/view/Project/project/project'
import Tasks from 'Src/view/Project/TaskHome/TaskIndex'
import TasksDetail from 'Src/view/Project/taskDetail/taskDetail'
import OperationTask from 'Src/view/Project/task/createTask/newCreateTask'
import TaskInfo from 'Src/view/Project/taskDetail/taskDetailCompoents/showTaskDetail'
import DetailTestAlLTable from 'Src/view/Project/taskDetail/tasklog/taskAllLog'
import Scale from 'Src/view/Project/taskDetail/Scale/ScaleIndex'
import ExcitationIndex from 'Src/view/NewExcitation/ExcitationIndex'
import ScaleDetail from 'Src/view/Project/taskDetail/Scale/ScaleDetail'
import ScaleInitInfo from 'Src/view/Project/taskDetail/Scale/ScaleInitInfo'
import ModelingIndex from 'Src/view/Modeling/ModelingIndex'
import ModelDetailsIndex from 'Src/view/Modeling/ModelingDetail/ModelDetailsIndex'

function content() {
  return (
    <div>
      <Switch>
        <Route path='/' exact component={Project} />
        <Route path='/Projects' exact component={Project} />
        <Route path='/Modeling' exact component={ModelingIndex} />
        <Route path='/Modeling/Detailes' exact component={ModelDetailsIndex} />
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

        <Redirect from='/*' to='/' />
      </Switch>
    </div>
  )
}

export default content
