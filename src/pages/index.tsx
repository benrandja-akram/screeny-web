import { useCallback, useEffect, useRef, useState } from 'react'
import type { NextPage } from 'next'
import { fabric } from 'fabric'

import { useDelete, usePan, useRect, useSelect, useZoom } from '../canvas'
import { RiCursorFill, TbRectangle, MdOutlineTextFields } from '../icons'
import { IconButton } from '../components'

const Home: NextPage = () => {
  const [tool, setTool] = useState('select')
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

    return () => {
      canvasRef.current!.dispose()
    }
  }, [])

  // tools
  const whiteboardProps = usePan(canvasRef)
  useSelect(canvasRef, tool)
  useZoom(canvasRef)
  useDelete(canvasRef)
  useRect(
    canvasRef,
    tool,
    useCallback(() => setTool('select'), [])
  )

  return (
    <div className="bg-gray-100">
      <header className="fixed top-2 left-[calc(100vw/2-200px)] z-10 flex h-14 w-[400px] space-x-2 rounded-lg bg-white p-2 shadow">
        <IconButton
          isActive={tool === 'select'}
          onClick={() => setTool('select')}
        >
          <RiCursorFill size={22} />
        </IconButton>
        <IconButton isActive={tool === 'rect'} onClick={() => setTool('rect')}>
          <TbRectangle size={22} />
        </IconButton>
        <IconButton isActive={tool === 'text'} onClick={() => setTool('text')}>
          <MdOutlineTextFields size={22} />
        </IconButton>
      </header>
      <div {...whiteboardProps}>
        <canvas ref={canvasEl} className="h-full w-full" />
      </div>
    </div>
  )
}

export default Home
