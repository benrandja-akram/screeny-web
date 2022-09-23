import { useEffect } from 'react'
import { fabric } from 'fabric'
import { Args } from '../types'

function useText({ canvasRef, tool, onFinish, save }: Args) {
  useEffect(() => {
    const canvas = canvasRef.current!

    function onMouseDown(evt: fabric.IEvent<MouseEvent>) {
      const text = new fabric.Textbox('', {
        width: 32,
        fontSize: 24,
        left: evt.absolutePointer!.x,
        top: evt.absolutePointer!.y - 12,
      })
        .setControlVisible('mb', false)
        .setControlVisible('mt', false)
      canvas.add(text)
      onFinish()

      canvas.setActiveObject(text)
      // @ts-ignore
      text.enterEditing()
      canvas.requestRenderAll()
      save()
    }

    if (tool === 'text') {
      canvas.on('mouse:down', onMouseDown)

      return () => {
        canvas.off('mouse:down', onMouseDown as any)
      }
    }
  }, [canvasRef, tool, onFinish, save])
}

export { useText }
