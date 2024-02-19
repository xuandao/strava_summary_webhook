import type { NextApiRequest, NextApiResponse } from 'next'
import { triggerDataSyncAction } from "@/lib/github";
import {requestArgsLog } from "@/lib/utils";
/**
 * github action trigger
 * @param req 
 * @param res 
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
  ) {
  requestArgsLog(req);

  // 触发 github 数据同步任务
  const ret = await triggerDataSyncAction();

  // 设置状态码为 200 OK，并发送 JSON 响应
  return res.status(200).json({
    code: 200,
    message: JSON.stringify(ret)
  })
}