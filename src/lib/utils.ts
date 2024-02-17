import type { NextApiRequest } from 'next'

export function getCurrentTimestampMillis(): number {
    return Date.now();
}

export function safeJSON(str:string){
    try{
        JSON.parse(str)
    } catch(e) {
        // ingore
    }
}

export function requestArgsLog(req: NextApiRequest){
    let args;
    switch(req.method){
        case 'GET':
            args = req.query;
            break;
        case 'POST':
            args = req.body;
            break;
    }

    console.log(`requestArguments: ${JSON.stringify(args)}`);
}