// 1. 获取所有源语

export interface PrimitiveAttributes {
  id: number
  name: string
  type: string
  desc: string
  required: boolean
  create_time: string
  update_time: string
  create_user: string
  update_user: string
}

export interface Primitive {
  id: number
  type: string
  desc: string
  attrs: PrimitiveAttributes[]
}
export interface isCode {
  code: number
  message: string
}

// 2. 新建项目  返回为null

// 3. 项目管理

export interface ResProjectList {
  results: {
    id: number
    name: string
    type: string
    desc: string
    create_time: string
    update_time: string
    create_user: string
    update_user: string
  }[]
  page_count: number
  page_no: number
  total: number
}

export interface ResExcitationList {
  results: {
    id: number
    name: string
    port: string
    status: number
    create_time: string
    update_time: string
    create_user: string
    update_user: string
  }[]
  page_count: number
  page_no: number
  total: number
}

export interface ResExcitationListNew {
  results: {
    sender_id: number
    id: number
    name: string
    port: string
    status: number
    create_time: string
    update_time: string
    create_user: string
    update_user: string
  }[]
  page_count: number
  page_no: number
  total: number
}

export interface ResCreExcitationList {
  results: {
    id: number
    name: string
    port: string
    status: number
    create_time: string
    update_time: string
    create_user: string
    update_user: string
  }[]
}
// 4. 项目详情

export interface ResProjectDetails {
  id: number
  name: string
  type: string
  desc: string
  create_time: string
  update_time: string
  create_user: string
  update_user: string
}

// 5. 新建协议 返回为null

// 6. 协议列表

export interface ResprotocolsList {
  id: number
  name: string
  type: string
  desc: string
  page_no: number
  page_count: number
  total: number
  // TODO type def
  results: any[]
  create_time: string
  update_time: string
  create_user: string
  update_user: string
}

// 7. 协议详情
export interface ResprotocolsDetails {
  id: number
  name: string
  type: string
  desc: string
  create_time: string
  update_time: string
  create_user: string
  update_user: string
}

// 8.新建模板 返回为null

// 9. 模板管理

export interface TemplateListResponse {
  results: {
    id: number
    name: string
    desc: string
    create_time: string
    update_time: string
    create_user: string
    update_user: string
  }[]
  page_count: number
  page_no: number
  total: number
}

// 10. 模板详情

export interface TemplateDetailInfo {
  id: number
  name: string
  elements: any
  type: string
  desc: string
  expected_template: {
    elements: { name: string; size: string; value: string; rules: any }[]
    [key: string]: any
  }
  create_time: string
  update_time: string
  create_user: string
  update_user: string
}
// 11. 新建模板交互 返回为null

// 12. 交互管理

export interface ResinteractionsList {
  id: number
  name: string
  page_no: number
  page_count: number
  // TODO type def
  results: any[]
  elements: any
  create_time: string
  update_time: string
  create_user: string
  update_user: string
  total: string
}

// 13. 异常处理器 返回为Null

// 14. 处理器列表

export interface Resexception_list {
  results: {
    id: number
    name: string
    retry_num: number
    interval: number
    first_wait: number
    page_no: number
    page_count: number
    total: number
    results: any
    create_time: string
    update_time: string
    create_user: string
    update_user: string
  }[]
  page_no: number
  page_count: number
  total: number
}

// 15. 新建目标  返回为null

// 16. 目标列表

export interface ResTargetList {
  page_no: number
  page_count: number
  total: number
  results: {
    id: number
    name: string
    connection: string
    status: boolean
    desc: string
    create_time: string
    update_time: string
    create_user: string
    update_user: string
  }[]
}

// 17. 目标详情

export interface ResTargetDetials {
  id: number
  name: string
  connection: string
  desc: string
  channel: number
  bitrate: number
  addr: string
  port: number
  status: boolean
  create_time: string
  update_time: string
  create_user: string
  update_user: string
}

export interface updateTarget {
  name?: string
  connection?: string
  desc?: string
  channel?: number
  bitrate?: number
  addr?: string
  port?: number
  flags?: string
  desc?: string
}
// 18. 目标删除  返回为Null

// 19.  新建任务  返回为NUll

// 20.  任务列表

export interface ResTaskList {
  results: {
    id: number
    name: string
    status: 0 | 2 | 1 | 3 | 4 | 5
    desc: string
    device_name: string
    page_no: number
    page_count: number
    total: number
    create_time: string
    update_time: string
    create_user: string
    update_user: string
  }[]
  page_count: number
  page_no: number
  total: number
}
// 21. 任务详情

export interface ResTaskDetail {
  error_num: number
  id: number
  name: string
  create_time: string
  update_time: string
  end_time: string
  start_time: string
  create_user: string
  update_user: null
  desc: string
  device_name: string
  coverage: number
  work_time: number
  crash_num: number
  status: number
  project_id: number
  test_num: number
  test_speed: number
  test_time: number
  statement_coverage: string
  branch_coverage: string
  warning_count: number
  group_name: string
  simu_instance_id: number
  num: string
}

