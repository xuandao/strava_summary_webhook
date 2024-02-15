import { Strava, DetailedActivity, SummaryActivity } from "strava";
import {STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN, TYPE_ALL, TYPE_INDOOR, TYPE_OUTDOOR} from "@/lib/const";
import { getCurrentTimestampMillis } from "@/lib/utils";

const STRAVA_CLIENT = new Strava({
  client_id: STRAVA_CLIENT_ID,
  client_secret: STRAVA_CLIENT_SECRET,
  refresh_token: STRAVA_REFRESH_TOKEN
});

/**
 * 获取单个活动信息
 * @param id 
 * @returns 
 */
export async function getActivityById(id:number): Promise<DetailedActivity> {
  return await STRAVA_CLIENT.activities.getActivityById({id})
}

/**
 * 获取时间范围的所有活动列表
 * @param type 
 * @param days 
 * @returns 
 */
export async function getLoggedInAthleteActivities(type: string, days: number): Promise<SummaryActivity[]>{
  // 4 weeks, 28 days
  const DATE_GAP = 1000 * 60 * 60 * 24 * days;
  const after = (getCurrentTimestampMillis() - DATE_GAP) / 1000;

  const ret:SummaryActivity[] = await STRAVA_CLIENT.activities.getLoggedInAthleteActivities({
      after,
      per_page: 50
  });

  // 过滤所需类型
  return ret.filter(item => item.type === type)
}

/**
 * 更新活动的 description
 * @param id 
 * @param description 
 * @returns 
 */
export async function updateActivityDescription(id:number, description:string): Promise<void> {
    await STRAVA_CLIENT.activities.updateActivityById({
      id: id,
      description
    });
}

/**
 * 订阅 webhook
 * @param callback_url 
 */
export async function createSubscription(callback_url: string): Promise<any>{
  return await STRAVA_CLIENT.subscriptions.createSubscription({
    callback_url,
    verify_token: "STRAVA"
  })
}

/**
 * 更新活动 summary
 * @returns 
 */
export function generateActivitiesSummary(curActivity: DetailedActivity, allActivitiesList: SummaryActivity[]): string{
  const subType = curActivity.map.summary_polyline !== undefined ? TYPE_OUTDOOR : TYPE_INDOOR;

    // 当前类型的 Summary
    const subActivitesList = getSubtypeActivites(subType, allActivitiesList);
    const sameTypeSummary: string = rendersummaryResult(
      subType,
      curActivity,
      subActivitesList
    );

    // 所有类型活动的 Summary
    const allSummary: string = rendersummaryResult(
      TYPE_ALL,
      curActivity,
      allActivitiesList
    );

    const description = `${sameTypeSummary}\n\n${allSummary}`;

    return description;
}

/**
 * 获取子类型的活动列表
 * @param subType 
 */
function getSubtypeActivites(subType:string, allActivitiesList: SummaryActivity[]): SummaryActivity[] {
  if(subType === TYPE_OUTDOOR){
    return allActivitiesList.filter(item => !!item.map.summary_polyline);
  }

  return allActivitiesList.filter(item => !item.map.summary_polyline);
}

/**
 * 渲染 Summary
 * @param type 
 * @param curActivity 
 * @param allActivitiesList 
 * @returns 
 */
function rendersummaryResult(curType: string, curActivity: DetailedActivity, allActivitiesList: SummaryActivity[]) {
  const DATA_LEN = allActivitiesList.length;

  //总里程
  const TOTAL_DISTANCE = allActivitiesList.reduce(
    (curValue, item) => curValue + item.distance,
    0
  );
  //总运动时间
  const TOTAL_MTime = allActivitiesList.reduce(
    (curValue, item) => curValue + item.moving_time,
    0
  );
  //里程
  const AVG_DISTANCE =
  allActivitiesList.reduce((curValue, item) => curValue + item.distance, 0) /
    DATA_LEN;
  // 心率
  const AVG_HR =
  allActivitiesList.reduce(
      (curValue, item) => curValue + item.average_heartrate,
      0
    ) / DATA_LEN;
  // 步频
  const AVG_CADENCE =
  allActivitiesList.reduce((curValue, item) => curValue + item.average_cadence, 0) /
    DATA_LEN;
  // 运动时间
  const AVG_MTime =
  allActivitiesList.reduce((curValue, item) => curValue + item.moving_time, 0) /
    DATA_LEN;
  //负荷
  const AVG_SCORE =
  allActivitiesList.reduce((curValue, item) => curValue + item.suffer_score, 0) /
    DATA_LEN;

  const EMOJI_UNDONE = "❌";
  const EMOJI_DONE = "✅";
  const EMOJI_UP = "";
  const EMOJI_DOWN = "⤵️";

  return `
${curType} SUMMARY${curType === TYPE_ALL ? "(All Runs & IndoorRuns)" : ""}:
    Completed: ${DATA_LEN} runs
    Total Distance:: ${(TOTAL_DISTANCE / 1000).toFixed(2)}km (Avg.: ${(
    AVG_DISTANCE / 1000
  ).toFixed(2)}km ${
    curActivity.distance > AVG_DISTANCE ? EMOJI_DONE : EMOJI_UNDONE
  })
    Total Moving Time: ${(TOTAL_MTime / 60).toFixed(2)}Mins (Avg.: ${(
    AVG_MTime / 60
  ).toFixed(2)} Mins) ${
    curActivity.moving_time > AVG_MTime ? EMOJI_DONE : EMOJI_UNDONE
  }

    AVG HR: ${AVG_HR.toFixed(0)}BPM ${
    curActivity.average_heartrate > AVG_HR ? EMOJI_UP : EMOJI_DOWN
  } 
    AVG Cadence: ${(AVG_CADENCE * 2).toFixed(0)}/Mins ${
    curActivity.average_cadence > AVG_CADENCE ? EMOJI_UP : EMOJI_DOWN
  } 
    AVG Effect Score: ${AVG_SCORE.toFixed(0)} ${
    curActivity.suffer_score > AVG_SCORE ? EMOJI_UP : EMOJI_DOWN
  } 
    `;
}