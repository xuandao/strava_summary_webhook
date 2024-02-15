import type { NextApiRequest, NextApiResponse } from 'next'
import { IStravaWebbhookContent, IAPIResponseData} from "@/lib/interfaces";
import { triggerDataSyncAction } from "@/lib/github";
import {getActivityById, getLoggedInAthleteActivities, generateActivitiesSummary, updateActivityDescription} from "@/lib/strava";
/**
 * strava webhook
 * @param req 
 * @param res 
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse 
  ) {
  // 绑定webhook 验证
  if(req.method === 'GET' && req.query['hub.challenge']){
    return res.status(200).json({
      "hub.challenge": req.query["hub.challenge"]
    })
  }

  // 无数据
  if(req.method === 'POST' && !req.body){
    return res.status(500).json({
      code: 500,
      success: false
    })
  }

  // 处理 webhook
  const hookContent:IStravaWebbhookContent = req.body;
  // 获取当前活动的数据
  const {object_id} = hookContent

  // 仅在创建活动时进行处理
  if(hookContent.object_type === 'activity' && hookContent.aspect_type ==='create' ){
    const [currentActivity, allActivitiesList] = await Promise.all([
      getActivityById(object_id), 
      getLoggedInAthleteActivities('Run', 28)]);

    // 仅活动为 Run 时才做处理
    if(currentActivity.type === 'Run'){
      const description = generateActivitiesSummary(currentActivity, allActivitiesList)
      updateActivityDescription(object_id, description);

      // 触发 github 数据同步任务
      triggerDataSyncAction();
    }
  }

  return res.status(200).json({
    code: 200,
    message: 'success.'
  })
}