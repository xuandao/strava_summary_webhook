import type { NextApiRequest, NextApiResponse } from 'next'
import { delSubscription, getSubscription } from "@/lib/strava";
import {requestArgsLog} from "@/lib/utils";
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

  // @ts-ignore
  let id:number = req.query.id;
  if(!id){
    const subStatus = await getSubscription();
    id = subStatus.id;
  }
  const ret = await delSubscription(id);

  return res.status(200).json({
    code: ret.code,
    message: JSON.stringify(ret)
  })
}