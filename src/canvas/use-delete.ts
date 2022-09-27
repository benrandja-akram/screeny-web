import { useEffect } from 'react'

function useDelete({ canvasRef }: Args) {
  useEffect(() => {
    const canvas = canvasRef.current!

    function onWindowKeyDown(e: KeyboardEvent) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
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
