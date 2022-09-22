import { useEffect } from 'react'

function useSelect(
  canvasRef: React.MutableRefObject<fabric.Canvas | undefined>,
  tool: string
) {
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
