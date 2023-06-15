import * as React from 'react'
import GlobalBaseMain from 'Src/components/globalBaseMain/globalBaseMain'
import DoubleExcitationForm from './excitationListFrom/doubleExcitationForm'
import GroupExcitationForm from './excitationListFrom/groupExcitationForm'
import OneExcotationForm from './excitationListFrom/oneExcitationForm'
import ExcitationComponents from './excitationListFrom/excitation'
// import GroupExcitationFormGroup from './excitationListFrom/groupExcitationFormGroup'

const ExcitationBase: React.FC = (props: any) => {
  const { type, isFixForm, name, fromDataTask, fromPathName, info, Data, lookDetail, from, projectInfo, taskInfo } = props.location.state
  const item = {
    one: <ExcitationComponents />,
    two: <OneExcotationForm />,
    three: <DoubleExcitationForm />,
    four: <GroupExcitationForm />
  }
  return (
    <GlobalBaseMain
      name={name}
      isFixForm={isFixForm}
      fromPathName={fromPathName}
      from={from}
      projectInfo={projectInfo}
      taskInfo={taskInfo}
      lookDetail={lookDetail}
      type={type}
      info={info}
      Data={Data}
      fromDataTask={fromDataTask}
    >
      {item[type as keyof typeof item]}
    </GlobalBaseMain>
  )
}
export default ExcitationBase
