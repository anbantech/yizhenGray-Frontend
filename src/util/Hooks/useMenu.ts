import { useState } from 'react'

interface useMenuType {
  visibility: boolean
  deleteVisibility: boolean
  chioceModalStatus: (val: boolean) => void
  CommonModleClose: (val: boolean) => void
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

  return { visibility, chioceModalStatus, deleteVisibility, CommonModleClose }
}

export default useMenu
