import axios from 'axios'
import emoji from 'node-emoji'
import chalk from 'chalk'

const filterGameDayMatchups = (gamesArr) => {
  return gamesArr.map((game) => {
    const away = game.teams.away
    const home = game.teams.home
    return {
      away: {
        id: away.team.id,
        name: away.team.name,
      },
      home: {
        id: home.team.id,
        name: home.team.name,
      },
    }
  })
}

const getWeeklySchedule = async () => {
  const monthsStr = process.argv[2].split('=')[1].split(',')
  const datesStr = process.argv[3].split('=')[1].split(',')
  const dates = datesStr.map((day) => Number(day))
  const months = monthsStr.map((month) => Number(month))
  const games = []
  for (const day of dates) {
    if (day <= dates[6]) {
      const getSchedule = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/schedule?date=2023-${months[0]}-${day}`
      )
      const schedule = getSchedule.data
      const gameDayMatchups = filterGameDayMatchups(schedule.dates[0].games)

      games.push({
        date: schedule.dates[0].date,
        totalGames: schedule.totalGames,
        games: gameDayMatchups,
      })
    } else {
      const getSchedule = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/schedule?date=2023-${months[1]}-${day}`
      )
      const schedule = getSchedule.data
      const gameDayMatchups = filterGameDayMatchups(schedule.dates[0].games)

      games.push({
        date: schedule.dates[0].date,
        totalGames: schedule.totalGames,
        games: gameDayMatchups,
      })
    }
  }
  return games
}

const compile = async () => {
  const weeklySchedule = await getWeeklySchedule()
  console.log(weeklySchedule)
}

compile()
