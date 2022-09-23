import { useRef } from 'react'
import { fabric } from 'fabric'

function useImage(
  canvasRef: React.MutableRefObject<fabric.Canvas | undefined>
): [React.ComponentProps<'button'>, React.ComponentProps<'input'>] {
  const inputRef = useRef<HTMLInputElement>(null)
  return [
    {
      onClick() {
        inputRef.current?.click()
      },
    },
    {
      ref: inputRef,
      type: 'file',
      className: 'hidden',
      accept: 'image/*',
      onChange(evt) {
        const file = evt.target.files?.item(0)

        if (file) {
          const url = URL.createObjectURL(file)
          fabric.Image.fromURL(url, (img) => {
            img.scaleToWidth(Math.min(window.innerWidth / 4, img.width!))
            canvasRef.current?.add(img)
            canvasRef.current?.setActiveObject(img)
            img.center()
          })
        }
      },
    },
  ]
}

export { useImage }
