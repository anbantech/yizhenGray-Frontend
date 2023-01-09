import React, { CSSProperties } from 'react'

const stepTagClass: CSSProperties = {
  background: '#0077FF',
  border: '1px solid #2994FF',
  boxSizing: 'border-box',
  borderRadius: '32px',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '22px',
  color: '#FFFFFF',
  height: '24px',
  width: '24px',
  display: 'flex'
}

interface StepTagProps {
  step: number | string
}

const StepTag: React.FC<StepTagProps> = ({ step }) => {
  return (
    <div style={stepTagClass}>
      <span style={{ margin: 'auto' }}>{step}</span>
    </div>
  )
}

export default StepTag
