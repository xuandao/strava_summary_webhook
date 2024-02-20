import type { NextApiRequest, NextApiResponse } from 'next'
import { IStravaWebbhookContent, IAPIResponseData} from "@/lib/interfaces";
import {getActivityById, getLoggedInAthleteActivities, generateActivitiesSummary, updateActivityDescription} from "@/lib/strava";
import {requestArgsLog, getCurrentTimestampMillis} from "@/lib/utils";

/**
 * strava webhook
 * @param req 
 * @param res 
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse 
  ) {
  requestArgsLog(req);

  if(req.method === 'GET'){
    // 绑定webhook 验证
    if(req.query['hub.challenge']){
      return res.status(200).json({
        "hub.challenge": req.query["hub.challenge"]
      })
    }

    // 手动更新 Description
    if(req.query['object_id']){
      // @ts-ignore
      const id = req.query['object_id']*1;
      await updateDescription(id)
      return res.status(200).json({
        code: 200,
        message: 'success.',
        ts: getCurrentTimestampMillis()
      })
    }
  }

  // 无数据
  if(req.method === 'POST' && !req.body){
    console.log('req.body is null')
    return res.status(500).json({
      code: 500,
      ts: getCurrentTimestampMillis(),
      success: false
    })
  }

  // 处理 webhook
  const hookContent:IStravaWebbhookContent = req.body;

  // 仅在创建活动时进行处理
  if(hookContent.object_type === 'activity' && hookContent.aspect_type ==='create' ){
    await updateDescription(hookContent.object_id)
  }

  return res.status(200).json({
    code: 200,
    message: 'success.',
    ts: getCurrentTimestampMillis()
  })
}

/**
 * 更新 object_id 的相关描述
 * @param object_id 
 */
async function updateDescription(object_id:number) {
  const [currentActivity, allActivitiesList] = await Promise.all([
    getActivityById(object_id), 
    getLoggedInAthleteActivities('Run', 28)]);
  console.log(`getActivityById(${object_id}): ${JSON.stringify(currentActivity)}`);
  console.log(`getLoggedInAthleteActivities(): ${JSON.stringify(allActivitiesList)}`);

  // 仅活动为 Run 时才做处理
  if(currentActivity.type === 'Run'){
    const description = generateActivitiesSummary(currentActivity, allActivitiesList)
    updateActivityDescription(object_id, description);
    console.log(`updateActivityDescription: ${description}`);
  }
}