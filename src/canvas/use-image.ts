import { useRef } from 'react'
import { fabric } from 'fabric'

function useImage({
  canvasRef,
  save,
}: Args): [React.ComponentProps<'button'>, React.ComponentProps<'input'>] {
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
      value: '',
      onChange(evt) {
        const file = evt.target.files?.item(0)
        const reader = new FileReader()
        reader.onload = () => {
          const url = reader.result as string

          fabric.Image.fromURL(url, (img) => {
            img.scaleToWidth(Math.min(window.innerWidth / 4, img.width!))
            canvasRef.current?.add(img)
            img.center()
            canvasRef.current?.setActiveObject(img)
            save()
          })
        }

        if (file) {
          reader.readAsDataURL(file)
        }
      },
    },
  ]
}

export { useImage }
