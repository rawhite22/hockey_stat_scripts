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
  // c
  const centers = rosterPositionFilter(rosters, 'C')
  const centerStats = await getSkaterStats(centers)
  const centerAverages = compilePlayerStats(centerStats)
  const t1 = tierOne(centerAverages, sort, 15)
  const t2 = tierTwo(centerAverages, sort, 12, 15)
  // const t3 = tierThree(centerAverages, sort, 7, 10)
  console.log(t1)
  console.log(t2)
}

compile()
