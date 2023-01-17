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
  const leftWing = rosterPositionFilter(rosters, 'L')
  const leftWingStats = await getSkaterStats(leftWing)
  const leftWingAverages = compilePlayerStats(leftWingStats)
  const t1 = tierOne(leftWingAverages, sort, 15)
  const t2 = tierTwo(leftWingAverages, sort, 12, 15)
  // const t3 = tierThree(leftWingAverages, sort, 7, 10)
  console.log(t1)
  console.log(t2)
}

compile()
