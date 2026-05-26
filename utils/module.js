export const bkUrl = `https://webservice-tfbackend.onrender.com`

export const module = {

	async jsonCopy() {
		const res = await fetch(`${bkUrl}/returnPlanosJson`, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({})
		});

		const data = await res.json()
		const dataFixed = JSON.parse(data)

		return dataFixed
	},

	async jsonConfigCopy() {
		const res = await fetch(`${bkUrl}/returnConfigJson`, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({})
		});

		const data = await res.json()
		const dataFixed = JSON.parse(data)

		return dataFixed
	},

	async jsonRegioesCopy() {
		const res = await fetch(`${bkUrl}/returnRegioesJson`, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({})
		});

		const data = await res.json()
		const dataFixed = JSON.parse(data)

		return dataFixed
	},

	async carregarPlanos() {
		const data = await this.jsonCopy()
		const planos = data["basicos"]

		return planos
	},

	async carregarCombos() {
		const data = await this.jsonCopy()
		const combos = data["combos"]

		return combos
	},

	async carregarOfertas() {
		const data = await this.jsonCopy()
		const planos = data["destaques"]

		return planos
	},

	tudoMinusculo(value) {
		const lower = value.toLowerCase()
		const result = lower.charAt(0).toUpperCase() + lower.slice(1)

		return result
	},

	tudoMaisculo(value) {
		const upper = String(value).toUpperCase()

		return upper
	},

	returnEstrelas(valor) {

		const nilStar = `
		<s class="selfStar">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
		<path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
		</svg>
		</s>
		`

		const filledStar = `
		<s class="selfStar">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
				<path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
			</svg>
		</s>`;

		const halfStar = `
		<s class="selfStar">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
			<path d="m606-286-33-144 111-96-146-13-58-136v312l126 77ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
			</svg>
		</s>
		`

		let finalHTML =
			valor > 1 && valor < 2 ? filledStar + halfStar + nilStar.repeat(3) :
				valor == 2 ? filledStar.repeat(valor) + nilStar.repeat(3) :
					valor > 2 && valor < 3 ? filledStar.repeat(2) + halfStar + nilStar.repeat(2) :
						valor == 3 ? filledStar.repeat(valor) + nilStar.repeat(2) :
							valor > 3 && valor < 4 ? filledStar.repeat(3) + halfStar + nilStar.repeat(1) :
								valor == 4 ? filledStar.repeat(valor) + nilStar.repeat(1) :
									valor > 4 && valor < 5 ? filledStar.repeat(4) + halfStar :
										filledStar.repeat(5)

		return finalHTML

	},

	averageColor(valor) {

		let finalValue =
			valor > 1 && valor < 2 ? 1.5 :
				valor > 2 && valor < 3 ? 2.5 :
					valor > 3 && valor < 4 ? 3.5 :
						valor > 4 && valor < 5 ? 4.5 :
							valor


		const colors = {
			"1": "red",
			"1.5": "orangered",
			"2": "var(--orange)",
			"2.5": "orange",
			"3": "yellow",
			"3.5": "yellow",
			"4": "royalblue",
			"4.5": "rgb(25, 185, 25)",
			"5": "var(--green)"
		};

		return colors[finalValue]

	},

	async returnViabilidades() {
		const data = await this.jsonRegioesCopy()

		const regioes = data["regioes"]

		return regioes
	},
}

export const debounce = {
	processActives: [],

	counter: 0,
	time: 0,
	initialId: 0,

	Add(identifier, initialTime) {

		let type = initialTime < 1000 ? "mil" : "seconds"
		let timing;

		this.counter += 1
		let currentTime = initialTime

		this.initialId += 1
		let id = this.initialId

		this.processActives.push({ identifier: `${identifier}`, duration: initialTime, process: id += 1 })

		if (type == "seconds") {
			timing = setInterval(() => {
				if (currentTime > 0) {
					currentTime -= 1000

				}
			}, 1000)
		} else {
			timing = setInterval(() => {
				if (currentTime > 0) {
					currentTime -= 100

				}
			}, 100)
		}

		const remove = setInterval(() => {
			if (currentTime <= 0) {
				const findIdentifier = this.processActives.findIndex(p => p.identifier == identifier)

				if (!findIdentifier !== -1) {
					this.processActives.splice(findIdentifier.id + 1, 1);

					[remove, timing].forEach(clearInterval)
				}
			}
		}, 100)
	},

	Check(identifier) {
		const findProcess = this.processActives.find(v => v.identifier === identifier)

		if (!findProcess) return false;

		return true
	}
}