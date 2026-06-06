import { icons } from "../assets/icons/icons.js";
import { updateInfo, showCepBox } from "../script.js";
import {
	debounce,
	module,
} from "../utils/module.js";

import {
	icon,
	caption
} from "./constants.js";

const cepInput = document.querySelector(".cepInput");
const alertBox = document.querySelector(".alertBox")
const btnConfirm = document.getElementById("searchCep");

const returnSpeedHtml = (el) => {
	let result = el < 200 ? "Conexão Estável" : "Alta Velocidade"

	return result
}

export function getAppContext(appName, data) {
	return (
		`
			<div class="appIconFlex">
			${returnIcons(appName)}
				<div class="appNameFlex">
					<h3 class="appName">${appName.toUpperCase()}</h3>
					<h3 class="streamType cyan_outlined">${data}</h3>
				</div>
			</div>
		`
	)
}

export function returnSvgIcon(iconName) {
	return icons[iconName] || ""
}

export function generatePlanHtml(ex, type) {

	let isTagged = ex["destaque"] ? "" : "none"
	let included = type == "basic" ? "none" : ""
	let includedApps = ex["custom"] ? `<h2>${ex["escolhas"]} <small>Apps</small> </h2>` : returnIcons(ex["apps"]) || ""

	return (`
		<span class="tag" style="display:${isTagged}">Recomendado</span>
		
		<div class="mainPlanInfo">
			<span class="planTitle">${ex["nome"].replace("MB", "MegaBytes")}</span>

			<div class="planSubtitle">

				${returnSvgIcon("wifi")}

				<h2 class="subTitle">${ex["megaBytes"]} <br> MEGA </h2>

				<div class="includedApps">
				<span style="display:${included}">Inclui</span>
					${includedApps}
				</div>
			</div>

			<div class="connectionBox">
				<article class="tecnologia">
					${returnSvgIcon("check")}

					<small class="connection">Wifi Conexão ${ex["tecnologia"]} </small>
				</article>

				<article class="fibraOptica">
					${returnSvgIcon("check")}

					<small class="fibra">100% Fibra Óptica </small>
				</article>
			</div>	

			<div class="plansButtons">
				<button class="consultarPlano">Consultar</button>
				<button class="whatsappBtn">Whatsapp</button>
			</div>
		</div>
		
		<div class="subMainPlanInfo">
			<div class="connectionSpeed">

			<article class="downloadContainer">
				<small class="speedContent" id="downloadContent">Download</small>

				<div class="speedContainer">
					${returnSvgIcon("download")}
					<span class="download">${ex["megaBytes"]}  <small> Mbps </small> </span>
				</div>
			</article>

			<article class="uploadContainer">
				<small class="speedContent" id="uploadContent">Upload</small>

				<div class="speedContainer">
					${returnSvgIcon("upload")}
					<span class="upload">${ex["megaBytes"] / 2} <small> Mbps </small> </span>
				</div>
			</article>

			</div>

			<hr class="longLine">

			<div class="priceContainer"> 
				<h2 class="price">R$ ${ex["valor"]}/mês</h2>
				<small class="taxa">+ Taxa de instalação de R$ 50,00</small>
			</div>

		</div>`)
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

export function showAnnouncement(ex) {

	const main = document.querySelector("main")
	const blockedImage = document.querySelector(".blockedImage")
	const header = document.querySelector("header")

	main.style.filter = "blur(10px)"
	blockedImage.style.filter = "blur(10px)"
	header.style.filter = "blur(10px)"

	let customContent = ex["custom"] ? `${ex["escolhas"]} Apps Inclusos` : ex["apps"].join(",").replaceAll(",", " & ").toUpperCase()

	return (
		`<div class="announcement">

			<button class="closeAnnouncement">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="blue">
					<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
				</svg>
			</button>

			<div class="announcementImage">
				<img src="${ex["imagem"]}" alt="Plano ${ex["nome"]}">
			</div>

			<article class="captionAnnouncement">
				<div class="announcementTitle">
					<h1>Aqui Na <span>Fluinet</span> você encontra</h1>
					<h2 class="megaByteSpeed">${ex["nome"].replace("MB", "Mega")} + <span>${customContent}</span></h2>
				</div>

				<div class="checkCaptions">

					<span>Internet Wifi de Alta Velocidade</span>
					<span>Por um preço Justo e acessível</span>
				</div>

				<div class="buttonsAnnouncement">
				<a href="#planos"><button class="consultarBtn">Consultar</button></a>
				<button class="whatsappButton">Whatsapp</button>
			</div>
			</article>

		</div>`
	)
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

export function returnName(app) {
    const keys = Object.keys(caption);

    const keyEncontrada = keys.find(key => key.toLowerCase() === app.toLowerCase());

    return keyEncontrada ? caption[keyEncontrada] : "Aplicativo não encontrado.";
}