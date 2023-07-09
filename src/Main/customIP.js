const startXBox = document.getElementById("startXId");

function customX() {
  if(startXBox.value !== '') {
    START_NODE_ROW = startXBox.value;
  }
  startXBox.value = '';
}

startXBox.addEventListener("keyup", function(e) {
  if(e.keyCode === 13) {
    e.preventDefault();
    customX();
  }
})