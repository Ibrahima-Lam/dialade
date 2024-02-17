
export class Classeur {
    #criteresDefaut = ['call', "points", "diff", "match", "bm", "be", "id"]
    #teams
    #games

    constructor(games, teams) {
        this.#games = games
        this.#teams = teams
    }
    classer(criteres = [], callback = null) {
        const crits = criteres.length === 0 ? this.#criteresDefaut : criteres
        const statGames = this.#teamsStatGames()
        const statTeams = this.#statByTeam(statGames)
        return statTeams.sort((a, b) => {
            return this.#sorter(a, b, crits, callback)
        }).map((element, index) => {
            return {
                num: index + 1,
                ...element
            }
        })
    }

    #sorter(a, b, tab = [], callback = null) {

        for (const key of tab) {

            if (key === 'match') {
                const res = this.#confrontation(a, b)
                if (!res == 0) return res
            }
            if (key === 'call') {
                let res = 0
                if (callback) res = callback(a, b)
                if (!res == 0) return res
                else continue
            }

            if (a[key] === b[key]) {
                continue
            }

            if (key === "id" || key === "be") {
                return a[key] <= b[key] ? -1 : 1
            }
            return a[key] > b[key] ? -1 : 1
        }
        return 0
    }

    #confrontation(a, b) {
        const { id: ida } = a
        const { id: idb } = b
        let res = 0
        this.#games.forEach(element => {
            const { id: idhome, but: buthome, nom: nomhome } = element.home
            const { id: idaway, but: butaway, nom: nomaway } = element.away
            const diff = buthome - butaway
            if (idhome == ida && idaway == idb) {
                res = diff > 0 ? -1 : (diff < 0 ? 1 : 0)
            } else if (idhome == idb && idaway == ida) {
                res = diff > 0 ? 1 : (diff < 0 ? -1 : 0)
            }
        });
        return res
    }
    #teamsStatGames() {
        const elements = []
        this.#teams.forEach((value) => {
            let indice = value.idParticipant
            this.#games.forEach((element, index, array) => {
                const { id: idhome, but: buthome, nom: nomhome } = element.home
                const { id: idaway, but: butaway, nom: nomaway } = element.away
                if (idhome == indice || idaway == indice) {
                    let id = idaway
                    let nom = nomaway
                    let marque = butaway
                    let encaisse = buthome

                    if (idhome == indice) {
                        id = idhome
                        nom = nomhome
                        marque = buthome
                        encaisse = butaway
                    }
                    const diff = marque - encaisse
                    const stat = {
                        id: id,
                        nom: nom,
                        diff: diff,
                        decision: diff > 0 ? "v" : (diff < 0 ? "d" : "n"),
                        marque: marque,
                        encaisse: encaisse
                    }
                    elements.push(stat)
                }
            })
        })
        return elements
    }

    #statByTeam(elements) {

        const result = {}
        this.#teams.forEach((value) => {
            let indice = value.idParticipant
            const stats = {
                id: indice,
                nom: value.nomEquipe,
                match: 0,
                nv: 0,
                nn: 0,
                nd: 0,
                points: 0,
                diff: 0,
                bm: 0,
                be: 0,
                res: ''
            }
            result[indice] = stats
        })

        elements.forEach((element) => {
            result[element.id].match += 1
            result[element.id].nv += element.decision === "v" ? 1 : 0
            result[element.id].nn += element.decision === "n" ? 1 : 0
            result[element.id].nd += element.decision === "d" ? 1 : 0
            result[element.id].points += element.diff > 0 ? 3 : (element.diff < 0 ? 0 : 1)
            result[element.id].diff += element.diff
            result[element.id].bm += element.marque
            result[element.id].be += element.encaisse
            result[element.id].res += `<button class="${element.decision}">${element.decision}</button>`
        })
        return Object.values(result)
    }

}

