import 'antd/dist/antd.css'
import { Layout } from 'antd'
import React, { useState } from 'react'
import NoMatch from 'Src/view/404/404'
import Login from 'Src/view/Login/Login'
import { Route, Switch, RouteComponentProps } from 'react-router-dom'
import { Redirect, withRouter } from 'react-router'
import { ifNeedShowLogo } from 'Src/index'
import GlobalContextProvider from 'Src/globalContext/globalContext'
import Report from 'Src/view/Report/Report'
import FirstFrameChart from 'Src/until/ifNeedConfig/FirstFrame'
import styles from './app.less'
import Head from './layout/Header/header'
import LeftNav from './layout/LeftNav/leftNav'
import Contents from './layout/content/content'

const { Header, Sider, Content } = Layout

function Main() {
  const firstEnter = JSON.parse(sessionStorage.getItem('fe') || 'true')
  const [flag, setFlag] = useState(firstEnter)

  setTimeout(() => {
    if (flag) {
      setFlag(false)
      sessionStorage.setItem('fe', 'false')
    }
  }, 3500)

  return (
    <GlobalContextProvider>
      {flag && ifNeedShowLogo ? (
        <FirstFrameChart />
      ) : (
        <Layout style={{ overflow: 'hidden', minHeight: '100vh' }}>
          <Sider width={240} className={styles.site_layout_sub_leftNav_background}>
            <LeftNav />
          </Sider>
          <Layout className={styles.site_layout_wrapper}>
            <Header className={styles.site_layout_sub_header_background}>
              <Head />
            </Header>
            <Content>
              <Contents />
            </Content>
          </Layout>
          {/* <LoadingDataWrapper /> */}
        </Layout>
      )}
    </GlobalContextProvider>
  )
}

const App: React.FC<RouteComponentProps<any, any, any>> = props => {
  const name = props.location.pathname
  const RouterMap = new Set([
    '/projects',
    '/Arrgemnt',
    '/targets',
    '/targets/create',
    '/Exception/create',
    '/Exception',
    '/byPass',
    '/message',
    '/UserLog',
    '/UserList',
    '/backupData',
    '/byPass/newCreateByPass'
  ])
  const tokenID = window.localStorage.getItem('access_token')
  return (
    <>
      <Switch>
        <Redirect path='/' to='/login' exact />
        <Route path='/login' component={Login} />
        <Route path='/OnlineReport' exact component={Report} />
        <Route path='/404' exact component={NoMatch} />
        <Route
          path={`${name}`}
          render={props => {
            if (tokenID) {
              if (RouterMap.has(props.location.pathname)) {
                // 判断访问的是否是登录页面
                return <Route path={`${name}`} component={Main} />
                // if (tokenID && RouterMap.has(name) && stateData === undefined) { // 判断有没有token值
                //   return <Route path = {`${name}`} component={Main} /> // 如果有token就访问
                // }
                // return <Redirect path='/' to='/login' exact /> // 如果没有token就回到登录页面
              }
              if (!RouterMap.has(props.location.pathname) && props.location.state !== undefined) {
                return <Route path={`${name}`} component={Main} />
              }
              return <Redirect from='/*' to='/404' />
            }
            return <Redirect from='/*' to='/login' />
          }}
        />
        <Redirect from='/*' to='/login' />
      </Switch>
    </>
  )
}
export default withRouter(App)
