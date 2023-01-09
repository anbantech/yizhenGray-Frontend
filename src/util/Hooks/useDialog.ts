import { useBoolean } from './useBoolean'

export function useDialog() {
  const { value, setFalse, setValue, setTrue } = useBoolean()
  return { visible: value, openDialog: setTrue, closeDialog: setFalse, changeDialogStatus: setValue }
}
