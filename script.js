import {
    contratarPlano,
    generatePlanHtml,
    returnIcons,
    returnSvgIcon,
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

    const plansGrid = document.querySelector(".plansGrid")
    const basicPlans = plansGrid.querySelector(".basicPlans")
    const comboPlans = plansGrid.querySelector(".comboPlans")
    let isConfirmed = false

    let basicItems = basicPlans.children.length
    let comboItems = comboPlans.children.length

    function pushHtml(div, ex) {

        isConfirmed = false
        let appsTable = []

        const plansContainer = div.parentElement
        const mainPlanInfo = div
        const subMainPlanInfo = plansContainer.querySelector(".subMainPlanInfo")

        const consultarBtn = mainPlanInfo.querySelector(".consultarPlano")
        const btnWhatsapp = mainPlanInfo.querySelector(".whatsappBtn")
        consultarBtn.textContent = "Recolher"

        const defaultSubHtml = subMainPlanInfo.innerHTML

        subMainPlanInfo.innerHTML = `
                <div class="appsContainer">
                    ${returnIcons(ex["apps"])}
                </div>

                <button class="confirmBtn" style="display:none">Confirmar</button>
            `

        const appIcon = subMainPlanInfo.querySelectorAll("i")
        const includedApps = mainPlanInfo.querySelector(".includedApps")

        appIcon.forEach((e) => {
            e.onclick = () => {

                const selectedSelector = subMainPlanInfo.querySelectorAll(".orangeBorder")

                const getName = e.getAttribute("name")

                if (!e.classList.contains("orangeBorder")) {
                    if (selectedSelector.length == ex["escolhas"]) return;
                    e.classList.add("orangeBorder")
                    appsTable.push(getName)
                } else {
                    const getIndex = appsTable.indexOf(getName)

                    if (getIndex <= -1) return;
                    e.classList.remove("orangeBorder")
                    appsTable.splice(getIndex, 1)
                }

                const confirmBtn = subMainPlanInfo.querySelector(".confirmBtn")

                if (appsTable.length == ex["escolhas"]) {
                    confirmBtn.style.display = ""
                } else {
                    confirmBtn.style.display = "none"
                }

                confirmBtn.onclick = () => {
                   if (appsTable.length !== ex["escolhas"]) return;
                    includedApps.innerHTML = returnIcons(appsTable)
                    subMainPlanInfo.innerHTML = defaultSubHtml
                    isConfirmed = true
                }

                btnWhatsapp.onclick = () => {
                    if (!isConfirmed) return;
                        contratarPlano(ex, alertList.cepUnavailable, appsTable)
        }
            }
        })
    }

    const getAllPlansBank = await module.jsonCopy()

    getAllPlansBank["basicos"].forEach((ex) => {

        const div = document.createElement("div")
        div.className = "plansContainer"
        div.innerHTML = generatePlanHtml(ex, "basic")

        if (ex["destaque"]) {
            div.style.order = "1"
        } else {
            basicItems++
            div.style.order = basicItems + 1
        }

        basicPlans.appendChild(div)

        const btnConsultar = div.querySelector(".consultarPlano")
        const btnWhatsapp = div.querySelector(".whatsappBtn")
        const subMainPlanInfo = div.querySelector(".subMainPlanInfo")

        btnConsultar.onclick = (e) => {

            if (!subMainPlanInfo.classList.contains("subMainPlanInfo-actived")) {
                subMainPlanInfo.classList.add("subMainPlanInfo-actived")
                btnConsultar.textContent = "Recolher"
            } else {
                subMainPlanInfo.classList.remove("subMainPlanInfo-actived")
                btnConsultar.textContent = "Consultar"
            }
        }

        btnWhatsapp.onclick = () => {
            contratarPlano(ex, alertList.cepUnavailable, [])
        }
    })

    getAllPlansBank["combos"].forEach((ex) => {
        const div = document.createElement("div")
        div.className = "plansContainer"
        div.innerHTML = generatePlanHtml(ex, "combo")

        if (ex["destaque"]) {
            div.style.order = "1"
        } else {
            comboItems++
            div.style.order = comboItems + 1
        }

        comboPlans.appendChild(div)

        const btnConsultar = div.querySelector(".consultarPlano")

        const addAppBtn = div.querySelector(".addApps")
        const subMainPlanInfo = div.querySelector(".subMainPlanInfo")
        const mainPlanInfo = div.querySelector(".mainPlanInfo")
        const includedApps = mainPlanInfo.querySelector(".includedApps")
        const icon = mainPlanInfo.querySelector(".includedApps i")

        if (ex["custom"]) {
            pushHtml(mainPlanInfo, ex)
            subMainPlanInfo.classList.add("subMainPlanInfo-actived")

                includedApps.onclick = () => {
                    if (!isConfirmed) return;
                    pushHtml(mainPlanInfo, ex)
                }

        }

        btnConsultar.onclick = (e) => {

            if (!subMainPlanInfo.classList.contains("subMainPlanInfo-actived")) {
                subMainPlanInfo.classList.add("subMainPlanInfo-actived")
                btnConsultar.textContent = "Recolher"
            } else {
                subMainPlanInfo.classList.remove("subMainPlanInfo-actived")
                btnConsultar.textContent = "Consultar"
            }
        }
    })
    
    const whatsappButtons = document.querySelectorAll(".whatsappBtn")
    
    whatsappButtons.forEach((e) => {
        e.onmouseenter = () => {
            e.innerHTML = returnSvgIcon("whatsapp")
        };

        e.onmouseleave = () => {
            e.innerHTML = "Whatsapp"
        };
    });

});
