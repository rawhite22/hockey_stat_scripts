# hockey Stats

### how to set up

1. clone repo into a folder
2. open folder in vscode or open a terminal inside root directory of the files
3. npm install to install required packages ( if you do not have npm installed [Node & Npm Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

### how to use

1. open a terminal in the root directory
2. npm run script name

### scripts

#### daily stats

'center' - gets daily information for all centers playing that day

'leftwing' - gets daily information for all leftwings playing that day

'rightwing' - gets daily information for all rightwings playing that day

'defenseman' - gets daily information for all defensemans playing that day

'goalies' - gets daily information for all goaliess playing that day

![alt text](/imgs/center_example.png)

#### Team Stats

'matchups' - returns matchup ratings for the current days games

'weeklyReport months=1,2 dates=29,30,31,1,2,3,4' - returns information about each teams schedule based of the dates and months

![alt text](/imgs/weekly_report_one_month.png)

if days fall between months

![alt text](/imgs/weekly_report_multiple_months.png)
