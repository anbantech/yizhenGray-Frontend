import * as React from 'react'
import { useState, useEffect, useRef, useMemo } from 'react'
import styles from './toolTip.less'

/**
 * tooltip 组件
 * 必要参数：tipTitle，children，可选参数 tipMessage
 * eg：
 * <ToolTip tipTitle='标题' tipMessage='这里是你的注释文案'>
     <h1>children</h1>
   </ToolTip>
 */

interface ToolTipProps {
  tipTitle: string
  tipMessage?: string
  customWrapperClass?: string
  customTipWrapperClass?: string
}

const ToolTip: React.FC<ToolTipProps> = ({ children, tipTitle, tipMessage, customWrapperClass, customTipWrapperClass }) => {
  const [ifShow, setIfShow] = useState(false)
  const [mouseHover, setMouseHover] = useState(false)
  const [position, setPosition] = useState('bottom')
  const timer = useRef(0)
  const tipRef = useRef<HTMLDivElement | null>(null)

  const conputePosition = () => {
    const ref = tipRef && tipRef.current
    if (ref) {
      const viewPortHeight = document.body.clientHeight
      const offsetBottom = viewPortHeight - ref.offsetHeight - ref.getBoundingClientRect().top - 150
      if (offsetBottom < ref.offsetHeight) {
        setPosition('top')
      } else {
        setPosition('bottom')
      }
    }
  }

  useEffect(() => {
    clearTimeout(timer.current)
    if (mouseHover) {
      timer.current = window.setTimeout(() => {
        setIfShow(!!mouseHover)
      }, 600)
    } else {
      timer.current = window.setTimeout(() => {
        setIfShow(!!mouseHover)
      }, 200)
    }
    conputePosition()
    return () => {
      window.clearTimeout(timer.current)
    }
  }, [mouseHover])

  const openTip = () => {
    setMouseHover(true)
  }

  const closeTip = () => {
    setMouseHover(false)
  }

  const showToolTip = useMemo(() => {
    return ifShow && tipTitle
  }, [tipTitle, ifShow])

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div ref={tipRef} className={`${styles.toopTip_wrapper} ${customWrapperClass || ''}`} onMouseEnter={openTip} onMouseLeave={closeTip}>
      {React.isValidElement(children) ? children : <span>{children}</span>}
      {showToolTip && (
        <div
          className={`${position === 'bottom' ? styles.tip_wrapper_bottom : styles.tip_wrapper_top} ${customTipWrapperClass || ''}`}
          onMouseEnter={openTip}
          onMouseLeave={closeTip}
        >
          <p className={styles.tip_title}>{tipTitle}</p>
          {tipMessage && <span className={styles.tip_message}>{tipMessage}</span>}
        </div>
      )}
    </div>
  )
}

ToolTip.displayName = 'ToopTip'

export default ToolTip
