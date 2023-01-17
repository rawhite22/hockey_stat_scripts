import axios from 'axios'
import emoji from 'node-emoji'
import chalk from 'chalk'

const getTeamStats = async (id) => {
  const teamStats = await axios.get(
    `https://statsapi.web.nhl.com/api/v1/teams/${id}?expand=team.stats`
  )
  const { evGGARatio, shotsAllowed, shotsPerGame, savePctg } =
    teamStats.data.teams[0].teamStats[0].splits[0].stat
  const { id: teamId, name } =
    teamStats.data.teams[0].teamStats[0].splits[0].team

  return { name, teamId, evGGARatio, shotsAllowed, shotsPerGame, savePctg }
}

const getSchedule = async (arr) => {
  const getScheduledGames = await axios.get(
    'https://statsapi.web.nhl.com/api/v1/schedule'
  )
  const scheduledGames = getScheduledGames.data.dates[0].games
  for (const matchup of scheduledGames) {
    const homeTeam = await getTeamStats(matchup.teams.home.team.id)
    const roadTeam = await getTeamStats(matchup.teams.away.team.id)
    arr.push({ homeTeam, roadTeam })
  }
}

const matchupRating = (egrH, egrV) => {
  if (egrH > egrV) {
    const rating = Number((egrH - egrV).toFixed(2))
    if (rating >= 0.8) {
      return [
        emoji.get('fire'),
        emoji.get('fire'),
        emoji.get('fire'),
        emoji.get('fire'),
        emoji.get('fire'),
      ]
    }
    if (rating >= 0.6 && rating < 0.8) {
      return [
        emoji.get('fire'),
        emoji.get('fire'),
        emoji.get('fire'),
        emoji.get('fire'),
      ]
    }
    if (rating >= 0.4 && rating < 0.6) {
      return [emoji.get('fire'), emoji.get('fire'), emoji.get('fire')]
    }
    if (rating >= 0.2 && rating < 0.4) {
      return [emoji.get('fire'), emoji.get('fire')]
    }
    if (rating > 0.0 && rating < 0.2) {
      return [emoji.get('snowflake')]
    }
  }
  if (egrH < egrV) {
    const rating = Number((egrV - egrH).toFixed(2))
    if (rating >= 0.8) {
      return [
        emoji.get('fire'),
        emoji.get('fire'),
        emoji.get('fire'),
        emoji.get('fire'),
        emoji.get('fire'),
      ]
    }
    if (rating >= 0.6 && rating < 0.8) {
      return [
        emoji.get('fire'),
        emoji.get('fire'),
        emoji.get('fire'),
        emoji.get('fire'),
      ]
    }
    if (rating >= 0.4 && rating < 0.6) {
      return [emoji.get('fire'), emoji.get('fire'), emoji.get('fire')]
    }
    if (rating >= 0.2 && rating < 0.4) {
      return [emoji.get('fire'), emoji.get('fire')]
    }
    if (rating > 0.0 && rating < 0.2) {
      return [emoji.get('snowflake')]
    }
  }
  if (egrH === egrV) {
    return 'Pick Em'
  }
}

const compareMatchUp = (matchupsArr) => {
  matchupsArr.forEach((matchup) => {
    const {
      name: nameH,
      evGGARatio: egrH,
      shotsAllowed: shotsAllowedH,
    } = matchup.homeTeam
    const {
      name: nameV,
      evGGARatio: egrV,
      shotsAllowed: shotsAllowedV,
    } = matchup.roadTeam
    if (egrH > egrV) {
      const matchupObj = {
        matchup: `${nameH} over ${nameV}`,
        rating: matchupRating(egrH, egrV),
        dailyFantasy: `Draft players from the ${nameH}`,
      }
      console.table(matchupObj)
    }
    if (egrH < egrV) {
      const matchupObj = {
        matchup: `${nameV} over ${nameH}`,
        rating: matchupRating(egrH, egrV),
        dailyFantasy: `Draft players from the ${nameV}`,
      }
      console.table(matchupObj)
    }
    if (egrH === egrV) {
      console.log('toss up')
    }
  })
}

const matchupStats = []

const compile = async () => {
  await getSchedule(matchupStats)
  compareMatchUp(matchupStats)
}

compile()
