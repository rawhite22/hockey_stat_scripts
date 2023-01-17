import axios from 'axios'
import emoji from 'node-emoji'

const getSchedule = async (teamIds) => {
  const todaysGames = await axios.get(
    'https://statsapi.web.nhl.com/api/v1/schedule'
  )

  const scheduledTeams = todaysGames.data.dates[0].games.map(
    (game) => game.teams
  )
  const teams = scheduledTeams.map((matchup) => {
    return { home: matchup.away.team.id, away: matchup.home.team.id }
  })
  const values = teams.forEach((o) => {
    teamIds.push(o.home)
    teamIds.push(o.away)
  })

  return values
}

const getRosters = async (rosters, teamIds) => {
  for (const id of teamIds) {
    const roster = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/teams/${id}/roster`
    )
    rosters.push(roster.data.roster)
  }
}

const rosterPositionFilter = (arr, position) => {
  const pos = arr.map((roster) => {
    const filteredPos = roster.filter((ros) => ros.position.code === position)
    const ids = filteredPos.map((roster) => {
      return { id: roster.person.id, name: roster.person.fullName }
    })
    return ids
  })

  return pos
}

const getSkaterStats = async (arr) => {
  const calcScore = (g, a, sht, blk, shp) => {
    const goals = g * 8.5
    const assists = a * 5
    const shots = sht * 1.5
    const blocks = blk * 1.3
    const shortHandedPoints = shp * 2
    const score = goals + assists + shots + blocks + shortHandedPoints
    return Number(score.toFixed(2))
  }
  const playerStats = []
  for (const teamPosition of arr) {
    for (const player of teamPosition) {
      const plStats = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/people/${player.id}/stats?stats=gameLog&season=20222023`
      )
      const lastThree = plStats.data.stats[0].splits.splice(0, 3)
      const l3stat = lastThree.map((game) => {
        const { goals, assists, blocked, shots, shortHandedPoints } = game.stat
        return {
          name: player.name,
          fantasyPoints: calcScore(
            goals,
            assists,
            shots,
            blocked,
            shortHandedPoints
          ),
        }
      })

      playerStats.push(l3stat)
    }
  }
  const psf = playerStats.filter((e) => e.length > 2)
  return psf
}

const compilePlayerStats = (positionArr) => {
  const playerLastThreeAverage = positionArr.map((game, index) => {
    const getScores = game.map((g) => g.fantasyPoints)
    const addScores = getScores.reduce((prev, curr) => prev + curr, 0)
    const average = Number((addScores / 3).toFixed(2))
    return { name: positionArr[index][0].name, average }
  })
  return playerLastThreeAverage
}

const sort = (arr) => {
  return arr.sort((a, b) => b.average - a.average)
}

const tierOne = (averages, sort, min) => {
  const elite = averages.filter((player) => player.average > min)
  const eliteNewObj = elite.map((player) => ({
    ...player,
    status: emoji.get('first_place_medal'),
  }))
  return sort(eliteNewObj)
}
const tierTwo = (averages, sort, min, max) => {
  const midPack = averages.filter(
    (player) => player.average > min && player.average < max
  )
  const midPackObj = midPack.map((player) => ({
    ...player,
    status: emoji.get('second_place_medal'),
  }))
  return sort(midPackObj)
}
const tierThree = (averages, sort, min, max) => {
  const higherRisk = averages.filter(
    (player) => player.average > min && player.average < max
  )
  const higherRiskObj = higherRisk.map((player) => ({
    ...player,
    status: emoji.get('third_place_medal'),
  }))
  return sort(higherRiskObj)
}

const getGoalieStats = async (arr) => {
  const calcScore = (sv, ga, isWin, shutout) => {
    const save = sv * 0.7
    const sho = shutout * 4
    const win = isWin === 'W' ? 6 : 0
    const goalsAgainst = ga * -1.3
    const score = save + sho + win + goalsAgainst
    return Number(score.toFixed(2))
  }
  const goalieStats = []
  for (const teamPosition of arr) {
    for (const player of teamPosition) {
      const plStats = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/people/${player.id}/stats?stats=gameLog&season=20222023`
      )
      const lastThree = plStats.data.stats[0].splits.splice(0, 3)
      const l3stat = lastThree.map((game) => {
        const { saves, goalsAgainst, descision, shutouts } = game.stat
        return {
          name: player.name,
          fantasyPoints: calcScore(saves, goalsAgainst, descision, shutouts),
        }
      })

      goalieStats.push(l3stat)
    }
  }
  const psf = goalieStats.filter((e) => e.length > 2)
  return psf
}

export {
  getSchedule,
  getRosters,
  rosterPositionFilter,
  getSkaterStats,
  compilePlayerStats,
  tierOne,
  tierTwo,
  tierThree,
  getGoalieStats,
  sort,
}
