import { useCanvas } from "./useCanvas"
import rainbowIcon from "../assets/rainbow.svg"
import eraserIcon from "../assets/eraser.svg"
import undoIcon from "../assets/undo.svg"
import redoIcon from "../assets/redo.svg"
import clearIcon from "../assets/clear.svg"
import saveIcon from "../assets/save.svg"

const Canvas = () => {
  const {
    canvasRef, startDrawing, draw, stopDrawing,
    brushColor, handleBrushColor, brushSize, handleBrushSize,
    isRainbow, handleRainbow, isEraser, handleEraser,
    handleUndo, handleRedo, handleClear, handleSave
  } = useCanvas()

  return (
    <>
      <div className="toolbar">
        <label htmlFor="color">Color:</label>
        <input
          className="tool__color"
          id="color"
          type="color"
          value={brushColor}
          onChange={handleBrushColor}
          title="Brush Color"
        />
        <label htmlFor="size">Size:</label>
        <input 
          className="tool__size"
          id="size"
          type="number"
          value={brushSize}
          onChange={handleBrushSize}
          title="Brush Size"
        />
        <button className={isRainbow ? "tool__rainbow active" : "tool__rainbow"} onClick={handleRainbow} title="Rainbow Brush">
          <img src ={rainbowIcon} />
        </button>
        <button className={isEraser ? "tool__eraser active" : "tool__eraser"} onClick={handleEraser} title="Eraser">
          <img src={eraserIcon} />
        </button>
        <button className="tool__undo" onClick={handleUndo} title="Undo">
          <img src={undoIcon} />
        </button>
        <button className="tool__redo" onClick={handleRedo} title="Redo">
          <img src={redoIcon} />
        </button>
        <button className="tool__clear" onClick={handleClear} title="Clear Canvas">
          <img src={clearIcon} />
        </button>
        <button className="tool__save" onClick={handleSave} title="Save Image">
          <img src={saveIcon} />
        </button>
        <a href="https://github.com/Blankssssss" target="_blank" rel="noopener noreferrer">Made by Blank 💗</a>
      </div>

      <canvas
        id="canvas" 
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      />
    </>
  )
}

export default Canvas