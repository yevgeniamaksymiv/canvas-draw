import './App.css';
import { useRef, useState, useEffect } from 'react';
import { checkIntersection } from 'line-intersect';

const App = () => {
  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [start, setStart] = useState([]);
  const [lineCoordinates, setLineCoordinates] = useState([]);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (start.length !== 0 && lineCoordinates.length !== 0 && lines.length !== 0) {
      lines.forEach((line) => {
        line.draw();
      });
    }
  
  }, [start, lineCoordinates, lines]);

  function Line(begin, end) {
    this.begin = begin;
    this.end = end;
    
    this.draw = function() {
      if (begin.length !== 0 && end.length !== 0) {
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(...begin);
        ctxRef.current.lineTo(...end);
        ctxRef.current.stroke();
      }
    }
  }

  const getOffsetStart = (e) => {
    const x = e.pageX - e.currentTarget.offsetLeft;
    const y = e.pageY - e.currentTarget.offsetTop;
    setStart([x, y]);
  }

  const getOffsetLine = (e) => {
    const x = e.pageX - e.currentTarget.offsetLeft;
    const y = e.pageY - e.currentTarget.offsetTop;
    setLineCoordinates([x, y]);
  }

  const handleMouseDown = (e) => {
    setDrawing(true);
    getOffsetStart(e);
  }

  const handleMouseMove = (e) => {
    if (!drawing) return;
    getOffsetLine(e);
    clear();
    const line = new Line(start, lineCoordinates);
    line.draw();
  }
  
  const handleMouseUp = () => {
    const line = new Line(start, lineCoordinates);
    setLines((prev) => [...prev, line]);
    ctxRef.current.closePath();
    setDrawing(false);
  }

  const clear = () => {
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  }


  const fillCrossingPoint = (x, y) => {
    ctxRef.current.fillStyle = '#e3242b';
    ctxRef.current.beginPath();
    ctxRef.current.arc(x, y, 5, 0, Math.PI * 2);
    ctxRef.current.fill();
    ctxRef.current.stroke();
  }
  
  return (
    <div className="App">
      <canvas
        className="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        // onTouchStart={handleMouseDown}
        // onTouchMove={handleMouseMove}
        // onTouchEnd={handleMouseUp}
        ref={canvasRef}
      />
      <button onClick={clear}>Collapse lines</button>
    </div>
  );
}

export default App;
