import * as React from 'react'
import GlobalBaseMain from 'Src/components/globalBaseMain/globalBaseMain'
import DoubleExcitationForm from './excitationListFrom/doubleExcitationForm'
import GroupExcitationForm from './excitationListFrom/groupExcitationForm'
import OneExcotationForm from './excitationListFrom/oneExcitationForm'
import ExcitationComponents from './excitationListFrom/excitation'

const ExcitationBase: React.FC = (props: any) => {
  const { type, isFixForm, name, info } = props.location.state

  const item = {
    one: <OneExcotationForm />,
    two: <DoubleExcitationForm />,
    three: <GroupExcitationForm />,
    four: <ExcitationComponents />
  }
  return (
    <GlobalBaseMain name={name} isFixForm={isFixForm} type={type} info={info}>
      {item[type as keyof typeof item]}
    </GlobalBaseMain>
  )
}
export default ExcitationBase
