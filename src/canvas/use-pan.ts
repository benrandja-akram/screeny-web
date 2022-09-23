import React, { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { Args } from '../types'

function usePan({ canvasRef,  }: Args): React.ComponentProps<'div'> {
  const mouseRef = useRef({} as any)

  useEffect(() => {
    const canvas = canvasRef.current!
    function onWheel(evt: fabric.IEvent<WheelEvent>) {
      if (evt.e.ctrlKey) return
      const vpt = canvas.viewportTransform!
      vpt[5] -= evt.e.deltaY
      canvas.requestRenderAll()
    }
    canvas.on('mouse:wheel', onWheel)

    return () => {
      canvas.off('mouse:wheel', onWheel as any)
    }
  }, [canvasRef])

  // return div props to be injected into the canvas wrapper because fabric does not support mouse wheel click
  return {
    onMouseDown(evt) {
      if (evt.button !== 1) return

      mouseRef.current.isDown = true
      mouseRef.current.lastPosX = evt.clientX
      mouseRef.current.lastPosY = evt.clientY
    },
    onMouseMove(evt) {
      if (!mouseRef.current.isDown) return
      const canvas = canvasRef.current!

      const vpt = canvas.viewportTransform!
      vpt[4] += evt.clientX - mouseRef.current.lastPosX
      vpt[5] += evt.clientY - mouseRef.current.lastPosY
      canvas.requestRenderAll()
      mouseRef.current.lastPosX = evt.clientX
      mouseRef.current.lastPosY = evt.clientY
    },
    onMouseUp() {
      const canvas = canvasRef.current!

      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      canvas.setViewportTransform(canvas.viewportTransform!)
      mouseRef.current.isDown = false
      canvas.requestRenderAll()
    },
  }
}

export { usePan }
