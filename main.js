// -------------------- Game Hub --------------------
function showGame(game){
  document.querySelectorAll('.game-container').forEach(c=>c.style.display='none');
  document.getElementById(game).style.display='block';
}

// -------------------- Tic-Tac-Toe --------------------
const tttContainer = document.getElementById('tictactoe');
tttContainer.innerHTML = `<div class="ttt-board">${'<div class="cell" data-index="'+Array(9).fill(0).map((_,i)=>i).join('"></div><div class="cell" data-index="')+'"></div>'}</div>
<button id="ttt-reset">Restart</button>`;

const tttBoard = Array(9).fill(null);
let tttTurn='X';
function checkWinner(board){
  const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const [a,b,c] of lines) if(board[a]&&board[a]===board[b]&&board[a]===board[c]) return board[a];
  return board.includes(null)? null:'Draw';
}
function renderTTT(){
  document.querySelectorAll('.ttt-board .cell').forEach((cell,i)=>{
    cell.textContent = tttBoard[i]||'';
  });
}
document.querySelectorAll('.ttt-board .cell').forEach(cell=>{
  cell.addEventListener('click',()=>{
    const i = cell.dataset.index;
    if(!tttBoard[i]){
      tttBoard[i]=tttTurn;
      cell.classList.add('animate');
      const winner = checkWinner(tttBoard);
      if(winner){ alert(winner==='Draw'?'It\'s a draw!':winner+' wins!'); tttBoard.fill(null); }
      else tttTurn = tttTurn==='X'?'O':'X';
      renderTTT();
    }
  });
});
document.getElementById('ttt-reset').addEventListener('click',()=>{tttBoard.fill(null); tttTurn='X'; renderTTT();});
renderTTT();

// -------------------- Snake --------------------
const snakeContainer = document.getElementById('snake');
snakeContainer.innerHTML=`<canvas id="snake-canvas" width="400" height="400"></canvas><div id="snake-score">Score:0</div><button id="snake-reset">Restart</button>`;
const canvas = document.getElementById('snake-canvas'); const ctx=canvas.getContext('2d');
const box=20; let snake=[{x:9*box,y:10*box}],direction='RIGHT',food={x:Math.floor(Math.random()*20)*box,y:Math.floor(Math.random()*20)*box},score=0;
document.addEventListener('keydown',e=>{if(e.key==='ArrowUp'&&direction!=='DOWN')direction='UP';if(e.key==='ArrowDown'&&direction!=='UP')direction='DOWN';if(e.key==='ArrowLeft'&&direction!=='RIGHT')direction='LEFT';if(e.key==='ArrowRight'&&direction!=='LEFT')direction='RIGHT';});
function drawSnake(){
  ctx.fillStyle='black'; ctx.fillRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<snake.length;i++){
    const grad=ctx.createLinearGradient(snake[i].x,snake[i].y,snake[i].x+box,snake[i].y+box);
    grad.addColorStop(0,'#32CD32'); grad.addColorStop(1,'#7CFC00');
    ctx.fillStyle=i===0?'#ADFF2F':grad;
    ctx.fillRect(snake[i].x,snake[i].y,box,box);
    ctx.strokeStyle='darkgreen'; ctx.strokeRect(snake[i].x,snake[i].y,box,box);
  }
  ctx.fillStyle='red'; ctx.fillRect(food.x,food.y,box,box);
  let head={x:snake[0].x,y:snake[0].y};
  if(direction==='UP')head.y-=box;if(direction==='DOWN')head.y+=box;if(direction==='LEFT')head.x-=box;if(direction==='RIGHT')head.x+=box;
  if(head.x<0||head.x>=canvas.width||head.y<0||head.y>=canvas.height||snake.some(s=>s.x===head.x&&s.y===head.y)){alert('Game Over! Score:'+score);snake=[{x:9*box,y:10*box}];direction='RIGHT';score=0;food={x:Math.floor(Math.random()*20)*box,y:Math.floor(Math.random()*20)*box};}
  else {snake.unshift(head); if(head.x===food.x&&head.y===food.y){score++;food={x:Math.floor(Math.random()*20)*box,y:Math.floor(Math.random()*20)*box};}else snake.pop();}
  document.getElementById('snake-score').innerText='Score: '+score;
}
let snakeGame=setInterval(drawSnake,120);
document.getElementById('snake-reset').addEventListener('click',()=>{snake=[{x:9*box,y:10*box}];direction='RIGHT';score=0;food={x:Math.floor(Math.random()*20)*box,y:Math.floor(Math.random()*20)*box};});

