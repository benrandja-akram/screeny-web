import { useEffect } from 'react'

function useSaveCanvas({ canvasRef }: Args) {
  useEffect(() => {
    function onSave() {
      const canvas = canvasRef.current!
      try {
        localStorage.setItem(
          'whiteboard',
          JSON.stringify(canvas.toJSON() ?? {})
        )
      } catch (error) {
        console.error(error)
      }
    }

    window.addEventListener('visibilitychange', onSave)
    const id = setInterval(onSave, 1000)

    return () => {
      window.removeEventListener('visibilitychange', onSave)
      clearInterval(id)
    }
  }, [canvasRef])
}

export { useSaveCanvas }
