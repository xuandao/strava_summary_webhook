import {IStravaWebbhookContent} from "@/resources/strava/interface/webhook";
import { triggerDataSyncAction } from "@/lib/github";
import {getActivityById, getLoggedInAthleteActivities, updateActivitiesSummary} from "@/lib/strava";
/**
 * strava webhook
 * @param req 
 * @param res 
 */
export default async function handler(req:Request, res: Response) {
      // 获取当前活动的数据
      const hookContent:IStravaWebbhookContent = JSON.parse(req.body.toString());
      const {object_id} = hookContent

      // 仅在创建活动时进行处理
      if(hookContent.object_type === 'activity' && hookContent.aspect_type ==='create' ){
        const currentActivity=  await getActivityById(object_id);
        const allActivitiesList = await getLoggedInAthleteActivities(currentActivity.type, 28);

        await updateActivitiesSummary(currentActivity, allActivitiesList)

        // 触发 github 数据同步任务
        await triggerDataSyncAction();
      }

      // 设置状态码为 200 OK，并发送 JSON 响应
      res.status(200).json({
        success: true
      });
}