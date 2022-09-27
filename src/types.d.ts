type Args = {
  canvasRef: React.MutableRefObject<fabric.Canvas | undefined>
  tool: string
  onFinish: () => void
  save: () => void
}
