import * as React from 'react'
import { CSSProperties } from 'react'
import importIcon from 'Image/Template/import.svg'

const wrapperStyle: CSSProperties = {
  display: 'flex',
  height: '100%',
  background: '#F9F9F9'
}

const imageStyle: CSSProperties = {
  display: 'block',
  margin: 'auto'
}

const hintStyle: CSSProperties = {
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '24px',
  lineHeight: '36px',
  color: '#8B8B8B'
}

const NoDataSection: React.FC = () => {
  return (
    <div style={wrapperStyle}>
      <div style={{ margin: 'auto' }}>
        <img style={imageStyle} src={importIcon} alt='import' />
        <p style={hintStyle}>请从左侧拖拽原语（Primitive）或块（Block）至此处</p>
      </div>
    </div>
  )
}

NoDataSection.displayName = 'NoDataSection'

export default NoDataSection
