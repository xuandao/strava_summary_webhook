import { Octokit } from "@octokit/core";
import {GIT_OWNER, GIT_REPO, GIT_ACTION_TYPE, GIT_PRIVATE_ACCESS_TOKEN} from "@/lib/const";
const octokit = new Octokit({
    auth: GIT_PRIVATE_ACCESS_TOKEN
})

/**
 * trigger github actions
 * @returns 
 */
export async function triggerDataSyncAction() {
    try{
        await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
            owner: GIT_OWNER,
            repo: GIT_REPO,
            event_type: GIT_ACTION_TYPE,
            client_payload: {
                unit: false,
                integration: true
            },
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        console.log(`triggerDataSyncAction(): SUCCESS`)
    }catch(e){
        // @ts-ignore
        console.error(`triggerDataSyncAction(): ${e.message}`)
    }
}