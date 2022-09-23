import { useEffect } from 'react'
import { fabric } from 'fabric'
import { getStroke } from 'perfect-freehand'

type Point = {
  x: number
  y: number
}

function getSvgPathFromStroke(stroke: any) {
  if (!stroke.length) return ''

  const d = stroke.reduce(
    // @ts-ignore
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q']
  )

  d.push('Z')
  return d.join(' ')
}

const options = {
  size: 8,
  thinning: 0.5,
  smoothing: 1,
  streamline: 0.5,
  easing: (t: any) => t,
  start: {
    taper: 0,
    easing: (t: any) => t,
    cap: true,
  },
  end: {
    taper: 15,
    easing: (t: any) => t,
    cap: true,
  },
}

function useFreeDrawing(
  canvasRef: React.MutableRefObject<fabric.Canvas | undefined>,
  tool: string
) {
  useEffect(() => {
    const canvas = canvasRef.current!
    let isDown = false
    let points: Point[] = []
    let lastObject: fabric.Object | undefined

    function onMouseDown(evt: fabric.IEvent<MouseEvent>) {
      isDown = true
      points.push(evt.absolutePointer!)
    }

    function onMouseMove(evt: fabric.IEvent<MouseEvent>) {
      if (!isDown) return
      points.push(evt.absolutePointer!)
      const stroke = getStroke(points, options)
      const pathData = getSvgPathFromStroke(stroke)
      const svg = `<svg fill="black"><path d="${pathData}" /></svg>`

      fabric.loadSVGFromString(svg, function (objects, options) {
        const obj = fabric.util.groupSVGElements(objects, options)
        canvas.remove(lastObject!)
        lastObject = obj
        obj.selectable = false
        obj.evented = false
        obj.perPixelTargetFind = true
        canvas.add(obj).requestRenderAll()
      })
    }

    function onMouseUp() {
      if (isDown) {
        isDown = false
        points = []
        lastObject = undefined
      }
    }

    if (tool === 'free-drawing') {
      canvas.on('mouse:down', onMouseDown)
      canvas.on('mouse:move', onMouseMove)
      canvas.on('mouse:up', onMouseUp)

      return () => {
        canvas.off('mouse:down', onMouseDown as any)
        canvas.off('mouse:move', onMouseMove as any)
        canvas.off('mouse:up', onMouseUp as any)
      }
    }
  }, [canvasRef, tool])
}

export { useFreeDrawing }
