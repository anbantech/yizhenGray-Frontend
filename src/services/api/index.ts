import * as excitationAPI from './excitationApi'
import * as loginAPI from './loginApi'
import * as projectAPI from './projectApi'
import * as taskAPI from './taskApi'
import * as templateAPI from './templateApi'
import * as userManagementAPI from './uesrManagementApi'
import * as useCaseAPI from './useCaseApi'

export default {
  ...excitationAPI,
  ...loginAPI,
  ...projectAPI,
  ...taskAPI,
  ...templateAPI,
  ...userManagementAPI,
  ...useCaseAPI
}
