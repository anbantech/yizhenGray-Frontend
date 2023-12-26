// 1. 获取所有源语 直接调用借口

// 2. 新建项目
export interface CreateProject {
  name: string
  desc?: string
}
//
export interface updateTasksExampleParams {
  name: string
  desc: string
  device_name: string
  target_id: number | string
  interaction_id: number | string
  interaction_id: number | string
  exception_handler_id: string
  engine_id: number | string
  bypasses: string[]
  interval: number | string
  project_id: number | string
}

// 3. 项目管理

export interface ProjectList {
  key_word?: string
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

// 激励
export interface ExcitationList {
  target_type: string | number
  key_word?: string
  page: number
  status?: number | null
  page_size: number
  sort_field?: string
  sort_order?: string
}

export interface createExcitation {
  name: string
  port: string
}
// 4. 项目详情

export interface ProjectDetails {
  project_id: number
}

// 5. 新建协议

export interface protocols {
  name: string
  desc: string
}

// 6. 协议列表

export interface protocolsList {
  key_word?: string
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

// 7. 协议详情
export interface protocolsDetails {
  protocol_id: number
}

// 8.新建模板
export interface CreateTemplateParams {
  elements: any
  name: string
  desc: string
  // is_expected: boolean
  // template_id: number
  // parser: string
  // engine_id: number
  // protocol_id: number
}

export interface UpdateTemplateParams extends CreateTemplateParams {
  templates_id: number
}

// 9. 模板管理

export interface TemplateListParams {
  key_word?: string
  page?: number
  page_size?: number
  sort_field?: string
  sort_order?: string
}

export interface DeleteTemplateParams {
  templates: number[]
}

export interface template_Listest {
  template_id: number | string
  key_word?: string
  page?: number
  page_size?: number
  sort_field?: string
  sort_order?: string
  type?: string
  category?: number | string
}
// 10. 模板详情

export interface templateDetails {
  id: number
}

// 11. 新建模板交互
export interface interactions {
  protocol_id: number | string
  name: string
  elements: elementIs_expected | any
}

// 12. 交互管理

export interface interactionsList {
  protocol_id: number | string
  key_word?: string
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

// 13. 异常处理器

export interface exception_handler {
  name: string
  retry_num: number
  first_wait: number
  interval: number
  type: string
}

// 14. 处理器列表

export interface exception_list {
  key_word?: string
  page: number
  page_size: number
}

// 15. 新建目标

export interface CreateTarget {
  name: string
  connection: string
  channel?: number
  bitrate?: number
  addr?: string
  port?: number
  flgas?: string
  desc?: string
}

// 16. 目标列表

export interface TargetList {
  key_word?: string
  page: number
  page_size: number
  status?: string
  is_online?: string
}

// 17. 目标详情

export interface TargetDetials {
  id: number
}

// 18. 目标删除 直接调用接口

// 19.  新建任务
export interface Createtask {
  name: string
  desc: string
  is_emulated: string
  device_name: string
  interval: number
  target_id: number
  engine_id?: number
  interaction_id: number
  project_id: number
  exception_handler_id: number
  bypasses?: number[]
  simulation_node?: string
}

// 20.  任务列表

export interface TaskList {
  project_id: number
  key_word?: string
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
  status?: string | number | null
}

export interface taskParamsFn {
  name: string
  desc: string
  project_id: number
  work_time: number
  crash_num: number
  sender_id: number
}

// 21. 任务详情

export interface TaskDetail {
  id: number
}

// 22. 任务删除 直接调用接口

// 23.  测试实例列表

export interface TestList {
  task_id: number | null
  key_word?: string
  page: number
  status: number | null | string
  page_size: number
  sort_field?: string
  sort_order?: string
}

// 24. 测试实例详情 直接请求接口

// 25. 测试实例删除 直接请求接口

// 26. 错误帧

export interface errorFrams {
  instance_id: number
  system: string
  start_time: string
  end_time: string
  page: string
  page_size: string
  sort_field: string
  sort_order: string
}

// 27. 错误帧重试

export interface errorFramsAgain {
  instance_id: number
  frames_id: string
}

// 28. 自定义帧测试

interface StringArray {
  [index: number]: string
}
export interface custom_frames {
  frame: StringArray
  instance_id: number
}

// 29. 测试日志

export interface testlogs {
  task_id: number
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
  start_time?: string
  end_time?: string
  is_wrong?: string
  system?: string
  diagnosis?: string
  statement_coverage?: string
  branch_coverage?: string
}
export interface testAlllogs {
  task_id?: number
  instance_id?: number
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}
// 30. 开始测试

type testRow = {
  start: number
  end: number
}[]

export interface beginTest {
  task_id?: number
  row?: testRow
  column?: number
  instance_id?: number
  wrong?: boolean
  skip_error_frame?: boolean
}

// 31. 暂停测试

export interface pausedTest {
  task: number
}

// 32 停止测试

export interface stoppedTest {
  task: number
}

// 33 手动接续测试

export interface handlecontinueTest {
  task: number
}

// 34. 新建引擎

export interface engines {
  type: string
  name: string
  desc: string
}

// 35. 引擎列表 直接调用接口

// 36. 诊断

export interface diagnose {
  id: number
}

// 37. 目标测试

export interface targetsTest {
  task_id: number
}

// 38. 蓝牙扫描

export interface blueTooth {
  connection: string
  name?: string
}
export interface blueToothLinking {
  addr?: string | undefined
  pin?: string | undefined
  name?: string | undefined
}
// 39. 校验名称

export interface checkName {
  name: string
  project_id: number | string
}

export interface GetErrorMessageParams {
  replied?: 'true' | 'false'
  message_type?: 'finish' | 'conn_fail' | 'error_frame'
  page?: number
  page_size?: number
  sort_filed?: 'create_time'
  sort_order?: 'descend' | 'ascend'
}

export interface RemoveErrorMessageParams {
  messages: number[]
}

export interface ReplieErrorMessageParams {
  // 1 继续， 2 终止
  action: 1 | 2
  message_id: number
  used_filter?: boolean
  hour?: number
}
// 40 新建旁路
export interface BypassParams {
  middleware: string
  name: string
  elements: {
    username: string
    password: string
    host: string
    port: string
    queue: string
  }
}

// 41 获取旁路list

export interface BypassListParams {
  key_word?: string
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

//  系统配置

export interface BackupDataParams {
  remote_folder: string
  remote_port: string
  remote_ip: string
  password: string
  username: string
}

// 备份记录查询

export interface backupDataRecordParams {
  status?: string
  action?: string
  page?: number
  page_size?: number
  sort_field?: string
  sort_order?: string
}

export interface byPassConcentWay {
  task_id: number
  bypass_id: number
  active: boolean
}
// 日志导出
export interface exportTestLog {
  start_time: string
  end_time: string
}
// export interface systemConfigurationParams{
//   remote_folder:string
//   remote_port:string
//   remote_ip:string
//   password:string
//   username:string
// }

interface TestBypassConnectionParamsAfterInjected {
  bypass_id: number
}
interface TestBypassConnectionParamsBeforeInjected {
  username: string
  password: string
  host: string
  port: number
  queue: string
  middleware: 'RabbitMQ'
}
// 错误帧定位

interface errorFramsPostioning {
  instance_id: number
  frame_id: number
  page_size: number
}

export interface simulateParams {
  action: string
  task_id?: string | number
  addr?: string
  length?: string
  instance_id?: string | number
}

export interface registerParams {
  test_log_id: string | number
}
export type TestBypassConnectionParams = TestBypassConnectionParamsAfterInjected | TestBypassConnectionParamsBeforeInjected

export interface simulateNodeParams {
  target_id: number | string
  is_emulated: boolean
}

export interface loginParams {
  username: string | number
  password: string | number
}

export interface userLogParams {
  key_word: string
  page: number
  page_size: number
  sort_field: string
  sort_order: string
  start_time: string
  end_time: string
}

export interface ExcitationParams {
  name?: string
  port?: string
  desc?: string
  group_type?: number
  work_type?: number
  recycle_count_0?: number
  recycle_count_1?: number
  wait_time_0?: number
  wait_time_1?: number
  align_delay_0?: number
  align_delay_1?: number
  align_delay_2?: number
  template_id?: number
  recycle_count?: number
  recycle_time?: number
  enable?: boolean
  next_time?: number
  group_id_list?: any[]
  group_info?: any
}

export interface useCaseParams {
  name: string
  desc: string
  group_id_list: number[]
}

export interface doubleExcitationParams {
  name?: string
  desc?: string
  recycle_count_0?: number
  wait_time_0?: number
  align_delay_0?: number
  align_delay_2?: number
  child_id_list?: number[]
}

export interface groupParams {
  name?: string
  desc: string
  child_id_list?: number[]
  group_data_list?: any
}

export interface excitation_1Params {
  stimulus_name: string
  is_enable: boolean
  stimulus_value: string
}

export interface dataStructureParams {
  child_id_list?: number[][]
}

export interface ReplayIDArrayParams {
  task_id?: number
  instance_id?: number
  error_id?: number
}

export interface InstanceParams {
  instance_id: number
  task_id?: number
  work_time: number
  crash_num?: number
  crash_config?: any
}

export interface UpdateOneExcitaionListParams {
  stimulus_name: string
  is_enable: boolean
  stimulus_value: string
}

export interface ExcitationListParams {
  name: string
  desc?: string
  child_id_list?: Record<string, any>[][]
}

export interface CustomMadePeripheralListParams {
  variety?: string
  platform_id: number
  tag: string
  key_word?: string
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

export interface ProcessorListParams {
  used?: string
  platform_id: number
  key_word?: string
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

export interface TimerListParams {
  platform_id: number | null
  key_word?: string
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

export interface newPeripheralsParams {
  name: string
  base_address: string
  address_length: string
  kind: number
  variety?: number
  desc?: string
  platform_id: number
}

export interface newSetRegisterParams {
  name: string
  relative_address: string
  kind: string
  finish?: string
  variety?: number
  platform_id: number
}

export interface newSetDataHanderParams {
  name: string
  port: string
  platform_id: number
}

export interface newSetTimerParams {
  name: string
  period: string
  interrupt: string
  platform_id: number
}

export interface paramsCheck {
  object: string
  platform_id: number | string | null
  name?: string
  addr?: string
  length?: string
  port?: string
}

export interface updateDataHandelParams {
  name: string
  port: string
  platform_id: string | number | null
  interrupt?: string | number | undefined | null
  sof?: string | number | undefined | null
  eof?: string | number | undefined | null
  algorithm?: valueParamsArray | null
  length_member?: valueParamsArray | null
  checksum_member?: valueParamsArray | null
  framing_member?: valueParamsArray | null
  peripheral_id?: string | number | null
  register_id?: string | number | null
}
