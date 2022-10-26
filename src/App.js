import './App.css';
import { useRef, useState, useEffect } from 'react';
const isect = require('isect');

const App = () => {
  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [lineCoordinates, setLineCoordinates] = useState([]);
  const [start, setStart] = useState([]);
  const [end, setEnd] = useState([]);
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
    if (start.length !== 0 && end.length !== 0 && lines.length !== 0) {
      lines.forEach((line) => line.draw());
    }

      if (lines.length > 1) {
        const detectIntersections = isect.bush(
          lineCoordinates.map((el) => {
            return {
              from: { x: el[0][0], y: el[0][1] },
              to: { x: el[1][0], y: el[1][1] },
            };
          })
        );
        const intersections = detectIntersections.run();
        const intersectionPoint = [];
        intersections.filter((obj) => intersectionPoint.push(Object.values(obj.point)));
        intersectionPoint.map((point) => fillIntersectionPoint(point));
      }
  }, [start, end, lines, lineCoordinates]);

  function Line(begin, end) {
    this.begin = begin;
    this.end = end;

    this.draw = function () {
      if (begin.length !== 0 && end.length !== 0) {
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(...begin);
        ctxRef.current.lineTo(...end);
        ctxRef.current.stroke();
      }
    };
  }

  const getOffsetStart = (e) => {
    const x = e.pageX - e.currentTarget.offsetLeft;
    const y = e.pageY - e.currentTarget.offsetTop;
    setStart([x, y]);
  };

  const getOffsetLine = (e) => {
    const x = e.pageX - e.currentTarget.offsetLeft;
    const y = e.pageY - e.currentTarget.offsetTop;
    setEnd([x, y]);
  };

  const handleMouseDown = (e) => {
    setDrawing(true);
    getOffsetStart(e);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    getOffsetLine(e);
    clear();
    const line = new Line(start, end);
    line.draw();
  };

  const handleMouseUp = () => {
    const line = new Line(start, end);
    setLines((prev) => [...prev, line]);
    setLineCoordinates((prev) => [
      ...prev,
      Object.values(line).filter((el) => Array.isArray(el)),
    ]);
    ctxRef.current.closePath();
    setDrawing(false);
  };

  const clear = () => {
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  const handleOnClick = () => {
    clear();
    setLines([]);
    setLineCoordinates([]);
  };

  const fillIntersectionPoint = (args) => {
    ctxRef.current.fillStyle = '#e3242b';
    ctxRef.current.beginPath();
    ctxRef.current.arc(...args, 5, 0, Math.PI * 2);
    ctxRef.current.fill();
    ctxRef.current.stroke();
  };

  return (
    <div className="App">
      <canvas
        className="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={canvasRef}
      />
      <button onClick={handleOnClick}>Collapse lines</button>
    </div>
  );
};

export default App;
