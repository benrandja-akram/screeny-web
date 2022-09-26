import { useCallback, useEffect, useRef, useState } from 'react'
import type { NextPage } from 'next'
import { fabric } from 'fabric'

import {
  useCircle,
  useDelete,
  useFreeDrawing,
  usePan,
  useRect,
  useSelect,
  useText,
  useWindowResize,
  useZoom,
  useImage,
  useSaveCanvas,
  HistoryManager,
} from '../canvas'
import {
  RiCursorFill,
  TbRectangle,
  TbArrowCurveLeft,
  MdOutlineTextFields,
  MdOutlineCircle,
  BiEditAlt,
  BiImageAdd,
  AiOutlineLine,
  BiUndo,
  BiRedo,
  BiZoomOut,
  BiZoomIn,
} from '../icons'
import { IconButton } from '../components'
import { Args } from '../types'

const Home: NextPage = () => {
  const [tool, setTool] = useState('select')
  const canvasRef = useRef<fabric.Canvas>()
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const canSaveRef = useRef(true)
  const historyManager = useRef(new HistoryManager())

  useEffect(() => {
    canvasRef.current = new fabric.Canvas(canvasEl.current!, {
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const canvas = canvasRef.current!

    fabric.Object.prototype.cornerSize = 9
    fabric.Object.prototype.cornerColor = 'white'
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerStrokeColor = '#0d99ff'
    fabric.Object.prototype.borderColor = '#0d9affa0'

    const save = () => {
      if (canSaveRef.current) {
        historyManager.current.push(canvas.toJSON())
      }
    }
    function onRemove(evt: fabric.IEvent) {
      // @ts-ignore
      if (!evt.target?.fromSVG) {
        save()
      }
    }
    function onSelectionCreated() {
      canvas.getActiveObject().perPixelTargetFind = false
    }
    function onSelectionCleared(evt: fabric.IEvent) {
      // @ts-ignore
      evt.deselected?.forEach(
        (obj: fabric.Object) => (obj.perPixelTargetFind = true)
      )
    }
    canvas.on('object:modified', save)
    canvas.on('object:removed', onRemove)
    canvas.on('selection:created', onSelectionCreated)
    canvas.on('selection:cleared', onSelectionCleared)

    return () => {
      canvas.off('object:modified', save)
      canvas.off('object:removed', onRemove)
      canvas.off('selection:created', onSelectionCreated)
      canvas.off('selection:cleared', onSelectionCleared)

      canvas.dispose()
    }
  }, [])

  const options: Args = {
    canvasRef,
    tool,
    onFinish: useCallback(() => {
      setTool('select')
    }, []),
    save: useCallback(() => {
      historyManager.current.push(canvasRef.current!.toJSON())
    }, []),
  }

  // tools
  const whiteboardProps = usePan(options)
  useZoom(options)
  useWindowResize(options)
  useDelete(options)
  useSaveCanvas(options)

  useSelect(options)
  useRect(options)
  useCircle(options)
  useText(options)
  useFreeDrawing(options)
  const [btnProps, inputProps] = useImage(options)

  return (
    <div className="bg-gray-100">
      <header className="fixed top-2 left-[50%] z-10 flex h-14 -translate-x-[50%] space-x-2 rounded-lg bg-white p-2 shadow">
        <IconButton
          isActive={tool === 'select'}
          onClick={() => setTool('select')}
        >
          <RiCursorFill size={22} />
        </IconButton>
        <IconButton isActive={tool === 'rect'} onClick={() => setTool('rect')}>
          <TbRectangle size={24} />
        </IconButton>
        <IconButton
          isActive={tool === 'circle'}
          onClick={() => setTool('circle')}
        >
          <MdOutlineCircle size={24} />
        </IconButton>

        <IconButton isActive={tool === 'line'} onClick={() => setTool('line')}>
          <AiOutlineLine size={28} className="rotate-45" />
        </IconButton>
        <IconButton
          isActive={tool === 'arrow'}
          onClick={() => setTool('arrow')}
        >
          <TbArrowCurveLeft size={22} />
        </IconButton>
        <IconButton isActive={tool === 'text'} onClick={() => setTool('text')}>
          <MdOutlineTextFields size={22} />
        </IconButton>
        <IconButton
          isActive={tool === 'free-drawing'}
          onClick={() => setTool('free-drawing')}
        >
          <BiEditAlt size={24} />
        </IconButton>
        <IconButton
          {...btnProps}
          onClick={(evt) => {
            btnProps.onClick?.(evt)
            setTool('select')
          }}
        >
          <BiImageAdd size={24} />
        </IconButton>
        <input {...inputProps} />
      </header>
      <header className="fixed top-2 right-4 z-10 flex items-center rounded-lg bg-white p-1 px-2 shadow">
        <div className="flex space-x-1">
          <IconButton
            size="small"
            onClick={() => {
              historyManager.current.undo()
              canSaveRef.current = false
              canvasRef.current!.loadFromJSON(
                historyManager.current.state ?? '{}',
                () => {
                  canvasRef.current?.getObjects().map((obj) => {
                    obj.selectable = canvasRef.current?.selection
                    obj.evented = canvasRef.current?.selection
                    obj.perPixelTargetFind = true
                  })
                  canSaveRef.current = true
                }
              )
            }}
          >
            <BiUndo size={22} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              historyManager.current.redo()
              canSaveRef.current = false
              canvasRef.current!.loadFromJSON(
                historyManager.current.state,
                () => {
                  canvasRef.current?.getObjects().map((obj) => {
                    obj.selectable = canvasRef.current?.selection
                    obj.evented = canvasRef.current?.selection
                    obj.perPixelTargetFind = true
                  })
                  canSaveRef.current = true
                }
              )
            }}
          >
            <BiRedo size={22} />
          </IconButton>
        </div>
        <div className="mx-3 h-4 w-px bg-gray-200" />
        <div className="flex space-x-1">
          <IconButton
            size="small"
            onClick={() => {
              if (canvasRef.current) {
                const center = canvasRef.current.getCenter()
                canvasRef.current.zoomToPoint(
                  new fabric.Point(center.left, center.top),
                  Math.max(0.01, canvasRef.current?.getZoom() - 0.1)
                )
              }
            }}
          >
            <BiZoomOut size={22} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              if (canvasRef.current) {
                const center = canvasRef.current.getCenter()
                canvasRef.current.zoomToPoint(
                  new fabric.Point(center.left, center.top),
                  Math.min(20, canvasRef.current?.getZoom() + 0.1)
                )
              }
            }}
          >
            <BiZoomIn size={22} />
          </IconButton>
        </div>
      </header>

      <div {...whiteboardProps}>
        <canvas ref={canvasEl} className="h-full w-full" />
      </div>
    </div>
  )
}

export default Home
