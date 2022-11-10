import { useState, useCallback } from 'react'

export const useBoolean = (defaultValue?: boolean) => {
  const [value, setValue] = useState(!!defaultValue)

  const setTrue = useCallback(() => setValue(true), [])

  const setFalse = useCallback(() => setValue(false), [])

  return { value, setTrue, setFalse, setValue }
}