// 22. 任务删除  返回为null

// 23.  测试实例列表

export interface ResTestList {
  results: {
    id: number
    start_time: string
    end_time: string
    elapsed_time: string
    total: number
    task_id: number
    error_count: number
    status: 0 | 1 | 2 | 3 | 4 | 5
    page_no: number
    page_count: number
    total: number
  }[]
  page_count: number
  page_no: number
  total: number
}

// 24. 测试实例详情 直接请求接口
export interface ResTestDetail {
  end_time: string
  total: number
  create_user: string
  start_time: string
  id: number
  update_time: string
  status: number
  create_time: string
  update_user: string
  elapsed_time: string
  task_id: number
  error_count: number
  create_time: string
  update_time: string
  create_user: string
  update_user: string
}
// 25. 测试实例删除 返回为null

// 26. 错误帧

export interface ReserrorFrams {
  results: {
    error_frames: any
    interaction: any
    create_time: string
    update_time: string
    create_user: string
    update_user: string
  }
  total: number
}

// 27. 错误帧重试 返回null

// 28. 自定义帧测试 返回为null

// 29. 测试日志

export interface Restestlogs {
  results: {
    id: number
    case_index: number
    is_wrong: boolean
    total: number
    send_data: string
    recv_data: string
    page_no: number
    page_count: number
    create_time: string
    update_time: string
    create_user: string
    update_user: string
    diagnosis: string
    error_num: number
  }
  total: number
  page_no: number
  page_count: number
}

// 30. 开始测试  返回为null

// 31. 暂停测试  返回为 null

// 32 停止测试   返回为null

// 33 手动接续测试  返回为null

// 34. 新建引擎  返回为null

export interface Resengines {
  type: string
  name: string
  desc: string
  id: number
  create_time: string
  update_time: string
  create_user: string
  update_user: string
}

// 35. 引擎列表
export interface ResenginesList {
  type: string
  name: string
  desc: string
  id: number
}
// 36. 诊断 返回状态码

// 37. 目标测试  返回状态码

// 38. 蓝牙扫描

export type ResblueTooth = {
  name: string
  addr: string
  create_time: string
  update_time: string
  create_user: string
  update_user: string
  paired: false
}[]
// 39. 校验名称 返回状态码

export interface ErrorMessage {
  id: number
  message: string
  create_time: string
  update_time: string
  type: 'finish' | 'conn_fail' | 'error_frame'
  // 1 继续 2 结束
  replied: 0 | 1 | 2
  task: any
  instance_id: number
  instance_num: string
}

export interface GetErrorMessageResponse {
  page_no: number
  page_count: number
  total: number
  results: ErrorMessage[]
}

export interface UpdateResponseErrorMessage {
  count: number
}

// 新建旁路
export interface BypassRes {
  code: number
  message: string
}

// 41 旁路列表
export interface BypassList {
  results: {
    id: number
    name: string
    middleware: string
    elements: {
      username: string
      password: string
      host: string
      port: string
      queue: string
    }
    busy: boolean
  }[]
  page_no: number
  page_count: number
  total: number
}

// 53 系统配置查看
export interface systemLookRes {
  id: number
  backup: {
    remote_folder: string
    remote_port: string
    remote_ip: string
    password: string
    username: string
    local_folder: string
  }
  create_time: string
  update_time: string
  create_user: null
  update_user: null
  monitor: any
  // 0 结束 1 备份中
  backup_status: 0 | 1
  // 0 结束 1 进行中
  import_status: 0 | 1
}

// 备份记录查询
export interface backupDataRecordRes {
  results: {
    id: string
    action: string
    create_time: string
    update_time: string
    create_user: null
    update_user: null
    message: string
    status: boolean
    loginIP: null
  }[]
  page_no: number
  page_count: number
  total: number
}

// 错误帧定位

export interface ReserrorFramsPostionoing {
  frame_id: numbered
  total: number
  log_info: any
}

export interface resLogin {
  access_token: string
  id: number
}

export interface resUserLog {
  results: {
    id: number
    username: string
    content: string
    create_time: string
    update_time: string
    create_user: null
    update_user: null
    action: string
    result: boolean
    target: number
  }[]
  page_no: number
  page_count: number
  total: number
}

export interface getAllRes {
  id: number
  name: string
  port: string
  group_type: number
  template_id: number
  recycle_count: number
  recycle_time: number
  enable: boolean
  cnt0: number
  wait_time_0: number
  align_delay_0: number
  align_delay_2: number
  next_id: number
  group_id_list: number[]
  group_data_list: any[]
}

export interface excitationRes {
  stimulus_id: number
  stimulus_name: string
  is_enable: boolean
  stimulus_value: string
}

export interface checkoutDataStructureRes {
  [key: string]: any
}

export interface templateDependence {
  id: number
  name: string
  type: number
  status?: number
  project?: string[]
  parents: templateDependence[]
  head?: boolean
}
