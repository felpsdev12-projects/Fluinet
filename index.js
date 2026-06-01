import { getAppContext, returnIcons, returnName } from "./fun/functions.js";
import { module } from "./utils/module.js";

const divOfertas = document.querySelector(".ofertas")
const divOferta = divOfertas.querySelector(".oferta")
let autoScrollTimer;
let currentIndex = 0;
let currentImgIndex = 0
let moverPara = 0;

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


const ofertas = await module.carregarOfertas()

function scrollOferta(direction) {
	const { clientWidth, scrollWidth, scrollLeft } = divOfertas

	const maxNextScroll = scrollWidth - clientWidth

	if (direction > 0) {
		if (scrollLeft >= maxNextScroll - 10) {
			moverPara = -scrollLeft
			currentIndex = 0
		} else {
			moverPara = direction
			currentIndex += 1
		}

	} else {
		if (scrollLeft <= 10) {
			moverPara = maxNextScroll
			currentIndex = ofertas.length - 1
		} else {
			moverPara = direction
			currentIndex -= 1
		}
	}

	divOfertas.scrollBy({
		left: moverPara,
		behavior: "smooth"
	})
}

// Configura os cliques passando a direção
document.getElementById("back").onclick = () => {
	scrollOferta(-300); // Valor negativo volta
	autoScroll(7000);
}

document.getElementById("next").onclick = () => {
	scrollOferta(300); // Valor positivo avança
	autoScroll(7000);
}

function autoScroll(time) {
	if (autoScrollTimer) clearInterval(autoScrollTimer);
	autoScrollTimer = setInterval(() => {
		scrollOferta(300); // AutoScroll sempre avança
	}, time);
}

autoScroll(7000);