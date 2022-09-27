import { fabric } from 'fabric'
import { useDrag } from './use-drag'

function useCircle({ canvasRef, tool, onFinish, save }: Args) {
  useDrag<fabric.Circle>({
    canvasRef,
    tool,
    onFinish,
    save,
    isActive() {
      return tool === 'circle'
    },
    onMouseDown(evt, { x, y }) {
      return new fabric.Circle({
        left: x,
        top: y,
        fill: '#00000001',
        stroke: 'black',
        strokeWidth: 4,
        perPixelTargetFind: true,
        strokeUniform: true,
        objectCaching: false,
        borderOpacityWhenMoving: 0,
      })
    },
    onMouseMove(evt, { x, y, shape: circle }) {
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
    },
  })
}

export { useCircle }
