import type { NextApiRequest, NextApiResponse } from 'next'
import { createSubscription } from "@/lib/strava";
import {VERCEL_HOST} from "@/lib/const";
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

  const callback_url = `https://${VERCEL_HOST}/api/webhook/getNewStravaActivity`;
  const ret = await createSubscription(callback_url);

  return res.status(200).json({
    code: 200,
    message: JSON.stringify(ret)
  })
}