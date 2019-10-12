let duration = 60;
let textNumber = Math.floor(Math.random() * 3);

events.init(duration, textNumber, false);

document.querySelector("#restart-btn").addEventListener("click", restartTest);

function restartTest() {
  events.init(duration, textNumber, true);
}

$("#menu-toggle").click(function(e) {
  e.preventDefault();
  document.querySelector("#sidebar-wrapper").style.display = "block";
  $("#wrapper").toggleClass("toggled");
});
