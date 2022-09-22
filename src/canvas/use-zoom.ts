import { useEffect } from 'react'
import { fabric } from 'fabric'

function useZoom(canvasRef: React.MutableRefObject<fabric.Canvas | undefined>) {
  useEffect(() => {
    const canvas = canvasRef.current!
    function onWheel(opt: fabric.IEvent<WheelEvent>) {
      if (opt.e.ctrlKey) {
        opt.e.preventDefault()
        opt.e.stopPropagation()

        let zoom = canvas.getZoom()
        zoom *= 0.999 ** opt.e.deltaY
        if (zoom > 20) zoom = 20
        if (zoom < 0.01) zoom = 0.01
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)
      }
    }

    canvas.on('mouse:wheel', onWheel)
    return () => {
      canvas.off('mouse:wheel', onWheel as any)
    }
  }, [canvasRef])
}

export { useZoom }
