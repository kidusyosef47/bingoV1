const tg = window.Telegram.WebApp;
tg.expand();

const cardsDiv = document.getElementById("cards");

for (let i = 1; i <= 100; i++) {
  const btn = document.createElement("div");
  btn.className = "card";
  btn.innerText = i;
  btn.onclick = () => {
    tg.sendData("card_" + i);
  };
  cardsDiv.appendChild(btn);
}
