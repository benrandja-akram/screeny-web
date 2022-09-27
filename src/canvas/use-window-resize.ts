import { useEffect } from 'react'

function useWindowResize({ canvasRef }: Args) {
  useEffect(() => {
    const canvas = canvasRef.current!

    function onResize() {
      canvas.setWidth(window.innerWidth)
      canvas.setHeight(window.innerHeight)

      canvas.requestRenderAll()
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [canvasRef])
}

export { useWindowResize }
