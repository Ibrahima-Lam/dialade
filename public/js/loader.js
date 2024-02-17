
const firebaseConfig = {
    apiKey: "AIzaSyAE6ZebPmaEtArRFgF9Y6cxvRiKLa9a8I0",
    authDomain: "dialade.firebaseapp.com",
    projectId: "dialade",
    storageBucket: "dialade.appspot.com",
    messagingSenderId: "805128164712",
    appId: "1:805128164712:web:5ad3f44a532a573170b2dd",
    measurementId: "G-XTCMDNGF7P"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


async function getGames() {
    const games = []
    const snapshot = await db.collection('game').get()
    snapshot.forEach(doc => {
        games.push(doc.data())
    })
    return games
}
async function onGames(callback) {
    await db.collection('game').onSnapshot(snapshot => {
        const games = []

        snapshot.forEach(doc => {
            games.push(doc.data())
        })
        callback(games)
    })
}

async function getCompetitions() {
    const competitions = []
    const snapshot = await db.collection('competition').get()
    snapshot.forEach(doc => {
        competitions.push(doc.data())
    })
    sessionStorage.setItem('competitions', JSON.stringify(competitions))

    return competitions
}

async function getParticipants(comp = null) {
    const snapshot = comp ? await db.collection('participant').where('idCompetition', '==', comp).get() : await db.collection('participant').get()
    const equipes = await getEquipes()
    const participants = []
    snapshot.forEach(doc => {
        const dt = doc.data()
        const elmt = equipes.filter(val => val.idEquipe == dt.idEquipe)[0] ?? {}
        participants.push({
            ...dt,
            ...elmt
        })
    })
    sessionStorage.setItem('participants', JSON.stringify(participants))

    return participants
}

async function getParticipations() {
    const snapshot = await db.collection('participation').get()
    const groupes = await getGroupes()
    const participants = await getParticipants()
    const partipations = []
    snapshot.forEach(doc => {
        const participation = doc.data()
        const equipe = participants.filter(val => val.idParticipant == participation.idParticipant)[0] ?? {}
        const groupe = groupes.filter(val => val.idGroupe == participation.idGroupe)[0] ?? {}
        partipations.push({
            ...participation,
            ...groupe,
            ...equipe
        })
    })
    sessionStorage.setItem('participations', JSON.stringify(partipations))

    return partipations
}

async function getGroupes(comp = null) {
    let snapshot = comp ? await db.collection('groupe').where('codeCompetition', '==', comp).get() : await db.collection('groupe').get()
    const competitions = await getCompetitions()
    const groupes = []
    snapshot.forEach(doc => {
        const grp = doc.data()
        const competition = competitions.filter(val => val.codeCompetition == grp.codeCompetition)[0] ?? {}
        groupes.push({
            ...grp,
            ...competition
        })
    })
    const grps = groupes.sort((a, b) => {
        if (a.codeCompetition == b.codeCompetition) return a.nomGroupe <= b.nomGroupe ? -1 : 1
        return a.codeCompetition <= b.codeCompetition ? -1 : 1
    })
    sessionStorage.setItem('groupes', JSON.stringify(grps))
    return grps

}

async function getEquipes() {

    const snapshot = await db.collection('equipe').get()
    const equipes = []
    snapshot.forEach(doc => {
        equipes.push(doc.data())
    })
    return equipes
}

async function getPhases() {

    const snapshot = await db.collection('phase').get()
    const phases = []
    snapshot.forEach(doc => {
        phases.push(doc.data())
    })
    sessionStorage.setItem('phases', JSON.stringify(phases))

    return phases

}

async function getNiveaux() {
    const snapshot = await db.collection('niveau').get()
    const niveaux = []
    snapshot.forEach(doc => {
        niveaux.push(doc.data())
    })
    sessionStorage.setItem('niveaux', JSON.stringify(niveaux))

    return niveaux
}

async function getScores() {
    const snapshot = await db.collection('score').get()
    const scores = []
    snapshot.forEach(doc => {
        scores.push(doc.data())
    })
    sessionStorage.setItem('scores', JSON.stringify(scores))

    return scores
}
async function onScores(callback) {
    await db.collection('score').onSnapshot(snapshot => {
        const scores = []
        snapshot.forEach(doc => {
            scores.push(doc.data())
        })
        sessionStorage.setItem('scores', JSON.stringify(scores))

        callback(scores)
    })
}


async function getTiraubuts() {
    const snapshot = await db.collection('tiraubut').get()
    const scores = []
    snapshot.forEach(doc => {
        scores.push(doc.data())
    })
    sessionStorage.setItem('tiraubuts', JSON.stringify(scores))

    return scores
}
async function onTiraubuts(callback) {
    await db.collection('tiraubut').onSnapshot(snapshot => {

        const scores = []
        snapshot.forEach(doc => {
            scores.push(doc.data())
        })
        sessionStorage.setItem('tiraubuts', JSON.stringify(scores))

        callback(scores)
    })
}

async function getActualites() {
    const snapshot = await db.collection('actualite').get()
    const actus = []
    snapshot.forEach(doc => {
        actus.push(doc.data())
    })
    sessionStorage.setItem('actualites', JSON.stringify(actus))

    return actus
}
async function onActualites(callback) {
    let actus = []
    await db.collection('actualite').onSnapshot(snapshot => {
        actus = []
        snapshot.forEach(doc => {
            actus.push(doc.data())
        })
        sessionStorage.setItem('actualites', JSON.stringify(actus))
        callback(actus)
    })
}

async function gameChargement() {
    const games = await getGames()
    const participants = await getParticipants()
    const scores = await getScores()
    const tireaubuts = await getTiraubuts()
    const niveaux = await getNiveaux()
    const phases = await getPhases()
    const groupes = await getGroupes()
    const data = games.map(element => {
        const home = participants.filter(value => element.homeGame == value.idParticipant)[0] ?? {}
        const homeTeam = {
            idHome: home.idParticipant,
            home: home.nomEquipe
        }
        const away = participants.filter(value => element.awayGame == value.idParticipant)[0] ?? {}
        const awayTeam = {
            idAway: away.idParticipant,
            away: away.nomEquipe
        }
        const groupe = groupes.filter(value => element.idGroupe == value.idGroupe)[0] ?? {}
        const niveau = niveaux.filter(value => element.codeNiveau == value.codeNiveau)[0] ?? {}
        const phase = phases.filter(value => groupe?.codePhase == value.codePhase)[0] ?? {}
        const score = scores.filter(value => element.idGame == value.idGame)[0] ?? {
            homeScore: null,
            awayScore: null,
        }
        const tiraubut = tireaubuts.filter(value => element.idGame == value.idGame)[0] ?? {
            homeScorePenalty: null,
            awayScorePenalty: null,
        }
        return {
            ...element,
            ...homeTeam,
            ...awayTeam,
            ...groupe,
            ...phase,
            ...niveau,
            ...score,
            ...tiraubut
        }
    })
    sessionStorage.setItem('games', JSON.stringify(data))
    return data

}

function startLoading() {
    console.log('loading ...');
    const div = document.createElement('div')
    div.classList.add('chargement')
    div.innerText = 'chargement....'
    document.body.append(div)
}
function endLoading() {
    console.log('end loading');
    const element = document.querySelector('.chargement')
    document.body.querySelector('.chargement').remove()
}

async function signInUser(email, password) {
    let res = false
    await firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user);
            res = true
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    return res

}

async function setToFirebase(collection, idDoc, data) {
    await db.collection(collection).doc(idDoc.toString()).set(data)

}