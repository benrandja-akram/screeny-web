import { useEffect, useReducer } from 'react'

function useSelect({ canvasRef, tool }: Args) {
  const [_, rerender] = useReducer((c) => c + 1, 0)

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

    function onSelectionChange() {
      if (!['polygon', 'textbox'].includes(canvas.getActiveObject().type!)) {
        canvas.getActiveObject().perPixelTargetFind = false
      }

      rerender()
    }
    function onSelectionCleared(evt: fabric.IEvent) {
      // @ts-ignore
      evt.deselected?.forEach((obj: fabric.Object) => {
        if (obj.type !== 'textbox') obj.perPixelTargetFind = true
      })

      rerender()
    }

    canvas.on('selection:created', onSelectionChange)
    canvas.on('selection:updated', onSelectionChange)
    canvas.on('selection:cleared', onSelectionCleared)

    return () => {
      canvas.off('selection:created', onSelectionChange)
      canvas.off('selection:updated', onSelectionChange)
      canvas.off('selection:cleared', onSelectionCleared)
    }
  }, [canvasRef])
}

export { useSelect }
