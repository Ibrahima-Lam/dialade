import { getData } from "./src.js"
const cmp = document.getElementById('cmp');
let comp = []


window.addEventListener('load', async function (e) {
    comp = JSON.parse(this.sessionStorage.getItem('competitions')) ?? await getCompetitions()
    await constructSelect()

})

async function constructSelect() {
    let competition = sessionStorage.getItem("competition")

    comp.forEach(element => {
        const opt = document.createElement("option")
        opt.innerText = element.nomCompetition
        opt.value = element.codeCompetition
        if (competition === element.codeCompetition) opt.selected = true
        cmp.append(opt)
    });
}
if (ServiceWorker in navigator) {
    navigator.serviceWorker.register("js/sw.js")

    navigator.serviceWorker.ready.then(reg => {
        console.log("service worker registered");
    }).catch(error => {
        console.log("error");
    })


} else {
    console.log("No service Worker in navigator");
}