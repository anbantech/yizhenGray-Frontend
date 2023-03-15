/* eslint-disable no-param-reassign */
/* eslint-disable unicorn/prefer-query-selector */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import MainBorder from 'Src/components/MainBorder/MainBorder'
import { message, Select } from 'antd'
import AddIcon from 'Image/Template/add.svg'
import DeleteIcon from 'Image/Template/delete.svg'
import TitleInput from 'Src/components/Input/titleInput/TitleInput'
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom'
import { sleep, throwErrorMessage, warn } from 'Src/util/common'
import { GlobalContext } from 'Src/globalContext/globalContext'
import API from 'Src/services/api'
import StepTag from 'Src/components/StepTag/StepTag'
import styles from './createResponseTemplate.less'
import ResponseTemplateListItem from './responseTemplateListItem'
import MoreOpationsComponent from './moreOpationsComponent'
import StepSection from './stepSection'
import { TemplateContext } from '../BaseTemplate/templateContext'
import { TemplateStatus } from '../BaseTemplate/createTemplateWrapper'

const { Option } = Select

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function normalizeHexString(input: string) {
  return input.length % 2 === 1 ? `0${input}` : input
}

export interface DefaultResponseTemplateListType {
  name: string
  size: string
  value: string
  hash?: string
  rules: {
    condition: string
    alg: string
    rule: string | { min_num: string; max_num: string }
  }
}

