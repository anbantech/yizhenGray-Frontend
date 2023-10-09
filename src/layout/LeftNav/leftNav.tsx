/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import items from 'Image/items.svg'
import configImage from 'Image/config.svg'
import ac_items from 'Image/projectsActive.svg'
import ac_configImage from 'Image/ac_config.svg'
import Arge from 'Image/Arge.svg'
import ac_Arge from 'Image/excititation.svg'
import { getLicense } from 'Src/services/api/loginApi'
import { useHistory, withRouter } from 'react-router-dom'
import { UpOutlined } from '@ant-design/icons'
import { GlobalContext } from 'Src/globalContext/globalContext'
import { RouterStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import { message } from 'antd'
import styles from './leftNav.less'

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
    name: '项目管理',
    path: 'projects'
  },
  {
    inactiveImageURL: Arge,
    activeImageURL: ac_Arge,
    name: '激励配置',
    path: 'Excitataions'
  },
  {
    inactiveImageURL: Arge,
    activeImageURL: ac_Arge,
    name: '外设建模',
    path: 'Modeling'
  },
  // {
  //   inactiveImageURL: Arge,
  //   activeImageURL: ac_Arge,
  //   name: '配置项',
  //   children: [
  //     { name: '模板管理', path: 'templateList' },
  //     { name: '端口管理', path: 'OneExcitationList' },
  //     { name: '激励单元管理', path: 'TwoExcitationList' },
  //     { name: '激励嵌套管理', path: 'ThreeExcitationList' },
  //     { name: '交互管理', path: 'FourExcitationList' }
  //   ]
  // },
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

const SideBar: React.FC<{ routerList: SideBarRoute[]; isClose: boolean }> = ({ routerList, isClose }) => {
  const history = useHistory()
  const RouterChange = RouterStore(state => state.RouterChange)
  const { config } = useContext(GlobalContext)
  const {
    userInfo: { roles },
    count
  } = config

  const [hoverImgStatus, setHoverImgStatus] = useState(false)

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
              setHoverImgStatus(false)
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
  }, [extendRouterList, history.location.pathname, RouterChange])
  const styleMemoFn = useCallback(
    (router: any) => {
      if (isClose) {
        return router.isActive ? styles.active : styles.sideNav_content
      }
      return router.isActive ? styles.activeClose : styles.closeSideNav_content
    },
    [isClose]
  )

  const styleImageFn = useCallback(() => {
    return isClose ? styles.sideNav_img : styles.sideNav_imgClose
  }, [isClose])

  const hoverImg = useCallback((bol: boolean, isHovering) => {
    if (bol) return
    setHoverImgStatus(isHovering)
  }, [])
  const generateRouterListJsx = useCallback(
    (routerList: Required<SideBarRouteExtension>[]) => {
      return routerList.map(router => {
        return (
          <div key={router.name} className={styles.Menu}>
            <div
              className={styleMemoFn(router)}
              style={router.isSubItem ? { paddingLeft: '64px' } : {}}
              role='button'
              onClick={() => switchRouter(router)}
              onMouseEnter={() => {
                hoverImg(router.isActive, true)
              }}
              onMouseLeave={() => {
                hoverImg(router.isActive, false)
              }}
              tabIndex={0}
            >
              {!!router.activeImageURL && (
                <img
                  className={styleImageFn()}
                  src={router.isActive || hoverImgStatus ? router.activeImageURL : router.inactiveImageURL}
                  alt={router.name}
                />
              )}

              {isClose && (
                <span className={styles.sideNav_chart}>
                  {router.name} {router.name === '异常信息' && +count > 0 && <span className={styles.errorMessageCue} />}
                </span>
              )}
              {router.children.length > 0 && <UpOutlined className={router.isOpen ? styles.isRotate : styles.isNoRotate} />}
            </div>
            {router.children.length > 0 && router.isOpen && generateRouterListJsx(router.children as Required<SideBarRouteExtension>[])}
          </div>
        )
      })
    },
    [styleMemoFn, styleImageFn, isClose, count, switchRouter, hoverImgStatus, hoverImg]
  )

  return <>{generateRouterListJsx(routerList2Render)}</>
}

// 侧边栏
const LeftNav: React.FC = () => {
  const [isClose, setClose] = useState(true)
  const [license, setLicense] = useState()
  const getLicenseInfo = React.useCallback(async () => {
    try {
      const res = await getLicense()
      if (res.data) {
        setLicense(res.data.expires)
      }
    } catch (error) {
      message.error(error.message)
    }
  }, [])
  useEffect(() => {
    getLicenseInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className={isClose ? styles.sideNav : styles.sideCloseNav}>
      <SideBar routerList={routerList} isClose={isClose} />
      {isClose && (
        <>
          {' '}
          {process.env.NODE_ENV === 'development' ? (
            <div style={{ position: 'absolute', bottom: '0', margin: '0px 24px', fontSize: '12px', color: '#99999' }}>
              <p>版本号：{process.env.VERSION?.slice(0, 17)}</p>
              {license && <p>有效期：{license}</p>}
              <p>HASH：{process.env.COMMITHASH?.slice(0, 8)}</p>
              <p>分支：{process.env.BRANCH}</p>
            </div>
          ) : (
            <div style={{ position: 'absolute', bottom: '0', margin: '0px 24px', fontSize: '12px', color: '#99999' }}>
              <p>版本号：{process.env.VERSION?.slice(0, 17)}</p>
              {license && <p>有效期 ：{license}</p>}
            </div>
          )}
        </>
      )}

      {isClose ? (
        <div
          role='time'
          className={styles.openPositionimg}
          onClick={() => {
            setClose(!isClose)
          }}
        />
      ) : (
        <div
          role='time'
          className={styles.closePositionimg}
          onClick={() => {
            setClose(!isClose)
          }}
        />
      )}
    </div>
  )
}

export default withRouter(LeftNav)
