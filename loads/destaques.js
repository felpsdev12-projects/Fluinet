import { module, bkUrl } from "../utils/module.js";
import { alertList } from "./alerts.js";
import { contratarPlano, returnIcons, showAlert, showAnnouncement } from "../fun/functions.js";

const [ofertas, combos, planos] = await Promise.all([
	module.carregarOfertas(),
	module.carregarCombos(),
	module.carregarPlanos(),
])

const minusculo = (e) => {
	const result = module.tudoMinusculo(e)
	return result
}

const maiusculo = (e) => {
	const result = module.tudoMaisculo(e)
	return result
}

const findDestaque = combos.find(element => element.destaque === true)
const announcementBox = document.querySelector(".announcementBox")

if (findDestaque) {
	announcementBox.style.display = ""
	announcementBox.innerHTML = showAnnouncement(findDestaque)

	const currentCep = localStorage.getItem("CEP")
	const currentBairro = localStorage.getItem("Bairro")

	const main = document.querySelector("main")
	const blockedImage = document.querySelector(".blockedImage")
	const header = document.querySelector("header")

	document.querySelector(".closeAnnouncement").onclick = () => {
	announcementBox.style.display = "none"

	main.style.filter = "none"
	blockedImage.style.filter = "none"
	header.style.filter = "none"
	}

	document.querySelector(".consultarBtn").onclick = () => {
		announcementBox.style.display = "none"

		main.style.filter = "none"
		blockedImage.style.filter = "none"
		header.style.filter = "none"
	}

	document.querySelector(".whatsappButton").onclick = () => {
		const link = `https://wa.me/11963348201?text=Olá, Gostaria de saber mais sobre o Combo de ${findDestaque["megaBytes"]} Mega %0A Cep: ${currentCep} %0A Bairro: ${currentBairro}`

		window.open(link, "_blank")
	}
}

const res = await fetch(`${bkUrl}/returnConfigJson`, {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({})
});

const data = JSON.parse(await res.json())

const feedbackBox = document.querySelector(".feedbackBox")
const totalStars = (e) => module.returnEstrelas(e)

const feedbacks = data["feedbacks"]

document.querySelector(".totalComments").textContent = feedbacks.length

let allStars = feedbacks.reduce((acc, obj) => acc + obj.avaliacao, 0)
let result = allStars / feedbacks.length
let finalResult = result.toFixed(1)

const colorResult = (e) => {

	return module.averageColor(e)
}

document.querySelector(".totalAverage").innerHTML = `${totalStars(finalResult)}`

document.querySelector(".totalMedia").textContent = finalResult

feedbacks.forEach((obj) => {

	const div = document.createElement("div")
	div.className = "feedbackContent"

	div.innerHTML = `
	
		<div class="flexFirstLine">
			<h3 class="name">${obj["nome"]}</h3>
				<div class="stars">
					${totalStars(obj["avaliacao"])}
				</div>
				<h4>${obj["data"]}</h4>
				<h3 class="nota yg_outlined">${obj["avaliacao"]}</h3>
			</div>
				<p class="content">${obj["feedback"]}</p>			
	`
	feedbackBox.appendChild(div)
});
