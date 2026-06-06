import { getAppContext, returnIcons, returnName } from "./fun/functions.js";
import { module } from "./utils/module.js";

let currentImgIndex = 0

const imgArray = ["assets/streaming.jpeg", "assets/streaming1.jpg", "assets/streaming2.jpg", "assets/streaming3.jpg"]

const flexApps = document.querySelector(".flexApps")

flexApps.innerHTML = returnIcons("all")

const botoes = flexApps.querySelectorAll("i");
const flexIcon = document.querySelector(".flexIcon")
const fluinetApps = document.getElementById("fluinetApps")
const control = document.querySelector(".control")

document.getElementById("filterBtn").onclick = () => {
	currentImgIndex += 1
	
	if (currentImgIndex == imgArray.length) currentImgIndex = 0

	fluinetApps.style.background = `url(${imgArray[currentImgIndex]})`
}

document.getElementById("powerBtn").onclick = () => {

	if (!fluinetApps.classList.contains("television_off")) {
		flexIcon.style.display = "none"
		fluinetApps.classList.add("television_off")
		control.style.border = "solid red 2px"
	} else {
		flexIcon.style.display = ""
		fluinetApps.classList.remove("television_off")
		control.style.border = "solid var(--gray) 2px"
	}
}

flexIcon.innerHTML = `
			${getAppContext("HboMax", "Streaming")}
			<p class="appCaption yg_outlined">${returnName("HboMax")}</p>
		`
botoes[0].classList.add("selected_orangeBorder")		

botoes.forEach((e) => {
	e.onclick = () => {

		botoes.forEach((botao) => {
            botao.classList.remove("selected_orangeBorder");
        });

		e.classList.add("selected_orangeBorder")

		const getAppName = e.getAttribute("name")
		const getThisData = e.getAttribute("data")

		flexIcon.innerHTML = `
			${getAppContext(getAppName, getThisData)}
			<p class="appCaption yg_outlined">${returnName(getAppName)}</p>
		` 
	}
})