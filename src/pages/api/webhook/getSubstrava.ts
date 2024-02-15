import type { NextApiRequest, NextApiResponse } from 'next'
import { getSubscription } from "@/lib/strava";
/**
 * github action trigger
 * @param req 
 * @param res 
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
  ) {
  const ret = await getSubscription();

  return res.status(200).json({
    code: 200,
    message: JSON.stringify(ret)
  })
}