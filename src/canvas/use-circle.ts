import { useEffect } from 'react'
import { fabric } from 'fabric'

function useCircle(
  canvasRef: React.MutableRefObject<fabric.Canvas | undefined>,
  tool: string,
  onFinish: () => void
) {
  useEffect(() => {
    const canvas = canvasRef.current!
    let isDown = false
    let x = 0
    let y = 0
    let circle: fabric.Circle

    function onMouseDown(evt: fabric.IEvent<MouseEvent>) {
      isDown = true
      x = evt.absolutePointer!.x
      y = evt.absolutePointer!.y

      circle = new fabric.Circle({
        left: x,
        top: y,
        fill: '#ff00006e',
        stroke: 'red',
        strokeWidth: 4,
        perPixelTargetFind: true,
        strokeUniform: true,
        objectCaching: false,
      })

      canvas.add(circle)
      canvas.renderAll()
      canvas.setActiveObject(circle)
    }

    function onMouseMove(evt: fabric.IEvent<MouseEvent>) {
      if (!isDown) return

      const w = Math.abs(evt.absolutePointer!.x - x)
      const h = Math.abs(evt.absolutePointer!.y - y)

      if (!w || !h) {
        return false
      }

      circle
        .set('radius', Math.max(w / 2, h / 2))
        .set('left', Math.min(x, evt.absolutePointer!.x))
        .set('top', Math.min(y, evt.absolutePointer!.y))
        .setCoords()
      if (w > h) {
        circle.set('scaleY', h / w)
      }
      if (h > w) {
        circle.set('scaleX', w / h)
      }
      canvas.renderAll()
    }

    function onMouseUp(evt: fabric.IEvent<MouseEvent>) {
      if (isDown) {
        isDown = false
        onFinish()
      }
    }

    if (tool === 'circle') {
      canvas.on('mouse:down', onMouseDown)
      canvas.on('mouse:move', onMouseMove)
      canvas.on('mouse:up', onMouseUp)

      return () => {
        canvas.off('mouse:down', onMouseDown as any)
        canvas.off('mouse:move', onMouseMove as any)
        canvas.off('mouse:up', onMouseUp as any)
      }
    }
  }, [canvasRef, tool, onFinish])
}

export { useCircle }
