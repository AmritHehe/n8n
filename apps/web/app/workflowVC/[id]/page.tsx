
import WorkflowClient from "./workflowClient";


export default async function WorkflowVC({params} : {params : Promise<{id : string}>}) {
  const {id} = await params
  const hehe = Number(id);
  return <WorkflowClient workflowId = {hehe}/>

}
//todo - add agent node , add desc , add credential page , add workflow page

