import { useState } from 'react'

interface useMenuType {
  visibility: boolean
  deleteVisibility: boolean
  spinnig: boolean
  chioceModalStatus: (val: boolean) => void
  CommonModleClose: (val: boolean) => void
  chioceBtnLoading: (val: boolean) => void
}

function useMenu(): useMenuType {
  const [visibility, setVisibility] = useState(false)
  const chioceModalStatus = (val: boolean) => {
    setVisibility(val)
  }

  const [deleteVisibility, setDeleteVisibility] = useState(false)
  const CommonModleClose = (value: boolean) => {
    setDeleteVisibility(value)
  }

  const [spinnig, setSpinning] = useState(false)
  const chioceBtnLoading = (val: boolean) => {
    setSpinning(val)
  }
  return { visibility, chioceModalStatus, deleteVisibility, CommonModleClose, spinnig, chioceBtnLoading }
}

export default useMenu
