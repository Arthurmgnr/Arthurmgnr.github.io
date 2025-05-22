
const game = JSON.parse(sessionStorage.getItem("game"));
// sessionStorage.clear();

const container = document.getElementById("container");
for (const key of Object.keys(game)) {
    li = document.createElement("li");
    li.innerText = `${key} : ${game[key]}`;
    container.appendChild(li);
}