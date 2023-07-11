import dragImg from 'Src/assets/drag/icon_drag.png'
import deleteImage from 'Src/assets/image/icon_detail.svg'
import { generateUUID } from 'Src/util/common'
import AgreementComponents from './agreementCompoents'

const StringComponents = {
  type: 'StringComponents',
  title: '字节流',
  key: generateUUID(),
  imgTitleSrc: dragImg,
  deleteImg: deleteImage,
  ButtonStyle: { width: '74px', height: '26px', borderRadius: '4px', cursor: 'move' },
  Components: AgreementComponents
}

const IntComponents = {
  type: 'IntComponents',
  title: '整数',
  key: generateUUID(),
  imgTitleSrc: dragImg,
  deleteImg: deleteImage,
  ButtonStyle: { width: '60px', height: '26px', borderRadius: '4px', cursor: 'move' },
  Components: AgreementComponents
}
const IntArrayComponents = {
  type: 'IntArrayComponents',
  title: '整数数组',
  key: generateUUID(),
  imgTitleSrc: dragImg,
  deleteImg: deleteImage,
  ButtonStyle: { width: '88px', height: '26px', borderRadius: '4px', cursor: 'move' },
  Components: AgreementComponents
}

const ComponentsArray = [StringComponents, IntComponents, IntArrayComponents]

export { StringComponents, IntComponents, IntArrayComponents, ComponentsArray }
