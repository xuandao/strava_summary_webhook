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
  const query = req.query;
  // @ts-ignore
  const callback_url:string = query.callback_url;

  if(!callback_url){
    return res.status(500).json({code: 500, message: 'callback_url 不存在'})
  }

  const ret = await createSubscription(callback_url);

  return res.status(200).json({
    code: 200,
    message: JSON.stringify(ret)
  })
}