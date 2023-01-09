// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { forwardRef } from 'react'
import { withRouter } from 'react-router'

const withRouterForwardRef = Component => {
  const WithRouter = withRouter(({ forwardedRef, ...props }) => <Component ref={forwardedRef} {...props} />)

  // eslint-disable-next-line react/display-name
  return forwardRef((props: any, ref) => <WithRouter {...props} forwardedRef={ref} />)
}

export default withRouterForwardRef
