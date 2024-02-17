<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore-compat.js"></script>

    <title>Teste</title>
</head>

<body>
    <h1>Tester le code</h1>
    <button id="btn">Click ici!</button>

    <script>
        const firebaseConfig = {
            apiKey: "AIzaSyAE6ZebPmaEtArRFgF9Y6cxvRiKLa9a8I0",
            authDomain: "dialade.firebaseapp.com",
            projectId: "dialade",
            storageBucket: "dialade.appspot.com",
            messagingSenderId: "805128164712",
            appId: "1:805128164712:web:5ad3f44a532a573170b2dd",
            measurementId: "G-XTCMDNGF7P"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
    </script>
    <script>
        const btn = document.getElementById('btn');
        btn.addEventListener('click', async function(e) {
            const req = await fetch('api.php/score')
            const res = await req.json()
            console.log(res);
            res.forEach(element => {
                db.collection('score').doc(element.idGame.toString()).set(element)
            });
        })
    </script>
</body>

</html>