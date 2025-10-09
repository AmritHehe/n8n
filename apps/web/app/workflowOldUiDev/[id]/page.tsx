
import MainWorkFlow from "./mainWorkflow";



export default async function Wrokflow({params} : {params : Promise<{id : string}>}) {
  const {id} = await params
  const workflowId = Number(id);
  return <MainWorkFlow id = {workflowId}/>

}
//todo - add agent node , add desc , add credential page , add workflow page

