import type { NextApiRequest, NextApiResponse } from 'next'
import { createSubscription } from "@/lib/strava";
/**
 * github action trigger
 * @param req 
 * @param res 
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
  ) {
  const body = req.body;
  if(req.method !== 'POST' || body=== null || !body.callback_url){
    res.status(500).json({code: 500, message: '请求参数异常'})
  }

  // 触发 github 数据同步任务
  const ret = await createSubscription(body.callback_url);

  // 设置状态码为 200 OK，并发送 JSON 响应
  return res.status(200).json({
    code: 200,
    message: JSON.stringify(ret)
  })
}