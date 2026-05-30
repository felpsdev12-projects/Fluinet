import { updateInfo, showCepBox } from "../script.js";
import {
	debounce,
	module,
} from "../utils/module.js";

import {
	icon
} from "./constants.js";

const cepInput = document.querySelector(".cepInput");
const alertBox = document.querySelector(".alertBox")
const btnConfirm = document.getElementById("searchCep");

const returnSpeedHtml = (el) => {
	let result = el < 200 ? "Conexão Estável" : "Alta Velocidade"

	return result
}

export function generatePlanHtml(ex) {

	let recomendedHtml = ex["destaque"] ? "Recomendado" : "Básico"
	let thisTextColor = ex["destaque"] ? "extra" : ""

	return (
	`<div class="imageContainer">
							<h3 class="type ${thisTextColor}">${recomendedHtml}</h3>
							<img src="${ex["imagem"]}">
						</div>

						<div class="flexPlanInfo">
							<div class="firstLineBox">
								<h3 class="planInfoName">${ex["nome"].replace("MB", "MegaBytes")} De Internet</h3>
							</div>
				<div class="flexFirstLineBoxes">
						<div class="secondLineBox">
								<div class="downloadBox">
									<h3 class="downloadTitle mbpsTitle">Download: </h3>

									<div class="downloadSecondLine">

										<i>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
											<path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
											</svg>
										</i>

										<h4 class="download">${ex["megaBytes"]} Mbps</h4>
									</div>
								</div>

								<div class="uploadBox">
									<h3 class="uploadTitle mbpsTitle">Upload: </h3>

									<div class="uploadSecondLine">
										<i>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
											<path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
											</svg>
										</i>

										<h4 class="upload">${ex["megaBytes"] / 2} Mbps</h4>
									</div>
								</div>	
							</div>

							<div class="secondColumnLineBox">
								<h4 class="tecnologia">Conexão <span>${ex["tecnologia"]}</span></h4>
								<h4 class="fibra">100% Fibra Óptica</h4>
								<h4 class="velocidade">${returnSpeedHtml(ex["megaBytes"])}</h4>
							</div>
						</div>

						<div class="captionBox">
							<p class="caption">${ex["legenda"]}</p>
							<div class="includedApps">
								<span>Inclui: </span>
								<div class="flexIncludedApps"></div>
							</div>
						</div>

						<hr class="line">

						<div class="contratarBox">
							<p class="price">Preço Mensal: <span>${ex["valor"]}R$</span></p>
							<button class="contratarPlanoBtn">Adquira Já!</button>
						</div>

						<small class="taxa">Taxa de Instalação de 50,00R$</small>
						</div>


						`)
}

export function verifyCepRegister() {
	const verifyCep = localStorage.getItem("CEP")
	const verifyLogradouro = localStorage.getItem("Bairro")

	if (verifyCep && verifyLogradouro) return true;

	return false;
}

export async function verifyRegioes(e) {

	const regioes = await module.returnViabilidades()
	return regioes.some(value => value["cep"].includes(e));
}

export async function searchCep(cep, verifyCep) {
	const cepReplace = cep.replace(/\D/g, '')
	const cepCorrigido = cepReplace.replace(/(\d{5})(\d{3})/, "$1-$2");

	const bairroResult = document.querySelector(".bairro")

	cepInput.onfocus = () => {
		cepInput.classList.remove("input_erro")
	};

	if (cepReplace.length !== 8) {
		cepInput.classList.add("input_erro")
		return false;
	}

	try {
		const res = await fetch(`https://viacep.com.br/ws/${cepReplace}/json/`);
		const data = await res.json()

		if (data.erro) {
			cepInput.classList.add("input_erro")
			return false;
		}

		if (verifyCep) {
			if (!await verifyRegioes(cepCorrigido)) {
				bairroResult.innerHTML = `Infelizmente não temos Disponibilidade para CEP: ${cepCorrigido} <br> ${data.logradouro} <br> (${data.bairro})`
				bairroResult.style.display = ''
				cepInput.classList.add("input_erro")
				return false;
			}
		}

		localStorage.setItem("CEP", cepCorrigido)
		localStorage.setItem("Bairro", data.bairro)

		bairroResult.innerHTML = `${data.bairro} <br> ${data.logradouro}`
		bairroResult.style.display = ''
		updateInfo()

		return true;

	} catch (error) {
		return false
	}
}

export function showAlert(alertContent, cep) {
	if (debounce.Check("showAlert")) return;
	debounce.Add("showAlert", 1700)

	let finalHtml = cep !== undefined ? `${alertContent} <br> ${cep}` : `${alertContent}`


	alertBox.querySelector(".alert").innerHTML = finalHtml

	alertBox.style.display = ''

	setTimeout(() => {
		alertBox.style.display = 'none'
	}, 1700)
}

export async function contratarPlano(item, alertContent, customTable) {
	if (debounce.Check("btnDebounce")) return;

	debounce.Add("btnDebounce", 1700)

	let finalExtraHtml

	if (customTable.length > 0 || customTable == undefined) {
		finalExtraHtml = `%2B ${customTable.map(element => element.toUpperCase()).join(", ")}`
	} else if (Array.isArray(item["apps"])) {
		finalExtraHtml = `%2B ${item["apps"].map(element => element.toUpperCase()).join(", ")}` || ''
	} else {
		finalExtraHtml = item["apps"] || ""
	}

	const currentCep = localStorage.getItem("CEP")
	const currentBairro = localStorage.getItem("Bairro")

	const link = `https://wa.me/11963348201?text=Plano ${item["nome"]} ${finalExtraHtml} %0A Cep: ${currentCep} %0A Bairro: ${currentBairro}`

	if (!verifyCepRegister()) {
		showCepBox(true)

		btnConfirm.onclick = async () => {
			const verify = await searchCep(cepInput.value, true)

			if (!verify) return;

			showCepBox(false)
		}

	} else {
		const verifyStorage = await verifyRegioes(localStorage.getItem("CEP"))

		if (!verifyStorage) {
			showAlert(alertContent, localStorage.getItem("CEP"))
			return;
		}

		window.open(link, "_blank")
	}
}

export function returnIcons(extras) {
	const keys = Object.keys(icon)
	const isArray = Array.isArray(extras) ? extras : [extras]

	if (extras == "all") {
		return Object.values(icon).join("")
	}

	const iconesMapeados = isArray.map((e) => {
		let iconItem

		if (extras) {
			iconItem = keys.find(element => element.toLowerCase() === e.toLowerCase())

			return icon[iconItem]
		}
	})

	return iconesMapeados.join("")
}