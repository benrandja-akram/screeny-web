import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { NextPage } from 'next'
import { fabric } from 'fabric'
import { debounce } from 'throttle-debounce'
import classNames from 'classnames'
import localforage from 'localforage'
import { LazyMotion, domAnimation, AnimatePresence, m } from 'framer-motion'

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
  useLine,
} from '../canvas'
import {
  RiCursorFill,
  TbRectangle,
  MdOutlineTextFields,
  MdOutlineCircle,
  BiEditAlt,
  BiImageAdd,
  BiUndo,
  BiRedo,
  BiZoomOut,
  BiZoomIn,
  AiOutlineLine,
} from '../icons'
import { ColorChooser, IconButton } from '../components'
import { useCallbackRef } from '../utils'
import { setupShapeControls } from '../utils/setup-shape-controls'

const Home: NextPage = () => {
  const [isMounted, rerender] = useReducer((c) => c + 1, 0)
  const [tool, setTool] = useState('select')
  const canvasRef = useRef<fabric.Canvas>()
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const canSaveRef = useRef(true)
  const historyManager = useRef(new HistoryManager())
  const saveDebounced = useMemo(
    () =>
      debounce(500, () =>
        historyManager.current.push(canvasRef.current!.toJSON())
      ),
    []
  )
  useEffect(() => {
    historyManager.current = new HistoryManager()
    canvasRef.current = new fabric.Canvas(canvasEl.current!, {
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const canvas = canvasRef.current!
    async function load() {
      const json = await localforage.getItem('whiteboard')
      if (json) {
        canSaveRef.current = false
        canvas.loadFromJSON(json, () => {
          resetObjects()
          canSaveRef.current = true

          const hManager = new HistoryManager(canvas.toJSON())
          historyManager.current = hManager
        })
      }
    }
    load()

    fabric.Object.prototype.cornerSize = 9
    fabric.Object.prototype.cornerColor = 'white'
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerStrokeColor = '#4285f4'
    fabric.Object.prototype.borderColor = '#4285f4'

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

    canvas.on('object:modified', save)
    canvas.on('object:removed', onRemove)
    rerender()
    return () => {
      canvas.off('object:modified', save)
      canvas.off('object:removed', onRemove)

      canvas.dispose()
    }
  }, [])

  const options: Args = {
    canvasRef,
    tool,
    onFinish: useCallbackRef(() => {
      setTool('select')
    }),
    save: useCallbackRef(() => {
      historyManager.current.push(canvasRef.current!.toJSON())
    }),
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
  useLine(options)
  useText(options)
  useFreeDrawing(options)
  const [btnProps, inputProps] = useImage(options)

  function resetObjects() {
    canvasRef.current?.getObjects().map((obj) => {
      obj.selectable = canvasRef.current?.selection
      obj.evented = canvasRef.current?.selection
      obj.objectCaching = false
      if (obj.type !== 'textbox') {
        obj.perPixelTargetFind = true
      }
      if (obj.type === 'polygon') {
        obj.hasBorders = false
        setupShapeControls(canvasRef.current!, obj as fabric.Polygon)
      }
    })
  }
  const activeObject = canvasRef.current?.getActiveObject()

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
                  resetObjects()
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
                  resetObjects()
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
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {activeObject &&
            ['rect', 'circle', 'polygon', 'path', 'textbox'].includes(
              activeObject.type!
            ) && (
              <m.aside
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 250, opacity: 0 }}
                className="fixed top-16 right-4 z-10 divide-y divide-slate-100 rounded-lg bg-white p-2 px-3 text-gray-700 shadow"
              >
                <div className="space-y-1.5 pb-3">
                  <div>Stroke</div>
                  <ColorChooser
                    selected={
                      ['path', 'textbox'].includes(activeObject.type!)
                        ? (activeObject.fill as string)
                        : (activeObject.stroke as string)
                    }
                    style={{
                      backgroundColor: 'white',
                      borderWidth: !['path', 'textbox'].includes(
                        activeObject.type!
                      )
                        ? activeObject.strokeWidth
                        : 4,
                    }}
                    onColorSelect={(color) => {
                      if (activeObject.type === 'path') {
                        activeObject.set('fill', color)
                      } else if (activeObject.type === 'textbox') {
                        activeObject.set('fill', color)
                      } else {
                        activeObject.set('stroke', color)
                      }
                      canvasRef.current?.requestRenderAll()
                      rerender()
                      historyManager.current.push(canvasRef.current!.toJSON())
                    }}
                  />
                </div>
                {!['path', 'polygon', 'textbox'].includes(
                  activeObject?.type!
                ) && (
                  <div className="space-y-1.5 py-2 pb-3">
                    <div>Fill</div>
                    <ColorChooser
                      selected={activeObject.fill as string}
                      style={{
                        borderWidth:
                          activeObject.type !== 'path'
                            ? activeObject.strokeWidth
                            : 4,
                      }}
                      onColorSelect={(color) => {
                        activeObject.set('fill', color)

                        canvasRef.current?.requestRenderAll()
                        rerender()
                        historyManager.current.push(canvasRef.current!.toJSON())
                      }}
                    />
                  </div>
                )}
                <div className="space-y-1.5 py-2">
                  <div>Opacity</div>
                  <input
                    type="range"
                    defaultValue={activeObject.opacity}
                    className="w-full cursor-pointer"
                    max={1}
                    step={0.01}
                    onChange={(evt) => {
                      activeObject.set('opacity', evt.target.valueAsNumber)
                      canvasRef.current?.requestRenderAll()
                      saveDebounced()
                    }}
                  />
                </div>
                {!['path', 'textbox'].includes(activeObject.type!) && (
                  <div className="space-y-3 py-2">
                    <div>Stroke size</div>
                    <div className="grid grid-cols-3 ">
                      {['S', 'M', 'L'].map((size, i) => (
                        <button
                          key={size}
                          className={classNames(
                            'h-7 w-10 rounded border border-gray-900 transition-all',
                            {
                              'ring ring-indigo-500 ring-offset-2':
                                activeObject.strokeWidth === (i + 1) * 2,
                            }
                          )}
                          onClick={() => {
                            activeObject.set('strokeWidth', (i + 1) * 2)
                            canvasRef.current?.requestRenderAll()
                            rerender()
                            historyManager.current.push(
                              canvasRef.current!.toJSON()
                            )
                          }}
                          style={{ borderWidth: (i + 1) * 2 }}
                        ></button>
                      ))}
                    </div>
                  </div>
                )}
              </m.aside>
            )}
        </AnimatePresence>
      </LazyMotion>

      <div
        {...whiteboardProps}
        className={classNames(
          'transition-all duration-1000',
          isMounted ? 'opacity-100' : 'opacity-0'
        )}
      >
        <canvas ref={canvasEl} className="h-full w-full" />
      </div>
    </div>
  )
}

export default Home
