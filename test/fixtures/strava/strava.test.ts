import * as STRAVA from "@/lib/strava";
const detailedActivity = require("./detailedActivity.json")
const summaryActivity = require("./summaryActivity.json")

describe('lib/strava function', () => {
    it('getActivityById', async ()=>{
        // @ts-ignore
        jest.spyOn(STRAVA, 'getActivityById').mockResolvedValue(detailedActivity);
        jest.spyOn(STRAVA, 'getLoggedInAthleteActivities').mockResolvedValue(summaryActivity);

        const curActivity = await STRAVA.getActivityById(10548224944);
        const ActivitiesList = await STRAVA.getLoggedInAthleteActivities('Run', 28);
        const description = STRAVA.generateActivitiesSummary(curActivity, ActivitiesList);

        expect(description).toMatchSnapshot();
    })
});