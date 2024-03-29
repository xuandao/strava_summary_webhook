export interface IStravaWebbhookContent{
    object_type: 'activity' |  'athlete';
    object_id: number;
    aspect_type: "create" | "update" | "delete";
    owner_id: number;
    subscription_id: number;
    event_time: number;
}

export type IAPIResponseData = {
    code: number,
    message: string
  }