const httpMocks = require('node-mocks-http');
import  handler  from "@/pages/api/webhook/getNewStravaActivity"

describe('/api/webhook/getNewStravaActivity', () => {
    it('normal hander', async ()=> {
        const request = httpMocks.createRequest({
            method: 'POST',
            body: {
                object_type: "activity",
                object_id: "",
                aspect_type: "create",
                owner_id: 111,
                subscription_id: 111,
                event_time: 1222
            }
          });

        //   console.log(1111, request.json())
        // const ret = await handler(req, res);
        // console.log(2222, ret);

    })
})