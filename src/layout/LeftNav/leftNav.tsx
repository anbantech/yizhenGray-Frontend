/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import items from 'Src/asstes/image/items.svg'
import configImage from 'Src/asstes/image/config.svg'
import ac_items from 'Src/asstes/image/ac_items.svg'
import ac_configImage from 'Src/asstes/image/ac_config.svg'
import Arge from 'Src/asstes/image/Arge.svg'
import ac_Arge from 'Src/asstes/image/ac_Arge.svg'
import sidebarLogo from 'Src/asstes/image/sidebarLogo.svg'
import { useHistory, withRouter } from 'react-router-dom'
import { UpOutlined } from '@ant-design/icons'
import { GlobalContext } from 'Src/globalContext/globalContext'
import { ifNeedShowLogo } from 'Src/index'
import styles from './leftNav.less'

const Logo: React.FC = () => {
  return ifNeedShowLogo ? (
    <img src={sidebarLogo} alt='logo' style={{ padding: '20px 0 20px 38px', marginBottom: '12px' }} />
  ) : (
    <div style={{ marginBottom: '5px', width: '110px', height: '5px' }} />
  )
}

interface SideBarRoute {
  activeImageURL?: string
  inactiveImageURL?: string
  name: string
  path?: string
  children?: SideBarRoute[]
  authRole?: string
  isSubItem?: boolean
}

interface SideBarRouteExtension extends SideBarRoute {
  isActive: boolean
  isOpen: boolean
}

const routerList: SideBarRoute[] = [
  {
    activeImageURL: ac_items,
    inactiveImageURL: items,
    name: '项目列表',
    path: 'projects'
  },
  {
    inactiveImageURL: Arge,
    activeImageURL: ac_Arge,
    name: '配置项',
    children: [
      { name: '模版列表', path: 'templateList' },
      { name: '激励列表', path: 'excitationList' }
    ]
  },
  {
    inactiveImageURL: configImage,
    activeImageURL: ac_configImage,
    name: '系统管理',
    authRole: 'admin',
    children: [
      { name: '操作日志', authRole: 'admin', path: 'UserLog' },
      { name: '用户列表', authRole: 'admin', path: 'UserList' },
      { name: '备份设置', authRole: 'admin', path: 'backupData' }
    ]
  }
]

const SideBar: React.FC<{ routerList: SideBarRoute[] }> = ({ routerList }) => {
  const history = useHistory()
  const { config } = useContext(GlobalContext)
  const {
    userInfo: { roles },
    count
  } = config

  const generateRouterList = useCallback((routerList: SideBarRoute[], role: string | string[], isSubItem?: boolean) => {
    role = (typeof role === 'string' ? [role] : role) || ['common']
    return routerList
      .map(router => {
        if (!router.name) {
          throw new Error('router item must have path props')
        }
        if (!router.inactiveImageURL && router.activeImageURL) {
          router.inactiveImageURL = router.activeImageURL
        }
        if (!router.authRole) {
          router.authRole = 'common'
        }
        if (router.children) {
          generateRouterList(router.children, role, true)
        } else {
          router.children = []
        }
        if (isSubItem) {
          router.isSubItem = !!isSubItem
        }
        if (role.includes(router.authRole)) {
          return router
        }
        return null
      })
      .filter(router => !!router) as Required<SideBarRoute>[]
  }, [])

  const normalizedRouterList = useMemo(() => generateRouterList(routerList, roles), [generateRouterList, roles, routerList])

  const extendRouterList = useCallback(() => {
    return normalizedRouterList.map(router => {
      Object.assign(router, { isActive: false, isOpen: true })
      return router as Required<SideBarRouteExtension>
    })
  }, [normalizedRouterList])

  const [routerList2Render, setRouterList2Render] = useState(() => extendRouterList())

  const switchRouter = useCallback(
    (router: Required<SideBarRouteExtension>) => {
      setRouterList2Render(routerList2Render => {
        const switchRouterStatus = (routerList: Required<SideBarRouteExtension>[]) => {
          for (const _router of routerList) {
            if (_router.name === router.name) {
              _router.isActive = true
              _router.isOpen = !_router.isOpen
            } else {
              _router.isActive = false
            }
            if (_router.children.length > 0) {
              _router.children = switchRouterStatus(_router.children as Required<SideBarRouteExtension>[])
              _router.isActive = false
            }
          }
          return routerList
        }
        return [...switchRouterStatus(routerList2Render)]
      })
      // avoid router push when router.path is not existed
      if (router.path) {
        history.push(`/${router.path}`)
      }
    },
    [history]
  )

  useEffect(() => {
    // eslint-disable-next-line prefer-destructuring
    const routerPath = history.location.pathname.split('/')[1]
    const routerList = extendRouterList()
    const findRouter = (routerList: Required<SideBarRouteExtension>[], routerPath: string): Required<SideBarRouteExtension> | undefined => {
      let rt
      for (const _router of routerList) {
        if (routerPath === _router.path) {
          rt = _router
          rt.isActive = true
        } else if (_router.children.length > 0) {
          rt = findRouter(_router.children as Required<SideBarRouteExtension>[], routerPath)
          if (rt) {
            _router.isOpen = true
            _router.isActive = false
          }
        } else {
          _router.isActive = false
        }
      }
      return rt
    }
    findRouter(routerList, routerPath)
    setRouterList2Render(routerList)
  }, [extendRouterList, history.location.pathname])

  const generateRouterListJsx = useCallback(
    (routerList: Required<SideBarRouteExtension>[]) => {
      return routerList.map(router => {
        return (
          <div key={router.name} className={styles.Menu}>
            <div
              className={router.isActive ? styles.active : styles.sideNav_content}
              style={router.isSubItem ? { paddingLeft: '64px' } : {}}
              role='button'
              tabIndex={0}
              onClick={() => switchRouter(router)}
            >
              {!!router.activeImageURL && (
                <img className={styles.sideNav_img} src={router.isActive ? router.activeImageURL : router.inactiveImageURL} alt={router.name} />
              )}
              <span className={styles.sideNav_chart}>
                {router.name} {router.name === '异常信息' && +count > 0 && <span className={styles.errorMessageCue} />}
              </span>
              {router.children.length > 0 && <UpOutlined className={router.isOpen ? styles.isRotate : styles.isNoRotate} />}
            </div>
            {router.children.length > 0 && router.isOpen && generateRouterListJsx(router.children as Required<SideBarRouteExtension>[])}
          </div>
        )
      })
    },
    [count, switchRouter]
  )

  return <>{generateRouterListJsx(routerList2Render)}</>
}

// 侧边栏
const LeftNav: React.FC = () => {
  return (
    <div className={styles.sideNav}>
      <Logo />
      <SideBar routerList={routerList} />
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'absolute', bottom: '0', margin: '0px 24px' }}>
          <p>版本：{process.env.VERSION}</p>
          <p>HASH：{process.env.COMMITHASH?.slice(0, 8)}</p>
          <p>分支：{process.env.BRANCH}</p>
        </div>
      )}
    </div>
  )
}

export default withRouter(LeftNav)
