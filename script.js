import { contratarPlano, returnIcons, searchCep, showAlert, verifyCepRegister } from "./fun/functions.js";
import { alertList } from "./loads/alerts.js";
import { module } from "./utils/module.js";

const cepInfo = document.querySelector("#cepInfo span");
const bairroInfo = document.querySelector("#bairroInfo span");
const cepBox = document.querySelector(".cepBox");
const btnConfirm = document.getElementById("searchCep");
const btnEditInfo = document.querySelector(".editInfo");
const cepInput = document.querySelector(".cepInput");
const url = `https://tfbackend-6iia.onrender.com`

export function updateInfo() {
	if (!verifyCepRegister()) {
		cepInfo.textContent = "Inserir";
		bairroInfo.textContent = "Inserir";
		return;
	}

	cepInfo.textContent = localStorage.getItem("CEP");
	bairroInfo.textContent = localStorage.getItem("Bairro");
}

export function showCepBox(bool) {
	const setFilter = (filter) => {
		document.querySelector("main").style.filter = filter;
		document.querySelector("header").style.filter = filter;
		document.querySelector(".blockedImage").style.filter = filter;
	};

	if (bool) {
		cepBox.style.display = "";
		setFilter("blur(5px)");

		document.getElementById("closeCepBox").onclick = () => {
			cepBox.style.display = 'none';
			setFilter("none");
		};
	} else {
		cepBox.style.display = "none";
		setFilter("none");
	}
}

const toLeftObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {

		const seletorAlvo = entry.target.getAttribute("data-target")
		const alvo = document.querySelector(seletorAlvo)

		if (entry.isIntersecting) {
			alvo.classList.add("toZeroLeft")
		} else {
			alvo.classList.remove("toZeroLeft")
		}
	});
}, { threshold: .2 });

const toScaleObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {

		const seletorAlvo = entry.target.getAttribute("data-target")
		const alvo = document.querySelectorAll(seletorAlvo).forEach((e) => {
			if (entry.isIntersecting) {
				e.classList.add("toScale")
			} else {
				e.classList.remove("toScale")
			}
		})

	});
}, { threshold: .4 });

const toOpacityObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {

		const seletorAlvo = entry.target.getAttribute("data-target")
		const alvo = document.querySelectorAll(seletorAlvo).forEach((e) => {
			if (entry.isIntersecting) {
				e.classList.add("toOpacity")
			} else {
				e.classList.remove("toOpacity")
			}
		})

	});
}, { threshold: .2 });

const toScaleRotateObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {

		const seletorAlvo = entry.target.getAttribute("data-target")
		const alvo = document.querySelectorAll(seletorAlvo).forEach((e) => {
			if (entry.isIntersecting) {
				e.classList.add("toScaleRotate")
			} else {
				e.classList.remove("toScaleRotate")
			}
		})

	});
}, { threshold: .1 });

const toFillObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {

		const seletorAlvo = entry.target.getAttribute("data-target")
		const alvo = document.querySelectorAll(seletorAlvo).forEach((e) => {
			if (entry.isIntersecting) {
				e.classList.add("toFill")
			} else {
				e.classList.remove("toFill")
			}
		})

	});
}, { threshold: .4 });

const toTopObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {

		const seletorAlvo = entry.target.getAttribute("data-target")
		const alvo = document.querySelectorAll(seletorAlvo).forEach((e) => {
			if (entry.isIntersecting) {
				e.classList.add("toTop")
			} else {
				e.classList.remove("toTop")
			}
		})

	});
}, { threshold: .5 });

document.addEventListener("DOMContentLoaded", async () => {
	updateInfo()

	const [combos, planos, ofertas] = await Promise.all([
		module.carregarCombos(),
		module.carregarPlanos(),
		module.carregarOfertas()
	]);

	toLeftObserver.observe(document.querySelector(".blockedImage"))

	toScaleRotateObserver.observe(document.querySelector("#planos")) 
	toLeftObserver.observe(document.querySelector("#numeros"))

	const minusculo = (e) => {
		const result = module.tudoMinusculo(e);
		return result;
	};

	btnEditInfo.onclick = () => {
		showCepBox(true);

		btnConfirm.onclick = async () => {
			const verify = await searchCep(cepInput.value, false);
			if (!verify) return;
			showCepBox(false);
		};
	};

	document.getElementById("closeAlert").onclick = () => {
		document.querySelector(".alertBox").style.display = "none";
	};

	const combosFixos = combos.filter(element => element.destaque == false);
	const flexCombos = document.querySelector(".flexCombos");
	let contador;
	let iconTable = [];

	if (combosFixos) {
		combosFixos.forEach((element, index) => {
			let isConfirmed = false

			const div = document.createElement("div");
			div.className = "plano comboFixo";
			div.id = `plano${index + 1}`;

			let resultHTML = element["custom"]
				? `<div class="boxChoiceIcons">
                    <span class="addChoice">Escolha ${element["escolhas"]} Apps </span> 
                    <i class='choiceBtn hoverGray'>
                        <svg class="choiceSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M720-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-600 40q-33 0-56.5-23.5T40-200v-560q0-33 23.5-56.5T120-840h560q33 0 56.5 23.5T760-760v200h-80v-80H120v440h520v80H120Zm0-600h560v-40H120v40Zm0 0v-40 40Z"/>
                        </svg>
                    </i>
                   </div>`
				: `<div class="columnAppsInclusos"><span>Inclui: </span>${returnIcons(element["apps"])}</div>`;

			div.innerHTML = `
                <div class="image" style="background: url('${element["imagem"]}')"></div>
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
                    <div class="icons">${resultHTML}</div>
                    <p class="caption grayText">${minusculo(element["legenda"])}</p>
                    <hr class="planoLine">
                    <p class="taxa">Taxa de instalação: 50,00R$</p>
                    <div class="priceBox">
                        <h2 class="price">Preço: <span>${element["valor"]}R$</span></h2>
                        <button class='contratar'>CONTRATAR</button>
                    </div>
                </div>`;

			flexCombos.appendChild(div)

			const defaultHTML = div.innerHTML

			if (element["custom"]) {

				const btnAddApps = div.querySelector(".choiceBtn")
				const boxChoiceIcons = div.querySelector(".boxChoiceIcons")

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

								div.querySelector(".resetHtml").onclick = () => {
									setupChoiceHtml()
								}
							}
						}
					})
				}

				btnAddApps.onclick = setupChoiceHtml
			}

			const btnContratar = div.querySelector(".contratar");
			btnContratar.onclick = async () => {
				if (element["custom"] && !isConfirmed) {
					showAlert(`Escolha ${element["escolhas"]} Apps para Prosseguir`)
					return;
				}

				contratarPlano(element, alertList.cepUnavailable, iconTable);
			};
		})
	}


	const planosFixos = planos.filter(element => element.destaque == false);
	const flexPlanos = document.querySelector(".flexPlanos");

	if (planosFixos) {
		planosFixos.forEach((element, index) => {
			const div = document.createElement("div");
			div.className = "plano planoFixo";
			div.id = `plano${index + 1}`;

			div.innerHTML = `
                <div class="image" style="background: url('${element["imagem"]}')"></div>
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
                </div>`;

			flexPlanos.appendChild(div);

			const btnContratar = div.querySelector(".contratar");
			btnContratar.onclick = async () => {
				contratarPlano(element, alertList.cepUnavailable, []);
			};
		});
	}
});