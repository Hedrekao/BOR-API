var fetch = require('node-fetch')
var https = require('https')



const fetchPastMatchesData = async function ()
{
    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    const response = await fetch(`https://rozgrywki.zprp.pl/api/pokaz_terminarz.php?Rozgrywki=10159&Sort=2&DniMinus=999`, { agent })

    const result = await response.json()

    let i = 0;
    let j = 0;
    const resultObject = [];
    for (const matchNumber in result) {

        if (result[matchNumber].ID_zespoly_gosc == '336' || result[matchNumber].ID_zespoly_gosp == '336') {

            const matchData = await fetch(`https://rozgrywki.zprp.pl/api/pokaz_mecze_szczegoly.php?Zawody=${result[matchNumber].IdZawody
                }`, { agent })

            const matchDataJson = await matchData.json()

            // I THINK ITS NOT POSSIBLE GOALS AFTER FULL TIME IN CASE THERE WAS TIE
            resultObject[i] = {
                teamHome: matchDataJson[0][0].ID_zespoly_gosp_ZespolNazwa,
                teamAway: matchDataJson[0][0].ID_zespoly_gosc_ZespolNazwa,
                date: result[matchNumber].ZawodyData,
                time: result[matchNumber].ZawodyGodzina,
                winner: result[matchNumber].zwyciezca,
                was_draw: result[matchNumber].czy_remis,
                teamHomeScore: result[matchNumber].wynik_gosp_full,
                teamAwayScore: result[matchNumber].wynik_gosc_full,
                teamHomePenalty: result[matchNumber].dogrywka_karne_gosp,
                teamAwayPenalty: result[matchNumber].dogrywka_karne_gosc,
                location: matchDataJson[0][0].Hala_miasto
            }
            i++

        }
    }

    resultObject.reverse()


    console.log('past matches loaded')
    return resultObject

}

module.exports = fetchPastMatchesData