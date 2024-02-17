export function trContent({ id, num, nom, match, nv, nn, nd, points, bm, diff, be, res }) {
    return ` 
    <tr>
                <td class="num">${num}</td>
                <td class="nom">${nom}</td>
                <td class="point">${points}</td>
                <td class="diff">${diff >= 0 ? '+' + diff : diff}</td>
                <td class="bm">${bm}</td>
                <td class="be">${be}</td>
                <td class="match">
                    <div class="match-result">${res}</div>
                </td>
    </tr>
        
            `
}

export function tableElement(title, data) {
    return `  <h3 class="titre title">${title}</h3>
            <div class="table-container">
                <table class="table striped">
                    <thead>
                        <tr>
                            <th>Num</th>
                            <th>Equipes</th>
                            <th>Points</th>
                            <th>Diff</th>
                            <th>BM</th>
                            <th>BE</th>
                            <th>Matchs</th>
                            <!-- <th>NV</th>
                            <th>NN</th>
                            <th>ND</th> -->
                        </tr>
                    </thead>${data} <tbody>
                    </tbody>
                </table>
            </div>`
}