import { useEffect, useRef, useState } from "react"

export const useCanvas = () => {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(18)
  const [brushColor, setBrushColor] = useState("#ffa500")

  const [isRainbow, setIsRainbow] = useState(false)
  const [hue, setHue] = useState(0)
  const [isEraser, setIsEraser] = useState(false)
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])

  useEffect(() => {
    fillWhite()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = brushSize
    if (!isEraser) {
      ctx.strokeStyle = brushColor
    }
  }, [brushSize, brushColor, isEraser])

  const startDrawing = e => {
    setIsDrawing(true)
    ctxRef.current.beginPath()
    if (isRainbow) return
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
  }

  const draw = e => {
    if (!isDrawing) return
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    ctxRef.current.stroke()
    if (isRainbow) {
      ctxRef.current.beginPath()
      ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      ctxRef.current.stroke()
      ctxRef.current.strokeStyle = `hsl(${hue}, 100%, 50%)`
      setHue(hue + 1)
      if (hue >= 360) setHue(0)
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    ctxRef.current.closePath()

    const canvas = canvasRef.current
    setUndoStack(prevState => [...prevState, ctxRef.current.getImageData(0, 0, canvas.width, canvas.height)])
    setRedoStack([])
  }

  const handleBrushSize = e => {
    setBrushSize(parseInt(e.target.value))
  }

  const handleBrushColor = e => {
    setBrushColor(e.target.value)
    setIsEraser(false)
    setIsRainbow(false)
  }

  const handleRainbow = () => {
    if (!isRainbow) {
      setIsRainbow(true)
      setIsEraser(false)
    } else {
      setIsRainbow(false)
    }      
  }

  const handleEraser = () => {
    if (!isEraser) {
      setIsEraser(true)
      setIsRainbow(false)
      ctxRef.current.strokeStyle = "white"
    } else {
      setIsEraser(false)
      ctxRef.current.strokeStyle = brushColor
    }
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return
    const redoState = undoStack.pop()
    setRedoStack(prevState => [...prevState, redoState])
    
    setUndoStack([...undoStack])
    const currentState = undoStack[undoStack.length - 1]
    ctxRef.current.putImageData(currentState, 0, 0)
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const currentState = redoStack.pop()
    setRedoStack([...redoStack])
    setUndoStack(prevState => [...prevState, currentState])
    ctxRef.current.putImageData(currentState, 0, 0)
  }

  const handleClear = () => {
    fillWhite()
  }

  const handleSave = () => {
    const link = document.createElement("a")
    link.href = canvasRef.current.toDataURL("image/png")
    link.download = "image.png"
    link.click()
  }

  const fillWhite = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctxRef.current = ctx
    ctxRef.current.fillStyle = "white"
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height)

    setUndoStack(prevState => [...prevState, ctxRef.current.getImageData(0, 0, canvas.width, canvas.height)])
    setRedoStack([])
  }

  return {
    canvasRef, startDrawing, draw, stopDrawing,
    brushColor, handleBrushColor, brushSize, handleBrushSize,
    isRainbow, handleRainbow, isEraser, handleEraser,
    handleUndo, handleRedo, handleClear, handleSave
  }
}