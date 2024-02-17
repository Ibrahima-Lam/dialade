
export async function getData(url, callback) {
    const data = await fetch(url)
    const res = await data.json()
    callback(res)
}

export class Calendar {
    date
    mois = ["Janvier", "Février", "Mars", "Avril", "Mais", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Descembre"]
    semaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

    constructor(date) {
        this.date = date
    }

    jourSemaine(dt = null) {
        return this.semaine[dt?.getDay() ?? this.date.getDay()]
    }

    nomMois(dt = null) {
        return this.mois[dt?.getMonth() ?? this.date.getMonth()]
    }

    finDuMois(dt = null) {
        const end = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if (this.date.getFullYear() % 4 === 0) end[1] = 29
        return end[dt?.getMonth() ?? this.date.getMonth()]
    }

    premierJour() {
        const dt = this.date
        dt.setDate(1)
        return {
            index: dt.getDay(),
            nom: this.jourSemaine(dt)
        }
    }

    dernierJour() {
        const dt = this.date
        dt.setDate(this.finDuMois())
        return {
            index: dt.getDay(),
            nom: this.jourSemaine(dt)
        }
    }

    frDate() {

        return `${this.jourSemaine()}, le ${this.date.getDate()} ${this.nomMois()} ${this.date.getFullYear()}`
    }

    frDayDate() {
        const date = this.date
        date.setMinutes(date.getMinutes() + 1)

        const dt = new Date()
        let day = dt.getDate()
        dt.setHours(0, 0, 0)

        const dt1 = new Date()
        dt1.setDate(day + 1)
        dt1.setHours(0, 0, 0)

        if (+date.getTime() > +dt.getTime() && +date.getTime() < +dt1.getTime()) return "Aujourd'hui"

        dt.setDate(day + 1)
        dt1.setDate(day + 2)
        if (+date.getTime() > +dt.getTime() && +date.getTime() < +dt1.getTime()) return "Demain"
        dt.setDate(day - 1)
        dt1.setDate(day)
        if (+date.getTime() > +dt.getTime() && +date.getTime() < +dt1.getTime()) return "Hier"
        return this.frDate()
    }

    next() {
        const date = new Date()
        date.setHours(0, 0, 0)
        return this.date.getTime() >= date.getTime()
    }
}