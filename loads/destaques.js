import { module, bkUrl } from "../utils/module.js";
import { alertList } from "./alerts.js";
import { contratarPlano, returnIcons, showAlert } from "../fun/functions.js";

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

const ofertasFlex = document.querySelector(".ofertas")

ofertas.forEach(element => {
	if (ofertas.length <= 0) return;

	let isHref = element["link"] ? "Saiba Mais" : ""
	let expiresJson = element["expiraEm"] === "Never" ? "Ilimitado" : `${element["expiraEm"][0]} As ${element["expiraEm"][1]}` 

	const div = document.createElement("div")
	div.className = "oferta"
	div.innerHTML = `
		<div class="ofertaImage">
						<img src="${element["imagem"]}" alt="">
					</div>

					<div class="ofertaInfo">
						<h3 class="ofertaTitle">${element["nome"]}</h3>
						<p class="apps"> ${element["apps"]} </p>

						<p class="ofertaCaption">${minusculo(element["legenda"])}</p>
						<div class="flexLastLine">
						<div class="expiresBox">
						<p class="expiresText">Válido até</p>
						<h2 class="expiresIn">${expiresJson}</h2>
						</div>

						<a href="${element["link"]}" class="redirectLink">${isHref}</a>
					</div>
		`
	ofertasFlex.appendChild(div)
})

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
document.querySelector(".totalMedia").style.color = `${colorResult(finalResult)}`

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
				<h3 class="nota" style="color: ${colorResult(obj["avaliacao"])}">${obj["avaliacao"]}</h3>
			</div>
				<p class="content">${obj["feedback"]}</p>			
	`
	feedbackBox.appendChild(div)
});
