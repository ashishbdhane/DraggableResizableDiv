// App.js
import React from 'react';
import './App.css';
import DraggableResizableDiv from './DraggableResizableDiv';

function App() {
  const squareData = [
    { color: 'pink' },
    { color: 'purple' },
    { color: 'blue' },
    { color: 'green' },
    { color: 'orange' },
    { color: 'red' },
    { color: 'yellow' },
    { color: 'brown' },
    { color: 'cyan' },
  ];


  // Create an array of squares divided into groups of 3
  const rowArray = [0,1,2];
  const colArray = [0,1,2];

  return (
    <div className="App">
      <div className="columns">
        {rowArray.map((row) =>
              colArray.map((col) => 
                <div key={col} className="column">
                    <DraggableResizableDiv
                      key={3*row+col}
                      id={`square_${(3*row)+col}`}
                      defaultPosition={{
                        x: col * 200 + row, // Adjust the offset
                        y: row * 200, // Adjust the offset
                      }}
                      defaultSize={{ width: 150, height: 150 }}
                      color={squareData[col+row*3].color}
                      title={`Box ${col * 3 + row + 1}`}
                    />
                  </div>
          ))}
      </div>
    </div>
  );
}

export default App;
