const tg = window.Telegram.WebApp;
tg.expand();

const cardsDiv = document.getElementById("cards");

for (let i = 1; i <= 100; i++) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerText = i;

  card.onclick = () => {
    tg.sendData("card_" + i);
  };

  cardsDiv.appendChild(card);
}
