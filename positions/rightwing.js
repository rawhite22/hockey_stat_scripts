import {
  getSchedule,
  getRosters,
  rosterPositionFilter,
  getSkaterStats,
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
  const rightWing = rosterPositionFilter(rosters, 'R')
  const rightWingStats = await getSkaterStats(rightWing)
  const rightWingAverages = compilePlayerStats(rightWingStats)
  const t1 = tierOne(rightWingAverages, sort, 15)
  const t2 = tierTwo(rightWingAverages, sort, 12, 15)
  // const t3 = tierThree(rightWingAverages, sort, 7, 10)
  console.log(t1)
  console.log(t2)
}

compile()