// -------------------- Snakes & Ladders --------------------
const slContainer=document.getElementById('snakesladders');
slContainer.innerHTML=`<canvas id="sl-canvas" width="400" height="400"></canvas><button id="sl-roll">Roll Dice</button><div id="sl-info">Player 1 turn</div>`;
const slCanvas=document.getElementById('sl-canvas'); const slCtx=slCanvas.getContext('2d');
const rows=8,cols=8,sizeSL=50; const snakes={62:19,41:20,77:49,87:57},ladders={3:22,5:8,11:26,20:29};
let players=[{pos:0,color:'red'},{pos:0,color:'yellow'}]; let turn=0;
function getXY(pos){if(pos<=0) return {x:0,y:0}; const r=rows-1-Math.floor((pos-1)/cols); const c=((rows-1-r)%2===0)?(pos-1)%cols:cols-1-(pos-1)%cols; return {x:c*sizeSL+sizeSL/2,y:r*sizeSL+sizeSL/2};}
function drawBoardSL(){
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      slCtx.fillStyle=((r+c)%2===0)?'#ffe4b5':'#8b4513';
      slCtx.fillRect(c*sizeSL,r*sizeSL,sizeSL,sizeSL);
      const num=(rows-r-1)*cols + ((r%2===0)?c+1:cols-c);
      slCtx.fillStyle='black'; slCtx.font='12px Arial'; slCtx.fillText(num,c*sizeSL+5,r*sizeSL+15);
    }
  }
  for(const s in snakes){const f=getXY(s);const t=getXY(snakes[s]);slCtx.strokeStyle='green';slCtx.lineWidth=4;slCtx.beginPath();slCtx.moveTo(f.x,f.y);slCtx.lineTo(t.x,t.y);slCtx.stroke();}
  for(const l in ladders){const f=getXY(l);const t=getXY(ladders[l]);slCtx.strokeStyle='blue';slCtx.lineWidth=4;slCtx.beginPath();slCtx.moveTo(f.x,f.y);slCtx.lineTo(t.x,t.y);slCtx.stroke();}
}
function drawPlayersSL(){
  players.forEach(p=>{if(p.pos>0){const xy=getXY(p.pos);slCtx.beginPath();slCtx.arc(xy.x,xy.y,10,0,2*Math.PI);slCtx.fillStyle=p.color;slCtx.fill();}});
}
function renderSL(){slCtx.clearRect(0,0,slCanvas.width,slCanvas.height);drawBoardSL();drawPlayersSL();}
document.getElementById('sl-roll').addEventListener('click',()=>{
  const dice=Math.floor(Math.random()*6)+1;
  let p=players[turn]; p.pos+=dice;
  if(snakes[p.pos])p.pos=snakes[p.pos]; if(ladders[p.pos])p.pos=ladders[p.pos];
  if(p.pos>=64){alert(`Player ${turn+1} wins!`);players=[{pos:0,color:'red'},{pos:0,color:'yellow'}]; turn=0;}
  else turn=(turn+1)%2;
  document.getElementById('sl-info').innerText=`Player ${turn+1} turn`; renderSL();
});
renderSL();

// -------------------- Connect 4 --------------------
const c4Container=document.getElementById('connect4');
c4Container.innerHTML=`<div id="c4-board" class="c4-board"></div><div id="c4-info">Player Red turn</div><button id="c4-reset">Restart</button>`;
const rowsC4=6,colsC4=7; let boardC4=Array.from({length:rowsC4},()=>Array(colsC4).fill(null)),turnC4='red';
function renderC4(){
  const boardDiv=document.getElementById('c
