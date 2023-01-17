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
  // get command line arguments
  const monthsStr = process.argv[2].split('=')[1].split(',')
  const datesStr = process.argv[3].split('=')[1].split(',')
  const dates = datesStr.map((day) => Number(day))
  const months = monthsStr.map((month) => Number(month))
  // initialize games array
  const games = []
  // loop through dates and get schedule for each day
  for (const day of dates) {
    // check date to ensure correct month is used
    if (day <= dates[6]) {
      const getSchedule = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/schedule?date=2023-${months[1]}-${day}`
      )
      const schedule = getSchedule.data
      if (schedule.dates.length === 0) {
      } else {
        const gameDayMatchups = filterGameDayMatchups(schedule.dates[0].games)
        games.push({
          date: schedule.dates[0].date,
          totalGames: schedule.totalGames,
          games: gameDayMatchups,
        })
      }
    } else {
      const getSchedule = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/schedule?date=2023-${months[0]}-${day}`
      )
      const schedule = getSchedule.data
      if (schedule.dates.length === 0) {
      } else {
        const gameDayMatchups = filterGameDayMatchups(schedule.dates[0].games)
        games.push({
          date: schedule.dates[0].date,
          totalGames: schedule.totalGames,
          games: gameDayMatchups,
        })
      }
    }
  }
  // return array of games fot the week
  return games
}

const getNumberOfGames = (weeklySchedule) => {
  const teamsIdArr = []
  weeklySchedule.forEach((day) => {
    day.games.forEach((game) => {
      teamsIdArr.push(game.away.id)
      teamsIdArr.push(game.home.id)
    })
  })
  const counts = {}
  teamsIdArr.forEach((x) => {
    counts[x] = (counts[x] || 0) + 1
  })
  return counts
}

const teamInfo2 = async (numOfGamesObj) => {
  const statsArr = []
  const teamValues = Object.entries(numOfGamesObj)
  for (const arr of teamValues) {
    const teamStats = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/teams/${arr[0]}?expand=team.stats`
    )
    statsArr.push({
      id: teamStats.data.teams[0].id,
      team: teamStats.data.teams[0].name,
      games: arr[1],
      evg: teamStats.data.teams[0].teamStats[0].splits[0].stat.evGGARatio,
      evgNote: 'The higher the number the better the team at 5v5.',
      shotDifferential: Number(
        (
          teamStats.data.teams[0].teamStats[0].splits[0].stat.shotsPerGame -
          teamStats.data.teams[0].teamStats[0].splits[0].stat.shotsAllowed
        ).toFixed(2)
      ),
    })
  }

  return statsArr
}

const weekDayMatchup = (day, teamInfo) => {
  const dailyMatchup = []
  day.forEach((game) => {
    const away = teamInfo.filter((team) => team.id === game.away.id)
    const home = teamInfo.filter((team) => team.id === game.home.id)
    dailyMatchup.push({ roadTeam: away[0], homeTeam: home[0] })
  })
  const compileDailyMatchups = () => {
    dailyMatchup.map((game) => {
      if (game.roadTeam.evg > game.homeTeam.evg) {
        console.log('road adv')
      }
      if (game.roadTeam.evg < game.homeTeam.evg) {
        console.log('home adv')
      }
    })
  }
  compileDailyMatchups()
}

const compareMatchUps = (teamInformation, weeklySchedule) => {
  const matchups = weeklySchedule.map((day) => day.games)
  const monday = weekDayMatchup(matchups[0], teamInformation)
}

const compile = async () => {
  const weeklySchedule = await getWeeklySchedule()
  const numOfGamesObj = getNumberOfGames(weeklySchedule)
  const teamInformation = await teamInfo2(numOfGamesObj)
  teamInformation.forEach((team) => {
    console.table(team)
  })
}

compile()
