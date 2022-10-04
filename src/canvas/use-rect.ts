import { useEffect } from 'react'
import { fabric } from 'fabric'
import { useDrag } from './use-drag'

function useRect({ canvasRef, tool, onFinish, save }: Args) {
  useDrag<fabric.Rect>({
    canvasRef,
    tool,
    onFinish,
    save,
    isActive() {
      return tool === 'rect'
    },
    onMouseDown(evt, { x, y }) {
      return new fabric.Rect({
        left: x,
        top: y,
        fill: '#00000001',
        stroke: '#0f172a',
        strokeWidth: 4,
        perPixelTargetFind: true,
        strokeUniform: true,
        objectCaching: false,
        rx: 2,
        ry: 2,
        borderOpacityWhenMoving: 0,
      })
    },
    onMouseMove(evt, { x, y, shape: rect }) {
      const w = Math.abs(evt.absolutePointer!.x - x)
      const h = Math.abs(evt.absolutePointer!.y - y)

      if (!w || !h) {
        return false
      }

      rect
        .set('width', w)
        .set('height', h)
        .set('left', Math.min(x, evt.absolutePointer!.x))
        .set('top', Math.min(y, evt.absolutePointer!.y))
        .setCoords()
    },
  })
  useEffect(() => {
    const canvas = canvasRef.current!

    function onObjectScaling(evt: fabric.IEvent<MouseEvent>) {
      if (evt.target?.type === 'rect') {
        if (evt.target?.scaleX !== 1 || evt.target?.scaleY !== 1) {
          evt.target
            ?.set('rx' as any, 2 / evt.target!.scaleX!)
            .set('ry' as any, 2 / evt.target!.scaleY!)
        }
      }
    }

    canvas.on('object:scaling', onObjectScaling as any)

    return () => {
      canvas.off('object:scaling', onObjectScaling as any)
    }
  }, [canvasRef, tool, onFinish, save])
}

export { useRect }
