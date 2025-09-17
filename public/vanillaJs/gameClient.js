// filepath: c:\Users\Devarshi\CodeStack\Code-Projects\Chess.com\public\vanillaJs\gameClient.js
document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const movesUl = document.querySelector('#moves');
  function appendMove(move) {
    const li = document.createElement('li');
    li.textContent = `${move.from} → ${move.to}`;
    movesUl.appendChild(li);
  }
  socket.on('move', (move) => {
    console.log('Client received move:', move);
    if (move && move.from && move.to) appendMove(move);
  });
});