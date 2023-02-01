import { google } from 'googleapis'
import fs from 'fs'

main()

/**
 * Экспортирует данные из таблицы о квартплате в json-файл
 */
async function main() {
  const spreadsheetId = '1_fWWzKMZ1594R9Q_glPMMrgE0Z9srcvtBVy711-q-Mk'

  const auth = new google.auth.GoogleAuth({
    keyFile: './credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly'
  })

  const client = await auth.getClient()

  const sheets = google.sheets({ version: 'v4', auth: client }).spreadsheets

  const rowsResponse = await sheets.values.get({
    auth,
    spreadsheetId,
    range: 'Main'
  })

  const exportData = {
    currentFlatId: 1,
    currentYear: 2022,
    flats: [
      { id: 1, address: 'Levina 231', number: '121' },
      { id: 2, address: 'Ludviga 34', number: '45' }
    ],
    calculations: []
  }
  let currentYear

  rowsResponse.data.values.forEach((row, index) => {
    // Skip heading row
    if (index == 0) {
      return
    }

    let i = 0
    const year = +row[i++]
    currentYear = year || currentYear

    const calc = {
      flatId: 1,
      year: currentYear,
      month: getMonthIndex(row[i++]),
      hcs: {
        electricityVolume: +row[i++],
        electricityVolumeMonthly: +row[i++],
        cost: toFloat(row[i++])
      },
      water: {
        coldVolume: +row[i++],
        coldVolumeMonthly: +row[i++],
        hotVolume: +row[i++],
        hotVolumeMonthly: +row[i++],
        cost: toFloat(row[i++]),
      },
      heating: {
        volume: toFloat(row[i++]),
        convertedVolume: toFloat(row[i++]),
        convertedVolumeMonthly: toFloat(row[i++]),
        cost: toFloat(row[i++]),
      }
    }

    const garbageCost = toFloat(row[i++])
    if (garbageCost) {
      calc.garbage = {
        cost: garbageCost
      }
    }

    calc.overhaul = {
      cost: toFloat(row[i++]) || 0
    }

    exportData.calculations.push(calc)
  })

  // Saving to json file
  fs.writeFileSync('exported.json', JSON.stringify(exportData, null, 2))
  console.log('Done.')
}

function toFloat(value) {
  if (value === '') {
    return null
  }

  return +value.replace(',', '.')
}

function getMonthIndex(month) {
  const months = {
    'Январь': 1,
    'Февраль': 2,
    'Март': 3,
    'Апрель': 4,
    'Май': 5,
    'Июнь': 6,
    'Июль': 7,
    'Август': 8,
    'Сентябрь': 9,
    'Октябрь': 10,
    'Ноябрь': 11,
    'Декабрь': 12,
  }

  return months[month]
}

