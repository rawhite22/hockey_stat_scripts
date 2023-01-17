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
  const defenseman = rosterPositionFilter(rosters, 'D')
  const defensemanStats = await getSkaterStats(defenseman)
  const defensemanAverages = compilePlayerStats(defensemanStats)
  const t1 = tierOne(defensemanAverages, sort, 15)
  const t2 = tierTwo(defensemanAverages, sort, 12, 15)
  // const t3 = tierThree(defensemanAverages, sort, 7, 10)
  console.log(t1)
  console.log(t2)
}

compile()
