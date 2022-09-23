import { useEffect } from 'react'
import { fabric } from 'fabric'
import { Args } from '../types'

function useRect({ canvasRef, tool, onFinish, save }: Args) {
  useEffect(() => {
    const canvas = canvasRef.current!
    let isDown = false
    let x = 0
    let y = 0
    let rect: fabric.Rect

    function onMouseDown(evt: fabric.IEvent<MouseEvent>) {
      isDown = true
      x = evt.absolutePointer!.x
      y = evt.absolutePointer!.y

      rect = new fabric.Rect({
        left: x,
        top: y,
        fill: '#00000001',
        stroke: 'black',
        strokeWidth: 4,
        perPixelTargetFind: true,
        strokeUniform: true,
        objectCaching: false,
        rx: 2,
        ry: 2,
        borderOpacityWhenMoving: 0,
      })

      canvas.add(rect)
      canvas.renderAll()
      canvas.setActiveObject(rect)
    }

    function onMouseMove(evt: fabric.IEvent<MouseEvent>) {
      if (!isDown) return

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

      canvas.renderAll()
    }

    function onMouseUp(evt: fabric.IEvent<MouseEvent>) {
      if (isDown) {
        isDown = false
        onFinish()
        save()
      }
    }

    function onObjectScaling(evt: fabric.IEvent<MouseEvent>) {
      if (evt.target?.type === 'rect') {
        if (evt.target?.scaleX !== 1 || evt.target?.scaleY !== 1) {
          evt.target
            ?.set('rx' as any, 2 / evt.target!.scaleX!)
            .set('ry' as any, 2 / evt.target!.scaleY!)
        }
      }
    }

    if (tool === 'rect') {
      canvas.on('mouse:down', onMouseDown)
      canvas.on('mouse:move', onMouseMove)
      canvas.on('mouse:up', onMouseUp)
      canvas.on('object:scaling', onObjectScaling as any)

      return () => {
        canvas.off('mouse:down', onMouseDown as any)
        canvas.off('mouse:move', onMouseMove as any)
        canvas.off('mouse:up', onMouseUp as any)
        canvas.off('object:scaling', onObjectScaling as any)
      }
    } else {
      canvas.on('object:scaling', onObjectScaling as any)

      return () => {
        canvas.off('object:scaling', onObjectScaling as any)
      }
    }
  }, [canvasRef, tool, onFinish, save])
}

export { useRect }
