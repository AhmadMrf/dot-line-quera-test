const N = 4;
const M = 4;

const maxLineCount = ((lenght, width) => {
  let lineCount = 0;
  if (lenght === width) {
    lineCount = lenght * (width - 1) * 2;
    return lineCount;
  }

  let less = Math.min(lenght, width);
  let difference = Math.abs(lenght - width);

  lineCount = less * (less - 1) * 2 + (less + (less - 1)) * difference;
  return lineCount;
})(M, N);

let turn = "R";
let selectedLines = [];

const scors = { R: 0, B: 0 };
const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };

const playersTurnText = (turn) => `It's ${turn === "R" ? "Red" : "Blue"}'s turn`;

const isLineSelected = (line) => line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

const createGameGrid = () => {
  const gameGridContainer = document.getElementsByClassName("game-grid-container")[0];

  const rows = Array(N)
    .fill(0)
    .map((_, i) => i);
  const cols = Array(M)
    .fill(0)
    .map((_, i) => i);

  rows.forEach((row) => {
    cols.forEach((col) => {
      const dot = document.createElement("div");
      dot.setAttribute("class", "dot");

      const hLine = document.createElement("div");
      hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
      hLine.setAttribute("id", `h-${row}-${col}`);
      hLine.addEventListener("click", handleLineClick);

      gameGridContainer.appendChild(dot);
      if (col < M - 1) gameGridContainer.appendChild(hLine);
    });

    if (row < N - 1) {
      cols.forEach((col) => {
        const vLine = document.createElement("div");
        vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
        vLine.setAttribute("id", `v-${row}-${col}`);
        vLine.addEventListener("click", handleLineClick);

        const box = document.createElement("div");
        box.setAttribute("class", "box");
        box.setAttribute("id", `box-${row}-${col}`);
        gameGridContainer.appendChild(vLine);
        if (col < M - 1) gameGridContainer.appendChild(box);
      });
    }
  });

  document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const changeTurn = () => {
  const nextTurn = turn === "R" ? "B" : "R";

  const lines = document.querySelectorAll(".line-vertical, .line-horizontal");
  lines.forEach((l) => {
    //if line was not already selected, change it's hover color according to the next turn
    if (!isLineSelected(l)) {
      l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
    }
  });
  turn = nextTurn;
};

const handleLineClick = (e) => {
  const lineId = e.target.id;
  const selectedLine = document.getElementById(lineId);
  if (isLineSelected(selectedLine)) {
    //if line was already selected, return
    return;
  }

  selectedLines = [...selectedLines, lineId];

  let selectedBox = witchBoxesSelected(lineId);
  if (selectedBox) {
    selectedBox.forEach((selectedBox) => {
      selectedBox.classList.add(bgClasses[turn]);
    });
    scors[turn] += selectedBox.length;
    colorLine(selectedLine);
    if (maxLineCount == selectedLines.length) {
      let won = scors.R > scors.B ? "Red" : "Blue";
      document.getElementById("game-status").innerHTML = `won ${won} - Blue : ${scors.B} / Red : ${scors.R}`;
      return;
    }
    return;
  }

  colorLine(selectedLine);
  changeTurn();
  document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const colorLine = (selectedLine) => {
  selectedLine.classList.remove(hoverClasses[turn]);
  selectedLine.classList.add(bgClasses[turn]);
};

// return null or selected box element
const witchBoxesSelected = (lineId) => {
  let [direction, row, col] = lineId.split("-");
  let boxes = null;
  if (direction === "v") {
    boxes = [`box-${row}-${col - 1}`, `box-${row}-${col}`];
  } else {
    boxes = [`box-${row - 1}-${col}`, `box-${row}-${col}`];
  }

  let completedBoxId = null;
  let completedBoxes = null;
  let completedBoxesId = boxes.filter((box) => {
    let [, rowBox, colBox] = box.split("-");

    let rigthLine = `v-${rowBox}-${+colBox + 1}`;
    let leftLine = `v-${rowBox}-${colBox}`;
    let topLine = `h-${rowBox}-${colBox}`;
    let bottonLine = `h-${+rowBox + 1}-${colBox}`;

    let boxLines = [rigthLine, leftLine, topLine, bottonLine];
    completedBoxId = boxLines.every((line) => selectedLines.includes(line));
    return completedBoxId;
  });
  return completedBoxesId.length ? completedBoxesId.map((boxId) => document.getElementById(boxId)) : null;
};
createGameGrid();
