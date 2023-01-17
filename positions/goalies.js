import {
  getSchedule,
  getRosters,
  rosterPositionFilter,
  getGoalieStats,
  compilePlayerStats,
  tierOne,
  tierTwo,
  tierThree,
  sort,
} from '../functions/index.js'

const teamIds = []
const rosters = []

const compile = async () => {
  await getSchedule(teamIds)
  await getRosters(rosters, teamIds)
  const goalies = rosterPositionFilter(rosters, 'G')
  const goalieStats = await getGoalieStats(goalies)
  const goalieAverages = compilePlayerStats(goalieStats)
  const t1 = tierOne(goalieAverages, sort, 20)
  const t2 = tierTwo(goalieAverages, sort, 15, 20)
  const t3 = tierThree(goalieAverages, sort, 10, 15)
  console.log(t1)
  console.log(t2)
  console.log(t3)
}

compile()
