import {
    contratarPlano,
    generatePlanHtml,
    returnIcons,
    searchCep,
    showAlert,
    verifyCepRegister
} from "./fun/functions.js";
import { alertList } from "./loads/alerts.js";
import { module } from "./utils/module.js";

const cepInfo = document.querySelector("#cepInfo span");
const bairroInfo = document.querySelector("#bairroInfo span");
const cepBox = document.querySelector(".cepBox");
const btnConfirm = document.getElementById("searchCep");
const btnEditInfo = document.querySelector(".editInfo");
const cepInput = document.querySelector(".cepInput");
const url = `https://ft-backend-q0xy.onrender.com`;

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
        const seletorAlvo = entry.target.getAttribute("data-target");
        const alvo = document.querySelector(seletorAlvo);

        if (entry.isIntersecting) {
            alvo.classList.add("toZeroLeft");
        } else {
            alvo.classList.remove("toZeroLeft");
        }
    });
}, { threshold: .2 });

const toScaleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const seletorAlvo = entry.target.getAttribute("data-target");
        document.querySelectorAll(seletorAlvo).forEach((e) => {
            if (entry.isIntersecting) {
                e.classList.add("toScale");
            } else {
                e.classList.remove("toScale");
            }
        });
    });
}, { threshold: .4 });

const toOpacityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const seletorAlvo = entry.target.getAttribute("data-target");
        document.querySelectorAll(seletorAlvo).forEach((e) => {
            if (entry.isIntersecting) {
                e.classList.add("toOpacity");
            } else {
                e.classList.remove("toOpacity");
            }
        });
    });
}, { threshold: .2 });

const toScaleRotateObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const seletorAlvo = entry.target.getAttribute("data-target");
        document.querySelectorAll(seletorAlvo).forEach((e) => {
            if (entry.isIntersecting) {
                e.classList.add("toScaleRotate");
            } else {
                e.classList.remove("toScaleRotate");
            }
        });
    });
}, { threshold: .1 });

const toFillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const seletorAlvo = entry.target.getAttribute("data-target");
        document.querySelectorAll(seletorAlvo).forEach((e) => {
            if (entry.isIntersecting) {
                e.classList.add("toFill");
            } else {
                e.classList.remove("toFill");
            }
        });
    });
}, { threshold: .4 });

const toTopObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const seletorAlvo = entry.target.getAttribute("data-target");
        document.querySelectorAll(seletorAlvo).forEach((e) => {
            if (entry.isIntersecting) {
                e.classList.add("toTop");
            } else {
                e.classList.remove("toTop");
            }
        });
    });
}, { threshold: .5 });

