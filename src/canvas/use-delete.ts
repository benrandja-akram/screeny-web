import { useEffect } from 'react'

function useDelete(
  canvasRef: React.MutableRefObject<fabric.Canvas | undefined>
) {
  useEffect(() => {
    const canvas = canvasRef.current!

    function onWindowKeyDown(e: KeyboardEvent) {
      if (e.key === 'Delete') {
        canvas.remove(...canvas.getActiveObjects())
        canvas.discardActiveObject()
      }
    }

    window.addEventListener('keydown', onWindowKeyDown)

    return () => {
      window.removeEventListener('keydown', onWindowKeyDown)
    }
  }, [canvasRef])
}

export { useDelete }
