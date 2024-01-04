export const ItemTypes = {
  BLOCK: [
    'bit_field',
    'byte',
    'bytes',
    'delim',
    'word',
    'dword',
    'qword',
    'group',
    'random',
    'static',
    'string',
    'checksum',
    'size',
    'block',
    'list',
    'json',
    'bool',
    'bit_string',
    'raw_bit'
  ],
  LEAF: 'leaf',
  LIST: ['string', 'static', 'delim', 'group', 'list', 'json', 'bool'],
  JSON_KEY: ['string', 'static', 'delim', 'group'],
  JSON_VALUE: ['string', 'static', 'delim', 'group', 'list', 'json', 'bool'],
  BIT_STRING: ['raw_bit']
}

export const blockNameList = new Set(['block', 'json', 'list', 'bit_string'])
export const shouldHaveChildrenBlockNameList = new Set(['block', 'bit_string'])

export const BlockTips = {
  BLOCK: 'block 可以包含任意原语，且至少包含一个子原语',
  JSON: `json 的 key 必须为 ${ItemTypes.JSON_KEY.join(', ')} 类型的原语；\njson 的 value 必须为 ${ItemTypes.JSON_VALUE.join(', ')} 类型的原语`,
  BIT_STRING: `bit_string 只能包含 ${ItemTypes.BIT_STRING.join(', ')} 原语，且至少包含一个子原语`,
  LIST: `list 可以包含 ${ItemTypes.LIST.join(', ')} 原语`
}
