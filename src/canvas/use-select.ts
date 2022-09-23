import { useEffect } from 'react'
import { Args } from '../types'

function useSelect({ canvasRef, tool }: Args) {
  useEffect(() => {
    const canvas = canvasRef.current!
    if (tool === 'select') {
      canvas.getObjects().map((obj) => {
        obj.selectable = true
        obj.evented = true
      })
      canvas.selection = true
    } else {
      canvas.discardActiveObject()
      canvas.getObjects().map((obj) => {
        obj.selectable = false
        obj.evented = false
      })
      canvas.selection = false

      canvas.requestRenderAll()
    }
  }, [canvasRef, tool])
}

export { useSelect }
