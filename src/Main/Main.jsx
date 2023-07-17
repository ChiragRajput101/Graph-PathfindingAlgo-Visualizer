import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../Algo/bfs';

import './Main.css';

// const START_NODE_ROW_DEF = 7;
// const START_NODE_COl_DEF = 10;
// const FINISH_NODE_ROW_DEF = 7;
// const FINISH_NODE_COL_DEF = 30;

let START_NODE_ROW = 7;
let START_NODE_COL = 10;
let FINISH_NODE_ROW = 7;
let FINISH_NODE_COL = 30;



export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      isMousePressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  clearGrid() {
    window.location.reload();
  }


  // getnewgrid is not efficient as it renders everything all over again once a wall is toggled

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, isMousePressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.isMousePressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({isMousePressed: false});
  }

  animateDijkstra(cellsThatAreVisitedWhilePerformingSearch, answerPathNodes) {
    for (let i = 0; i <= cellsThatAreVisitedWhilePerformingSearch.length; i++) {
      if (i === cellsThatAreVisitedWhilePerformingSearch.length) {
        setTimeout(() => {
          this.animateShortestPath(answerPathNodes);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = cellsThatAreVisitedWhilePerformingSearch[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(answerPathNodes) {
    for (let i = 0; i < answerPathNodes.length; i++) {
      setTimeout(() => {
        const node = answerPathNodes[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 25 * i);
    }
  }

  startAlgoAnimation() {
    // console.log("entered visualize function");
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const cellsThatAreVisitedWhilePerformingSearch = dijkstra(grid, startNode, finishNode);
    const answerPathNodes = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(cellsThatAreVisitedWhilePerformingSearch, answerPathNodes);
  }

  render() {
    const {grid, isMousePressed: isMousePressed} = this.state;

    return (
      <div className='cont'>

        <nav>
          <div className='heading'>
            PathFinding Visualizer
          </div>

{/*           <div className='customInputs'>
            <input type="text" placeholder='StartNodeX (0-14)' id='startXId'></input>
            <input type="text" placeholder='StartNodeY (0-39)' id='startYId'></input>
            <input type="text" placeholder='GoalNodeX (0-15)' id='GaolXId'></input>
            <input type="text" placeholder='GoalNodeY (0-39)' id='GoalYId'></input>
          </div> */}

          <button onClick={() => this.startAlgoAnimation()}>
            Start Search
          </button>
          <button onClick={() => this.clearGrid()}>Clear Board</button>
        </nav>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    // using the Node class from Node.jsx
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={isMousePressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)} // for creating walls by dragging the mouse
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 15; row++) {
    const currentRow = [];
    for (let col = 0; col < 40; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: node.isWall ^ 1, // toggled -- xor with 1 flips the bit
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

