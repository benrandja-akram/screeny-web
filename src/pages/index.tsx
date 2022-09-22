import { useEffect, useRef } from 'react'
import type { NextPage } from 'next'
import { fabric } from 'fabric'
import { useZoom } from '../canvas'

const Home: NextPage = () => {
  const canvasRef = useRef<fabric.Canvas>()
  const canvasEl = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    canvasRef.current = new fabric.Canvas(canvasEl.current!, {
      width: window.innerWidth,
      height: window.innerHeight,
    })

    fabric.Object.prototype.cornerSize = 9
    fabric.Object.prototype.cornerColor = 'white'
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerStrokeColor = '#0d99ff'
    fabric.Object.prototype.borderColor = '#0d9affa0'

    const canvas = canvasRef.current
    const circle = new fabric.Circle({
      radius: 20,
      fill: 'red',
    })
    canvas.add(circle)
    circle.center()

    return () => {
      canvas.dispose()
    }
  }, [])
  useZoom(canvasRef)

  return (
    <div className="w-screen h-screen">
      <canvas ref={canvasEl} className="w-full h-full" />
    </div>
  )
}

export default Home
