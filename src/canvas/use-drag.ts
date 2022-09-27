import { useEffect } from 'react'
import { fabric } from 'fabric'
import { useCallbackRef } from '../utils'

type DragArgs<T extends fabric.Object> = Args & {
  isActive(): boolean
  onMouseDown(
    evt: fabric.IEvent<MouseEvent>,
    infos: { x: number; y: number }
  ): T
  onMouseMove(
    evt: fabric.IEvent<MouseEvent>,
    infos: { x: number; y: number; shape: T }
  ): void
  onMouseUp?(evt: fabric.IEvent<MouseEvent>): void
}

function useDrag<T extends fabric.Object>({
  canvasRef,
  tool,
  onFinish,
  save,
  ...events
}: DragArgs<T>) {
  const onDown = useCallbackRef(events.onMouseDown)
  const onMove = useCallbackRef(events.onMouseMove)
  const onUp = useCallbackRef(events.onMouseUp)
  const isActive = useCallbackRef(events.isActive)

  useEffect(() => {
    const canvas = canvasRef.current!
    let isDown = false
    let x = 0
    let y = 0
    let shape: T

    function onMouseDown(evt: fabric.IEvent<MouseEvent>) {
      isDown = true
      x = evt.absolutePointer!.x
      y = evt.absolutePointer!.y

      shape = onDown(evt, { x, y })

      canvas.add(shape)
      canvas.renderAll()
    }

    function onMouseMove(evt: fabric.IEvent<MouseEvent>) {
      if (!isDown) return

      onMove(evt, { x, y, shape })
      canvas.renderAll()
    }

    function onMouseUp(evt: fabric.IEvent<MouseEvent>) {
      if (isDown) {
        isDown = false
        onFinish()
        save()

        canvas.setActiveObject(shape)
        onUp?.(evt)
      }
    }

    if (isActive()) {
      canvas.on('mouse:down', onMouseDown)
      canvas.on('mouse:move', onMouseMove)
      canvas.on('mouse:up', onMouseUp)

      return () => {
        canvas.off('mouse:down', onMouseDown as any)
        canvas.off('mouse:move', onMouseMove as any)
        canvas.off('mouse:up', onMouseUp as any)
      }
    }
  }, [canvasRef, tool, onFinish, save, isActive, onDown, onMove, onUp])
}

export { useDrag }
