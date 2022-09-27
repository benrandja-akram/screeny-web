import { useEffect } from 'react'

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

  useEffect(() => {
    const canvas = canvasRef.current!

    function onSelectionCreated() {
      if (!['polygon'].includes(canvas.getActiveObject().type!)) {
        canvas.getActiveObject().perPixelTargetFind = false
      }
    }
    function onSelectionCleared(evt: fabric.IEvent) {
      // @ts-ignore
      evt.deselected?.forEach(
        (obj: fabric.Object) => (obj.perPixelTargetFind = true)
      )
    }

    canvas.on('selection:created', onSelectionCreated)
    canvas.on('selection:cleared', onSelectionCleared)

    return () => {
      canvas.off('selection:created', onSelectionCreated)
      canvas.off('selection:cleared', onSelectionCleared)
    }
  }, [canvasRef])
}

export { useSelect }
