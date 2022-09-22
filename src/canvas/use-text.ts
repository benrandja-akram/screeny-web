import { useEffect } from 'react'
import { fabric } from 'fabric'

function useText(
  canvasRef: React.MutableRefObject<fabric.Canvas | undefined>,
  tool: string,
  onFinish: () => void
) {
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
    }

    if (tool === 'text') {
      canvas.on('mouse:down', onMouseDown)

      return () => {
        canvas.off('mouse:down', onMouseDown as any)
      }
    }
  }, [canvasRef, tool, onFinish])
}

export { useText }
