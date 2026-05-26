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

const destaqueCombo = combos.filter(element => element.destaque == true)
const boxComboDestaque = document.querySelector("#destaqueCombo")
let iconTable = [];
let isConfirmed = false

if (destaqueCombo) {

	if (destaqueCombo.length <= 0) {
		boxComboDestaque.style.display = 'none'
	}

	destaqueCombo.forEach(element => {

		let customPlano = element["custom"] ? "" : "Inclui: "

		let resultHTML = element["custom"]
			? `<div class="boxChoiceIcons">
                    <span class="addChoice">Escolha ${element["escolhas"]} Apps </span> 
                    <i class='choiceBtn hoverGray'>
                        <svg class="choiceSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M720-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-600 40q-33 0-56.5-23.5T40-200v-560q0-33 23.5-56.5T120-840h560q33 0 56.5 23.5T760-760v200h-80v-80H120v440h520v80H120Zm0-600h560v-40H120v40Zm0 0v-40 40Z"/>
                        </svg>
                    </i>
                   </div>`
			: `<div class="columnAppsInclusos">${returnIcons(element["apps"])}</div>`;


		boxComboDestaque.innerHTML = `
				<div class="image" style="background: url('${element["imagem"]}')">
						<div id="destaqueIcon">
							<p>RECOMENDADO</p>
						</div>
					</div>

					<div class="planoInfo">
							<div class='planoFirstLine'>
						<h3 class="title">${element["nome"]}</h3>
						<h3 class="tec">Tecnologia <span>${element["tecnologia"]}</span></h3>
						<div class="speedBox">
							<h3 class="download">Down. <span>${element["megaBytes"]}Mbps</span></h3>

							<hr class="line">

							<h3 class="upload">Upld. <span>${element["megaBytes"] / 2}Mbps</span></h3>
						</div>
					</div>

						<div class="icons"><span>${customPlano} </span>${resultHTML}</div>

						<p class="caption grayText">${minusculo(element["legenda"])}</p>

						<hr class="planoLine">
						
						<p class="taxa">Taxa de instalação: 50,00R$</p>

						<div class="priceBox">
						<h2 class="price">Preço: <span>${element["valor"]}R$</span></h2>
						<button class='contratar'>CONTRATAR</button>
						</div>
					</div>
			`

		const defaultHTML = boxComboDestaque.innerHTML

		if (element["custom"]) {

			const btnAddApps = boxComboDestaque.querySelector(".choiceBtn")
			const boxChoiceIcons = boxComboDestaque.querySelector(".boxChoiceIcons")

			const setupChoiceHtml = () => {
				iconTable = []
				let limitCount;
				isConfirmed = false
				boxChoiceIcons.innerHTML = `
						<span class="addChoice">Escolha ${element["escolhas"]} Apps </span> 
						<div class="appsToChoice">${returnIcons(element["apps"])}</div>
						<button class="confirmChoices" style="display: none">Confirmar</button>
					`

				const iconsSelect = boxChoiceIcons.querySelectorAll(".appsToChoice .appIcon")
				const confirmChoices = boxChoiceIcons.querySelector(".confirmChoices")

				iconsSelect.forEach((icon) => {
					icon.onclick = (event) => {
						event.stopPropagation()

						if (!icon.classList.contains("orangeBorder")) {
							if (limitCount >= element["escolhas"]) return;
							icon.classList.add("orangeBorder")
							iconTable.push(icon.getAttribute("name"))
						} else {
							icon.classList.remove("orangeBorder")
							const findIndex = iconTable.indexOf(icon.getAttribute("name"))
							if (findIndex > -1) {
								iconTable.splice(findIndex, 1)
							}
						}

						limitCount = boxChoiceIcons.querySelectorAll(".orangeBorder").length

						if (limitCount == element["escolhas"]) {
							confirmChoices.style.display = ''
						} else {
							confirmChoices.style.display = 'none'
						}

						confirmChoices.onclick = () => {
							boxChoiceIcons.innerHTML = `
								<div class="columnAppsInclusos"><span>Inclui: </span>${returnIcons(iconTable)} 
								<i class="resetHtml hoverGray">
								 <svg class="choiceSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M720-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-600 40q-33 0-56.5-23.5T40-200v-560q0-33 23.5-56.5T120-840h560q33 0 56.5 23.5T760-760v200h-80v-80H120v440h520v80H120Zm0-600h560v-40H120v40Zm0 0v-40 40Z"/>
                        		</svg>
								</i></div>
								`
							isConfirmed = true

							boxComboDestaque.querySelector(".resetHtml").onclick = () => {
								setupChoiceHtml()
							}
						}
					}
				})
			}

			btnAddApps.onclick = setupChoiceHtml
		}

		const btnContratar = boxComboDestaque.querySelector(".contratar")

		btnContratar.onclick = async () => {
			if (element["custom"] && !isConfirmed) {
				showAlert(`Escolha ${element["escolhas"]} Apps para Prosseguir`)
				return;
			}

			contratarPlano(element, alertList.cepUnavailable, iconTable);
		}
	});
}

const destaqueBasico = planos.filter(element => element.destaque == true)

if (destaqueBasico) {
	destaqueBasico.forEach(element => {
		const boxDestaque = document.querySelector("#destaqueBasico")

		boxDestaque.innerHTML = `
				<div class="image" style="background: url('${element["imagem"]}')">
						<div id="destaqueIcon">
							<p>RECOMENDADO</p>
						</div>
					</div>

					<div class="planoInfo">
							<div class='planoFirstLine'>
						<h3 class="title">${element["nome"]}</h3>
						<h3 class="tec">Tecnologia <span>${element["tecnologia"]}</span></h3>
						<div class="speedBox">
							<h3 class="download">Down. <span>${element["megaBytes"]}Mbps</span></h3>

							<hr class="line">

							<h3 class="upload">Upld. <span>${element["megaBytes"] / 2}Mbps</span></h3>
						</div>
					</div>
						
						<p class="caption grayText">${minusculo(element["legenda"])}</p>
						
						<hr class="planoLine">

						<p class="taxa">Taxa de instalação: 50,00R$</p>

						<div class="priceBox">
						<h2 class="price">Preço: <span>${element["valor"]}R$</span></h2>
						<button class='contratar'>CONTRATAR</button>
						</div>
					</div>
			`

		const btnContratar = boxDestaque.querySelector(".contratar")

		btnContratar.onclick = async () => {
			await contratarPlano(element, alertList.cepUnavailable, [])
		}
	});
}

const ofertasFlex = document.querySelector(".ofertas")

ofertas.forEach(element => {
	if (ofertas.length <= 0) return;

	let isHref = element["link"] ? "Saiba Mais" : ""
	let expiresJson = element["expiraEm"] == "Never" ? "Ilimitado" : `${element["expiraEm"][0]} As ${element["expiraEm"][1]}` 

	const div = document.createElement("div")
	div.className = "oferta"
	div.innerHTML = `
		<div class="ofertaImage">
						<img src="${element["imagem"]}" alt="">
					</div>

					<div class="ofertaInfo">
						<h3 class="ofertaTitle linearGradient">${element["nome"]}</h3>
						<p class="apps gradientRight"> ${element["apps"]} </p>

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
