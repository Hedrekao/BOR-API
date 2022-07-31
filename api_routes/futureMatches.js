var fetch = require('node-fetch')
var https = require('https')

const getMonthName = (monthNumber) => {
    switch(monthNumber)
    {
        case 1:
            return 'Styczeń'
        case 2:
            return 'Luty'
        case 3:
            return 'Marzec'
        case 4:
            return 'Kwiecień'
        case 5:
            return 'Maj'
        case 6:
            return 'Czerwiec'
        case 7:
            return 'Lipiec'
        case 8:
            return 'Sierpień'
        case 9:
            return 'Wrzesień'
        case 10:
            return 'Październik'
        case 11:
            return 'Listopad'
        case 12:
            return 'Grudzień'
            
    }
}

const fetchFutureMatchesData = async function () {
    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    const response = await fetch(`https://rozgrywki.zprp.pl/api/pokaz_terminarz.php?Rozgrywki=10159&Sort=2&DniMinus=999`, { agent })

    const result = await response.json()

    let i = 0;
    let j = 0;
    const resultObject = [];
    let matchesThisMonth = [];
    let currentMonth;
    for (const matchNumber in result) {

        if (result[matchNumber].ID_zespoly_gosc == '336' || result[matchNumber].ID_zespoly_gosp == '336') {

            let monthNumber = parseInt(result[matchNumber].ZawodyData.split('.')[1])
            if (j == 0 && i == 0) {
                currentMonth = getMonthName(monthNumber)
            }

            if (getMonthName(monthNumber) != currentMonth) {
                resultObject[j] = {
                    month: currentMonth,
                    matches: matchesThisMonth
                }

                currentMonth = getMonthName(monthNumber)
                i = 0;
                j++;
                matchesThisMonth = []
            }



            const matchData = await fetch(`https://rozgrywki.zprp.pl/api/pokaz_mecze_szczegoly.php?Zawody=${result[matchNumber].IdZawody
                }`, { agent })

            const matchDataJson = await matchData.json()

            // I THINK ITS NOT POSSIBLE GOALS AFTER FULL TIME IN CASE THERE WAS TIE
            matchesThisMonth[i] = {
                teamHome: matchDataJson[0][0].ID_zespoly_gosp_ZespolNazwa,
                teamAway: matchDataJson[0][0].ID_zespoly_gosc_ZespolNazwa,
                date: result[matchNumber].ZawodyData,
                time: result[matchNumber].ZawodyGodzina,
                location: matchDataJson[0][0].Hala_miasto
            }
            i++

        }
    }

    resultObject[j] = {
        month: currentMonth,
        matches: matchesThisMonth
    }



    console.log('future matches loaded')
    return resultObject

}

module.exports = fetchFutureMatchesData