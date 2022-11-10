/*
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-08-25 10:06:25
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-09-22 16:15:02
 * @FilePath: /yizhen-frontend/src/layout/content/content.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { Switch, Redirect } from 'react-router-dom'

// import UserLog from 'Src/view/uesrManagement/userLog/userLog'
// import UserList from 'Src/view/uesrManagement/userList/userList'

function content() {
  return (
    <div>
      <Switch>
        <Redirect from='/*' to='/' />
        {/* <Route path='/UserLog' exact component={UserLog} />
        <Route path='/UserList' exact component={UserList} /> */}
      </Switch>
    </div>
  )
}

export default content
