import React, { useCallback, useMemo } from 'react'
import StyleSheet from './excitationDraw.less'

const ExcitationDraw: React.FC = () => {
  const reslut = [
    {
      id: '1',
      name: '级联 group1 ',
      children: [
        {
          id: '1-1',
          name: '级联1',
          children: [
            {
              id: '1-1-1',
              name: '激励Group1',
              children: [{ id: 1 - 1 - 1 - 1, name: '单激励1' }]
            },
            {
              id: '1-1-2',
              name: '激励',
              children: [{ id: 1 - 1 - 1 - 2, name: '单激励' }]
            }
          ]
        },
        { id: '1-2', name: '级联2' }
      ]
    },
    { id: '2', name: '级联 group2' },
    { id: '3', name: '级联 group3' }
  ]
  const CascadeGroup = useCallback(() => {
    return (
      <div className={StyleSheet.allBody}>
        {reslut.map((item, index) => {
          return (
            <div className={StyleSheet.cascadeGroupBody} key={`${Math.random()}${new Date()}`}>
              <div className={StyleSheet.cascadeGroup}>
                {' '}
                <span> {item.name} </span>
                {reslut.length - 1 !== index ? <div className={StyleSheet.rowLine}> </div> : null}
              </div>
            </div>
          )
        })}
      </div>
    )
  }, [reslut])
  return (
    <div>
      <div>
        <span>交互</span>
        <div>
          <CascadeGroup />
        </div>
      </div>
    </div>
  )
}

ExcitationDraw.displayName = 'excitationDraw'

export default ExcitationDraw