document.addEventListener("DOMContentLoaded", async () => {
    updateInfo();

    const [combos, planos, ofertas] = await Promise.all([
        module.carregarCombos(),
        module.carregarPlanos(),
        module.carregarOfertas()
    ]);

    toLeftObserver.observe(document.querySelector(".blockedImage"));
    toScaleRotateObserver.observe(document.querySelector("#planos"));
    toLeftObserver.observe(document.querySelector("#numeros"));

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

    const columnPlansOptions = document.querySelector(".columnPlansOptions");
    const plansContainer = document.querySelector(".plansContainer");
    const planTypeBtns = document.querySelectorAll(".planTypeBtn");
    const getAllPlansBank = await module.jsonCopy();
    const taxaTxt = document.querySelector(".taxa");

    function pushHtml(ex) {
        const contratarBox = plansContainer.querySelector(".contratarBox");
        const flexPlanInfo = plansContainer.querySelector(".flexPlanInfo");

        let appsTable = [];
        let isConfirmed = false;

        let appsBox = flexPlanInfo.querySelector(".appsBox");
        if (!appsBox) {
            appsBox = document.createElement("div");
            appsBox.className = "appsBox";
            flexPlanInfo.appendChild(appsBox);
        }

        if (contratarBox) contratarBox.style.display = "none";
        if (taxaTxt) taxaTxt.style.display = "none";

        appsBox.style.display = "";
        appsBox.innerHTML = `
            <small class="appsChoiceText">Escolha ${ex["escolhas"]} Apps </small>
            <div class="appsContainer">${returnIcons(ex["apps"])}</div>
            <button class="confirmAppsBtn" style="display:none">Confirmar</button>
        `;

        const appsIcons = appsBox.querySelectorAll(".appsContainer i");
        const confirmBtn = appsBox.querySelector(".confirmAppsBtn");
        const contratarBtn = plansContainer.querySelector(".contratarPlanoBtn");

        appsIcons.forEach((icon) => {
            icon.onclick = () => {
                const getNameAttr = icon.getAttribute("name");
                const getSelectedIcons = appsBox.querySelectorAll(".orangeBorder").length;

                if (!icon.classList.contains("orangeBorder")) {
                    if (getSelectedIcons == ex["escolhas"]) return;
                    icon.classList.add("orangeBorder");
                    appsTable.push(getNameAttr);
                } else {
                    icon.classList.remove("orangeBorder");
                    const locateIndex = appsTable.indexOf(getNameAttr);
                    appsTable.splice(locateIndex, 1);
                }

                appsTable.length == ex["escolhas"] ? confirmBtn.style.display = "" : confirmBtn.style.display = "none";

                confirmBtn.onclick = () => {
                    if (contratarBox) contratarBox.style.display = "";
                    if (taxaTxt) taxaTxt.style.display = "";
                    appsBox.style.display = "none";

                    const flexIncludedApps = document.querySelector(".flexIncludedApps");
                    if (flexIncludedApps) {
                        flexIncludedApps.innerHTML = `${returnIcons(appsTable)}`;
                    }

                    isConfirmed = true;
                };

                if (contratarBtn) {
                    contratarBtn.onclick = () => {
                        if (!isConfirmed) return;
                        contratarPlano(ex, alertList.cepUnavailable, appsTable);
                    };
                }
            };
        });
    }

    function setupChoiceButton(ex) {
        const contratarBox = plansContainer.querySelector(".contratarBox");
        if (!contratarBox) return;

        let choiceAppsBtn = contratarBox.querySelector(".choiceAppsBtn");
        if (!choiceAppsBtn) {
            choiceAppsBtn = document.createElement("i");
            choiceAppsBtn.className = "choiceAppsBtn";
            choiceAppsBtn.innerHTML = `
                <i title="Adicionar Apps" class="choiceAppsBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="M720-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-600 40q-33 0-56.5-23.5T40-200v-560q0-33 23.5-56.5T120-840h560q33 0 56.5 23.5T760-760v200h-80v-80H120v440h520v80H120Zm0-600h560v-40H120v440h520v80H120Zm0 0v-40 40Z"/>
                    </svg>
                </i>
            `;
            contratarBox.appendChild(choiceAppsBtn);
        }

        choiceAppsBtn.onclick = () => {
            pushHtml(ex);
        };
    }

    getAllPlansBank["combos"].forEach((ex) => {
        let recomendedHtml = ex["destaque"] ? "Recomendado" : "Combo";

        plansContainer.classList.remove("destaque_azul");

        if (ex["destaque"]) {
            plansContainer.classList.add("destaque");
            plansContainer.innerHTML = generatePlanHtml(ex);
        } else {
            plansContainer.classList.remove("destaque");
        }

        const div = document.createElement("div");
        div.className = "basicPlanOption planOption";
        div.innerHTML = `
            <h3 class="planName">${ex["nome"]}</h3>
            <h3 class="planTech">${ex["tecnologia"]}</h3>
            <h3 class="recomended">${recomendedHtml}</h3>
        `;

        columnPlansOptions.appendChild(div);
        plansContainer.innerHTML = generatePlanHtml(ex);
        
        if (ex["custom"]) {
            setupChoiceButton(ex);
            pushHtml(ex);
        }
    });

    planTypeBtns.forEach((e) => {
        e.onclick = () => {
            plansContainer.innerHTML = "";
            plansContainer.style.display = "none";
            columnPlansOptions.innerHTML = "";

            const getThisData = e.getAttribute("data");

            if (getThisData === "basics") {
                getAllPlansBank["basicos"].forEach((ex) => {
                    let recomendedHtml = ex["destaque"] ? "Recomendado" : "Básico";

                    plansContainer.classList.remove("destaque_azul");

                    if (ex["destaque"]) {
                        plansContainer.classList.add("destaque");
                    } else {
                        plansContainer.classList.remove("destaque");
                    }

                    const div = document.createElement("div");
                    div.className = "basicPlanOption planOption";
                    div.innerHTML = `
                        <h3 class="planName">${ex["nome"]}</h3>
                        <h3 class="planTech">${ex["tecnologia"]}</h3>
                        <h3 class="recomended">${recomendedHtml}</h3>
                    `;

                    div.onclick = () => {
                        plansContainer.style.display = "";
                        plansContainer.innerHTML = generatePlanHtml(ex);
                    };

                    columnPlansOptions.appendChild(div);
                });
            } else {
                getAllPlansBank["combos"].forEach((ex) => {
                    plansContainer.classList.remove("destaque");

                    if (ex["destaque"]) {
                        plansContainer.classList.add("destaque_azul");
                    } else {
                        plansContainer.classList.remove("destaque_azul");
                    }

                    let recomendedHtml = ex["destaque"] ? "Recomendado" : "Combo";

                    const div = document.createElement("div");
                    div.className = "comboPlanOption planOption";
                    div.innerHTML = `
                        <h3 class="planName">${ex["nome"]}</h3>
                        <h3 class="planTech">${ex["tecnologia"]}</h3>
                        <h3 class="recomended">${recomendedHtml}</h3>
                    `;

                    div.onclick = () => {
                        plansContainer.style.display = "";
                        plansContainer.innerHTML = generatePlanHtml(ex);

                        if (ex["custom"]) {
                            setupChoiceButton(ex);
                            pushHtml(ex);
                        }
                    };

                    columnPlansOptions.appendChild(div);
                });
            }
        };
    });
});
