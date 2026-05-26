import { module } from "./utils/module.js";

const divOfertas = document.querySelector(".ofertas")
const divOferta = divOfertas.querySelector(".oferta")
let autoScrollTimer;
let currentIndex = 0;
let moverPara = 0;

const ofertas = await module.carregarOfertas()
divOfertas.style.boxShadow = `0 0 30px rgba(${ofertas[currentIndex]["bColor"]}, 1)`

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

	divOfertas.style.boxShadow = `0 0 30px rgba(${ofertas[currentIndex]["bColor"]}, 1)`

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

const sidebarOptions = document.querySelectorAll(".sidebarOptions")
const comboSection = document.querySelectorAll(".comboSection")
const basicoSection = document.querySelectorAll(".basicoSection")


sidebarOptions.forEach((option) => {
	option.onclick = () => {
		const getAttribute = option.getAttribute("data-target")

		if (getAttribute === ".comboSection") {
			comboSection.forEach((e) => {
				e.style.display == "none" ? e.style.display = "" : e.style.display = "none"
			})
		} else if (getAttribute === ".basicoSection") {
			basicoSection.forEach((e) => {
				e.style.display == "none" ? e.style.display = "" : e.style.display = "none"
			})
		}

		option.classList.contains("sidebarOptionSelected") ? 
		option.classList.remove("sidebarOptionSelected") :
		option.classList.add("sidebarOptionSelected")
	}
})

autoScroll(7000);