import { fabric } from 'fabric'
import { setupShapeControls } from '../utils/setup-shape-controls'
import { useDrag } from './use-drag'

function useLine({ canvasRef, tool, onFinish, save }: Args) {
  useDrag<fabric.Polygon>({
    canvasRef,
    tool,
    onFinish,
    save,
    isActive() {
      return tool === 'line'
    },
    onMouseDown(evt, { x, y }) {
      const poly = new fabric.Polygon(
        [new fabric.Point(x, y), new fabric.Point(x, y)],
        {
          left: x,
          top: y,
          stroke: '#0f172a',
          strokeWidth: 4,
          perPixelTargetFind: true,
          strokeUniform: true,
          objectCaching: false,
          borderOpacityWhenMoving: 0,
          hasBorders: false,
          originX: 'center',
          originY: 'center',
        }
      )

      setupShapeControls(canvasRef.current!, poly)

      return poly
    },
    onMouseMove(evt, { shape: poly }) {
      poly.points![1].x = evt.absolutePointer!.x
      poly.points![1].y = evt.absolutePointer!.y
      // @ts-ignore
      poly._setPositionDimensions({})
      poly.setCoords()
    },
  })
}

export { useLine }