const CreateResponseTemplateComponent: React.FC<RouteComponentProps<any, any, any>> = props => {
  const history = useHistory()

  /**
   * 初始化默认预期模板数据
   * 由于默认数据第一次渲染后就不需要重新创建
   * 且放在 function 外部形成闭包会造成组件销毁，状态不恢复默认的情况
   * 故使用 useMemo 在首次渲染的时候将默认数据保存
   */
  const defaultResponseTemplateList = useMemo(
    () => [
      {
        name: '',
        size: '',
        value: '',
        rules: {
          condition: '',
          alg: '',
          rule: ''
        },
        hash: generateUUID()
      },
      {
        name: '',
        size: '',
        value: '',
        rules: {
          condition: '',
          alg: '',
          rule: ''
        },
        hash: generateUUID()
      },
      {
        name: '',
        size: '',
        value: '',
        rules: {
          condition: '',
          alg: '',
          rule: ''
        },
        hash: generateUUID()
      }
    ],
    []
  )

  /**
   * 预期模板数据
   * 预期模板列表数组，预期模板名称（功能未开启），预期模板解析器
   * 需求变更：预期模板名称不要求填写
   * 如果要重新支持编辑，取消这个参数即可
   */
  const ifNeedConfigName = false
  const [responseTemplateName, setResponseTemplateName] = useState('')
  const [parserSelectorValue, setParserSelectorValue] = useState<string>()
  const [responseTemplateList, setResponseTemplateList] = useState<Required<DefaultResponseTemplateListType>[]>(defaultResponseTemplateList)

  /**
   * 用于判断第一次数据渲染是否完成
   */
  const [loading, setLoading] = useState(true)

  /**
   * 用于增删改查后重新定位
   */
  const bodyWrapper = useRef<HTMLDivElement | null>(null)
  const [currentPosition, setCurrentPosition] = useState(0)

  /**
   * 初始化全局变量，解析器数组
   */
  const { config } = useContext(GlobalContext)
  const { parserSelectors } = config

  /**
   * 初始化页面变量
   * responseTemplate 解析模板数据和 status 模板状态
   * baseInfoRef 和 templateRef 用于调用兄弟组件的 validator 函数
   * templateId、protocolId 和 projectId
   * 模板状态如果是修改，则需要调用修改接口
   * 模板状态如果不是修改，则需要调用创建接口
   */
  const { template } = useContext(TemplateContext)
  const { responseTemplate, status, baseInfoRef, templateRef, templateId, protocolId, projectId } = template
  const editOriginalTemplate = status === TemplateStatus.CONFIG
  const readonlyBaseTemplate = status === TemplateStatus.READ

  /**
   * 初始化与其模板的数据
   */
  const initResponseTemplateFromContext = useCallback(() => {
    let originalResponseTemplateList = defaultResponseTemplateList
    if (responseTemplate.elements) {
      originalResponseTemplateList = responseTemplate.elements.flat() as any
    }
    originalResponseTemplateList.forEach(originalResponseTemplateListItem => {
      Object.assign(originalResponseTemplateListItem, { hash: generateUUID() })
      if (
        !Object.prototype.hasOwnProperty.call(originalResponseTemplateListItem, 'rules') ||
        Object.keys(originalResponseTemplateListItem.rules).length === 0
      ) {
        Object.assign(originalResponseTemplateListItem, {
          hash: generateUUID(),
          rules: {
            condition: '',
            alg: '',
            rule: ''
          }
        })
      }
    })

    setResponseTemplateList(originalResponseTemplateList)
    if (responseTemplate.parser) {
      setParserSelectorValue(responseTemplate.parser)
    }
    if (responseTemplate.name) {
      setResponseTemplateName(responseTemplate.name)
    }
    setLoading(false)
  }, [defaultResponseTemplateList, responseTemplate])

  /**
   * 无论是初始化拉接口的模板数据，还是导入模板的模板数据
   * 都调用 initResponseTemplateFromContext
   * 修改模板状态再导入数据，也不影响数据的完整性
   * 导入数据时有预先校验，一定会存在 parser 和 elements
   * name 参数可有可无，默认会被重写为“模板名称+_response”
   */
  useEffect(() => {
    initResponseTemplateFromContext()
  }, [initResponseTemplateFromContext])

  const addBlock = useCallback((index: number) => {
    setResponseTemplateList(blockList => {
      const temp = [...blockList]
      temp.splice(index, 0, {
        name: '',
        size: '',
        value: '',
        rules: {
          condition: '',
          alg: '',
          rule: ''
        },
        hash: generateUUID()
      })
      return temp
    })
    setCurrentPosition(index)
  }, [])

  const deleteBlock = useCallback((index: number) => {
    setResponseTemplateList(blockList => {
      const temp = [...blockList]
      temp.splice(index, 1)
      return temp
    })
    setCurrentPosition(index)
  }, [])

  /**
   * 增删改查操作定位到最新 block 的位置
   */
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (bodyWrapper && bodyWrapper.current) {
      if (!isFirstRender.current) {
        const node = bodyWrapper.current.children[currentPosition + 1]
        if (node) {
          node.scrollIntoView({ behavior: 'smooth', inline: 'center' })
        }
      } else {
        isFirstRender.current = false
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseTemplateList, currentPosition])

  const updateResponseTemplate = useCallback(
    (value: any, hash: string, key: 'name' | 'size' | 'value' | 'rules', addr) => {
      const tempList = responseTemplateList.map(responseTemplate => {
        const rt = responseTemplate
        if (rt.hash === hash) {
          rt[key] = value
          return rt
        }
        return rt
      })
      setResponseTemplateList(tempList)
      setCurrentPosition(addr)
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [responseTemplateList]
  )

  /**
   * 校验预置模板信息
   */
  type ValidatorResult = [boolean, { blockList: typeof responseTemplateList } | undefined]
  type ValidateResponseTemplate = () => Promise<ValidatorResult>
  const validateResponseTemplate: ValidateResponseTemplate = useCallback(async () => {
    // 检验解析器是否已选
    if (!parserSelectorValue) {
      message.error(`校验错误 => 解析器未选择，请选择解析器`)
      return [false, undefined]
    }

    let blockList = [...responseTemplateList]

    // 过滤掉无效 block
    blockList = blockList.filter(block => {
      return !(block.name === '' && block.size === '')
    })
    setResponseTemplateList(blockList)

    // 判断是否有错误 block
    const result = blockList.find(block => {
      return !block.name || !`${block.size}`
    })
    if (result) {
      message.error('校验错误 => 名称和字节属性都不能为空')
      return [false, undefined]
    }

    // 判断是否为空
    if (blockList && blockList.length === 0) {
      message.error('校验错误 => 解析模板不能为空，请先配置解析模板')
      setResponseTemplateList([
        {
          name: '',
          size: '',
          value: '',
          rules: {
            condition: '',
            alg: '',
            rule: ''
          },
          hash: generateUUID()
        }
      ])
      return [false, undefined]
    }

    try {
      if (blockList && blockList.length > 0) {
        // name 必须唯一
        const unionMap = [] as string[]
        blockList.forEach(block => {
          if (unionMap.includes(block.name)) {
            message.error(`校验错误 => 名称不能相同，存在相同的名称 【${block.name}】`)
            throw new Error(`校验错误 => 名称不能相同，存在相同的名称 【${block.name}】`)
          } else {
            unionMap.push(block.name)
          }
        })

        // size 必须为整型
        blockList.forEach(block => {
          if (`${block.size}`.includes('.')) {
            message.error('校验错误 => 字节的值必须为整形数字，不能包含点')
            throw new Error('校验错误 => 字节的值必须为整形数字')
          }
          if (Number.isNaN(+block.size)) {
            message.error(`校验错误 => 字节的值必须为整形数字, ${block.size} 不能被转换为整型`)
            throw new Error('校验错误 => 字节的值必须为整形数字')
          }
          if (+block.size < 0) {
            message.error(`校验错误 => 字节的值不能为负数`)
            throw new Error('校验错误 => 字节的值不能为负数')
          }
          /**
           * 匹配规则校验
           * 1. 如果是限定值范围，内容需要是16进制值，做16进制校验并前置补0
           * 2. 如果是包含以下内容，内容可以是任何值，不做校验
           */
          if (block.rules) {
            if (typeof block.rules.condition === 'number' && !block.rules.alg) {
              message.error(`校验错误 => 匹配规则条件设置不正确`)
              throw new Error('校验错误 => 匹配规则条件设置不正确')
            }

            if (typeof block.rules.condition === 'number' && block.rules.condition === 0) {
              const reg = /^[\dA-Fa-f]+$/
              // 16进制字符串自动补齐双位数，前补0
              if (typeof block.rules.rule === 'string') {
                if (!reg.test(block.rules.rule)) {
                  message.error(`校验错误 => 内容不是有效的16进制值`)
                  throw new Error('校验错误 => 内容不是有效的16进制值')
                }
                block.rules.rule = normalizeHexString(block.rules.rule).toUpperCase()
              }
              if (typeof block.rules.rule === 'object') {
                if (!reg.test(block.rules.rule.min_num) || !reg.test(block.rules.rule.max_num)) {
                  message.error(`校验错误 => 内容不是有效的16进制值`)
                  throw new Error('校验错误 => 内容不是有效的16进制值')
                }
                block.rules.rule.min_num = normalizeHexString(block.rules.rule.min_num).toUpperCase()
                block.rules.rule.max_num = normalizeHexString(block.rules.rule.max_num).toUpperCase()
                // 16进制最大值必须大于等于最小值
                if (Number.parseInt(block.rules.rule.min_num, 16) >= Number.parseInt(block.rules.rule.max_num, 16)) {
                  message.error(`校验错误 => 最大值必须大于最小值`)
                  throw new Error('校验错误 => 最大值必须大于最小值')
                }
              }
            } else if (typeof block.rules.condition === 'number') {
              if (!block.rules.rule) {
                message.error(`校验错误 => 内容不是有效的值`)
                throw new Error('校验错误 => 内容不是有效的值')
              }
            }
          }
        })
      }
    } catch (error) {
      warn(false, error)
      return [false, undefined]
    }

    return [true, { blockList }]
  }, [responseTemplateList, parserSelectorValue])

  const createTemplate = useCallback(
    async (eidt: boolean, params: any) => {
      // init router push function
      const routerPush = () => {
        history.push({
          pathname: props.location.state.from,
          state: {
            steping: 1,
            id: protocolId,
            projectId,
            protocolId,
            editTaskMode: props.location.state.editTaskMode,
            item: { ...props.location.state?.item, templatesType: 'templates' }
          }
        })
      }
      // wait event loop to update tempalte
      await sleep(0)

      if (eidt) {
        try {
          Object.assign(params, { templates_id: templateId })
          await API.updateTemplate(params)
          message.success('修改成功')
          routerPush()
        } catch (error) {
          throwErrorMessage(error, {
            1005: '校验错误 => 模板名称重复，请修改',
            4003: '校验错误 => 该模板无效，请检查模板'
          })
        }
      } else {
        try {
          // TODO 接口类型定义错误
          await API.createTemplate(params)
          message.success('创建成功')
          routerPush()
        } catch (error) {
          throwErrorMessage(error, {
            1005: '校验错误 => 模板名称重复，请修改',
            4003: '校验错误 => 该模板无效，请检查模板'
          })
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, projectId, props.location.state.editTaskMode, props.location.state.from, protocolId, templateId]
  )

  /**
   * 创建或修改模板
   * 1. 依次校验基础信息、模板信息和解析模板信息
   * 2. 加载基础信息：模板名称和模板描述
   * 3. 加载模板配置信息：模板结果列表
   * 4. 加载解析模板配置信息：解析模板列表和解析器
   * 5. 初始化接口内置信息：引擎参数、协议参数、模板参数
   * 6. 合并基础信息、模板配置信息、解析模板配置信息和接口内置信息
   * 7. 调用接口创建模板或修改模板整体
   */
  const nextStep = useCallback(async () => {
    if (readonlyBaseTemplate) {
      history.push({
        pathname: props.location.state.from,
        state: {
          steping: 1,
          id: protocolId,
          projectId,
          protocolId,
          item: { ...props.location.state?.item, templatesType: 'templates' }
        }
      })
    } else if (baseInfoRef && templateRef) {
      // 按顺序校验，有错就停止
      const [result1, bf] = await baseInfoRef.current?.validator()
      if (!result1) return
      const [result2, el] = await templateRef.current?.validator()
      if (!result2) return
      const [result3, bl] = await validateResponseTemplate()
      if (!result3) return
      // 组装各个参数
      const baseInfoParams = {
        name: bf.name,
        desc: bf.description
      }
      const templateParams = {
        elements: el.elements
      }
      const responseTemplateParams = {
        expected_name: `${bf.name}_response`,
        expected_elements: bl?.blockList.map(block => {
          return { name: block.name, size: Number(block.size), value: block.value, rules: block.rules }
        }),
        parser: parserSelectorValue
      }
      const apiBaseParams = {
        engine_id: 1,
        protocol_id: protocolId
      }
      const params = { ...baseInfoParams, ...templateParams, ...responseTemplateParams, ...apiBaseParams }
      await createTemplate(editOriginalTemplate, params)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    baseInfoRef,
    createTemplate,
    editOriginalTemplate,
    history,
    parserSelectorValue,
    projectId,
    props.location.state.from,
    protocolId,
    readonlyBaseTemplate,
    templateRef,
    validateResponseTemplate
  ])

  const ListItemActionBar = (responseTemplateIndex: number) => (
    <div className={styles.icon_group}>
      <img src={AddIcon} alt='add' onClick={() => addBlock(responseTemplateIndex)} />
      <img src={DeleteIcon} alt='delete' onClick={() => deleteBlock(responseTemplateIndex)} />
      {responseTemplateIndex !== responseTemplateList.length - 1 ? (
        <img src={AddIcon} alt='add' onClick={() => addBlock(responseTemplateIndex + 1)} />
      ) : (
        <div style={{ width: '15px' }} />
      )}
    </div>
  )

  const changeParser = useCallback((value: string) => {
    setParserSelectorValue(prev => {
      const isTextProtocolParser = (parser?: string) => {
        if (!parser) return false
        return ['HTTP', 'FTP', 'TFTP'].includes(parser)
      }
      if (isTextProtocolParser(prev) !== isTextProtocolParser(value)) {
        setResponseTemplateList(responseTemplateList => {
          return responseTemplateList.map(responseTemplate => {
            return {
              ...responseTemplate,
              rules: {
                condition: '',
                alg: '',
                rule: ''
              }
            }
          })
        })
      }
      return value
    })
  }, [])

  const ParserSelector = () => (
    <div style={{ display: 'flex', marginTop: readonlyBaseTemplate ? '' : '32px' }}>
      {readonlyBaseTemplate ? (
        <span style={{ margin: 'auto', fontWeight: 500 }}>
          解析器：{parserSelectors.filter(parser => parser.value === parserSelectorValue)[0]?.label}
        </span>
      ) : (
        <div style={{ width: 600, margin: 'auto' }}>
          <span style={{ marginRight: '20px' }}>解析器:</span>
          <Select
            size='large'
            placeholder='请选择解析器'
            style={{ width: 500 }}
            value={parserSelectorValue}
            onChange={changeParser}
            getPopupContainer={() => document.getElementsByClassName(styles.response_template)[0] as HTMLElement}
          >
            {parserSelectors.map(parser => {
              return (
                <Option key={parser.value} value={parser.value}>
                  {parser.label}
                </Option>
              )
            })}
          </Select>
        </div>
      )}
    </div>
  )

  // 动态同步表格高度
  const [prevHeight, setPrevHeight] = useState([
    [65, 65, 65],
    [65, 65, 65],
    [65, 65, 65],
    [65, 65, 65]
  ])
  const resize = (height: number, index: number, j: number) => {
    const res = prevHeight
    if (height !== Math.max(...res[index])) {
      res[index][j] = height
      setPrevHeight(res)
    }
  }

  const calculateCorrectHeight = (h: number[]) => {
    let max = Math.max(...h)
    if (max < 65) max = 65
    return max + 55
  }

  const ListKeyNames = (
    <div className={styles.block_wrapper}>
      <div
        style={{ width: '109px', padding: '30px 30px', height: `${calculateCorrectHeight(prevHeight[0])}px` }}
        className={`${styles.base} ${styles.title_name}`}
      >
        <span className={styles.tableHeader}>名称</span>
      </div>
      <div
        style={{ width: '109px', padding: '30px 30px', height: `${calculateCorrectHeight(prevHeight[1])}px` }}
        className={`${styles.base} ${styles.title_size}`}
      >
        <span className={styles.tableHeader}>字节</span>
      </div>
      <div
        style={{ width: '109px', padding: '30px 20px', height: `${calculateCorrectHeight(prevHeight[2])}px` }}
        className={`${styles.base} ${styles.title_size}`}
      >
        <span className={styles.tableHeader}>期望值</span>
      </div>

      <div
        style={{
          width: '109px',
          display: 'flex',
          alignItems: 'center',
          padding: '35px 20px',
          height: +`${calculateCorrectHeight(prevHeight[3])}` + 144
        }}
        className={`${styles.base} ${styles.title_size}`}
      >
        <span style={{ display: 'inlineBlock' }}>匹配规则</span>
      </div>
    </div>
  )

  const nameRenderFn = useCallback(() => {
    return (
      <>
        {!readonlyBaseTemplate && <StepTag step='3' />}
        <span style={{ marginLeft: '12px' }}>解析模板配置</span>
      </>
    )
  }, [readonlyBaseTemplate])

  return (
    <>
      <MainBorder wrapperClass={styles.template_wrapper} name={nameRenderFn}>
        {!loading && (
          <div className={styles.response_template}>
            {!readonlyBaseTemplate && (
              <div className={styles.add_section} role='button' tabIndex={0} onClick={() => addBlock(responseTemplateList.length)}>
                <img src={AddIcon} alt='add' />
              </div>
            )}

            {ifNeedConfigName && (
              <TitleInput
                defaultTitle='请输入响应模板名称'
                readonly={readonlyBaseTemplate}
                value={responseTemplateName}
                onChange={setResponseTemplateName}
              />
            )}

            {ParserSelector()}

            <div className={styles.template_body_wrapper}>
              <div ref={bodyWrapper} className={styles.template_body}>
                {/* 响应模板有若干个成对参数，Name 和 Key，先渲染标题，在循环渲染自定义输入框 */}
                {ListKeyNames}
                {/* 循环渲染自定义输入框 */}
                {responseTemplateList.map((responseTemplate, responseTemplateIndex) => {
                  return (
                    <div key={responseTemplate.hash} className={styles.block_wrapper}>
                      {/* 自定义输入框 */}
                      <ResponseTemplateListItem
                        value={responseTemplate.name}
                        index={responseTemplate.hash}
                        onChange={updateResponseTemplate}
                        style={{ height: `${calculateCorrectHeight(prevHeight[0])}px` }}
                        attr='name'
                        readonly={readonlyBaseTemplate}
                        resize={h => resize(h, 0, responseTemplateIndex)}
                      />
                      <ResponseTemplateListItem
                        value={responseTemplate.size}
                        index={responseTemplate.hash}
                        onChange={updateResponseTemplate}
                        style={{ height: `${calculateCorrectHeight(prevHeight[1])}px` }}
                        attr='size'
                        readonly={readonlyBaseTemplate}
                        resize={h => resize(h, 1, responseTemplateIndex)}
                      />
                      <ResponseTemplateListItem
                        value={responseTemplate.value}
                        index={responseTemplate.hash}
                        onChange={updateResponseTemplate}
                        style={{ height: `${calculateCorrectHeight(prevHeight[2])}px` }}
                        attr='value'
                        readonly={readonlyBaseTemplate}
                        resize={h => resize(h, 2, responseTemplateIndex)}
                      />
                      <MoreOpationsComponent
                        rules={responseTemplate.rules}
                        index={responseTemplate.hash}
                        onChange={updateResponseTemplate}
                        optionStatus={editOriginalTemplate}
                        style={{ height: +`${calculateCorrectHeight(prevHeight[3])}` + 144 }}
                        attr='rules'
                        readonly={readonlyBaseTemplate}
                        resize={h => resize(h, 3, responseTemplateIndex)}
                        parserSelectorValue={parserSelectorValue}
                      />

                      {/* 顶部位置增加和删除操作工具栏 */}
                      {!readonlyBaseTemplate && ListItemActionBar(responseTemplateIndex)}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className={styles.footerOpations}>
              <StepSection onClickCallback={nextStep} label={editOriginalTemplate ? '修改' : '创建'} readonly={readonlyBaseTemplate} />
            </div>
          </div>
        )}
      </MainBorder>
      {/* <div className={styles.template_btn}>
        <StepSection onClickCallback={nextStep} label={editOriginalTemplate ? '修改' : '创建'} readonly={readonlyBaseTemplate} />
      </div> */}
    </>
  )
}

export default withRouter(CreateResponseTemplateComponent)
