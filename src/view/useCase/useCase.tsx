import * as React from 'react'
import GlobalBaseMain from 'Src/components/globalBaseMain/globalBaseMain'
import UseCaseForm from './useCaseForm'

const UseCaseBase: React.FC = (props: any) => {
  const { type, isFixForm, name } = props.location.state

  return (
    <GlobalBaseMain name={name} isFixForm={isFixForm} type={type}>
      <UseCaseForm />
    </GlobalBaseMain>
  )
}
export default UseCaseBase
