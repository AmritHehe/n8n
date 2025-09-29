"use client"
import { useCallback, useState, useEffect, useId } from 'react';
import Link from 'next/link';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ConnectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
// import NodeConfigModal from './NodeConfigModal';

// Declare global window property
declare global {
  interface Window {
    handlePlusClick?: (nodeId: string) => void;
    handleNodeConfig?: (nodeId: string, nodeType: string) => void;
  }
}

import { TeligramNode } from "../../teligram";
import { Trigger } from "../../Trigger";
import { Gmail } from "../../Gmail";
import { Webhook } from "../../Webhook";
import axios from "axios";
import { AwaitGmail } from "../../AwaitGmail";
// Import custom nodes



const initialEdges: any = [];


const nodeTypes = { 
  telegram : TeligramNode ,
  trigger : Trigger , 
  gmail : Gmail , 
  webhook : Webhook , 
  awaitGmail : AwaitGmail,
  aiagent: AwaitGmail,
}

interface WorkflowClientProps {
  workflowId: number;
}

const inititalNodes  : any = [] 
export default function WorkflowClient ({ workflowId }: WorkflowClientProps) {

  const [nodes ,setNodes , onNodeChange] = useNodesState(inititalNodes)
  const [edges , setEdges , onEdgesChange] = useEdgesState(initialEdges)
  const [token , setToken ] = useState<string|null>(null)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [panelType, setPanelType] = useState<'trigger' | 'action'>('trigger');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingNodeId, setExecutingNodeId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);

  const [configModal, setConfigModal] = useState<{
    isOpen: boolean;
    nodeId: string | null;
    nodeType: string | null;
    nodeData: any;
  }>({
    isOpen: false,
    nodeId: null,
    nodeType: null,
    nodeData: null,
  });

  // Track changes for save warning
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [nodes, edges]);
 
  useEffect(()=> {
        fetchWorkflows()
        console.log("workflow id " + workflowId)
        const tokenn = localStorage.getItem("token")
        setToken(tokenn)
        console.log("token " + tokenn )
        let data 
        async function datacall(){ 
        data = await axios.get(`http://localhost:3002/workflow/${workflowId}` , { 
        
            headers : {  
            authorization  : tokenn
            }
        
        })
        
        console.log("got the data")
        // console.log("data" + JSON.stringify(data.data))
        //@ts-ignore
        const noodes = JSON.parse(data.data.nodes);
        //@ts-ignore
        const cooonecs = JSON.parse(data.data.Connections)   ;
        if(noodes.length > 0){ 
            setNodes(noodes) 
            setEdges(cooonecs)
        }

        }

        datacall()
        console.log("i am here")
        
        
        
  }, [])
  // Navigation with save warning
  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowSaveWarning(true);
    } else {
      window.location.href = path;
    }
  };

  const confirmNavigation = async () => {
    if (pendingNavigation) {
      await saveWorkflow();
      window.location.href = pendingNavigation;
    }
  };

  const cancelNavigation = () => {
    setShowSaveWarning(false);
    setPendingNavigation(null);
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Add first node (trigger)
  const addFirstNode = (name: string) => {
        if(name == 'webhook'){ 
            addWebhookNode(name , workflowId)
            setShowRightPanel(false);
        }
        else { 
          let size = (nodes.length + 1).toString()
          const newNode: Node = {
          id: size ,
          type : name,
          position: { x: 100, y: 100 },
          data: {  label : 'trigger', showPlusButton: true },
          };
          setNodes([newNode]);
          setShowRightPanel(false);
        }
    //@ts-ignore
        
    
  }
    // Fit view to show the new node at normal scale after a short delay

  // Add action node
  const addActionNode = (name:string) => {
    let size = (nodes.length + 1).toString()
    console.log("size" + size)
    const x = Math.floor(Math.random() * 500) + 100; // tweak range
    const y = Math.floor(Math.random() * 500) + 100;
    if(name == 'webhook' ||  name == 'awaitGmail'){ 
      console.log("sending workflowid from here " + workflowId)
        addWebhookNode(name , workflowId)
        setShowRightPanel(false);
        setSelectedNodeId(null);
    }
    else { 
      setNodes(nodes => [...nodes , { 
        id : size , 
        position : { x : x , y : y} , 
        data : { label : 'action', 
          message : "", 
        } , 
        type : name
      }])
      setShowRightPanel(false);
      setSelectedNodeId(null);
    } 

    
    // setSelectedNodeId(null);
  };

  // Show action panel when plus button clicked
  // const handlePlusClick = (nodeId: string) => {
  //   setSelectedNodeId(nodeId);
  //   setPanelType('action');
  //   setShowRightPanel(true);
  // };

  // Handle node configuration
  // const handleNodeConfig = (nodeId: string, nodeType: string) => {
  //   const node = nodes.find(n => n.id === nodeId);
  //   setConfigModal({
  //     isOpen: true,
  //     nodeId,
  //     nodeType,
  //     nodeData: node?.data || {},
  //   });
  // };

  // Save node configuration
  const saveNodeConfig = (data: any) => {
    if (!configModal.nodeId) return;
    
    setNodes(nds => 
      nds.map(node => 
        node.id === configModal.nodeId 
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
  };

  // Simulate workflow execution
  const simulateExecution = async () => {
    if (nodes.length === 0) return;
    
    setIsExecuting(true);
    
    // Execute nodes one by one with animation
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      //@ts-ignore
      setExecutingNodeId(node.id);
      
      // Update node to show executing state with slower, softer glow animation
      setNodes((nds) => 
        nds.map((n) =>
            //@ts-ignore 
          n.id === node.id 
            ? { ...n, data: { ...n.data, isExecuting: true } }
            : { ...n, data: { ...n.data, isExecuting: false } }
        )
      );
      
      // Wait for 1.2 seconds for smoother animation
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Clear executing state
    setNodes((nds) => 
      nds.map((n) => ({ ...n, data: { ...n.data, isExecuting: false } }))
    );
    setExecutingNodeId(null);
    setIsExecuting(false);
    setMessage('Workflow execution completed!');
    setTimeout(() => setMessage(null), 3000);
  };

  // Save workflow
  const saveWorkflow = async () => {
    setLoading(true);
    try {
        const res = await axios.put(`http://localhost:3002/workflow/${workflowId}` ,  { 
            data : { 
            nodes : JSON.stringify(nodes) , 
            connections : JSON.stringify(edges) ,  
            }
        } , 
        { 
            headers : {  
            authorization  : token
            }
        }
        )
        console.log("response " + res);
      
      setMessage('Workflow saved successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage('Failed to save workflow');
      console.error(error);
      setTimeout(() => setMessage(null), 3000);
    }
    setLoading(false);
  };
  function addWebhookNode(name : string , workflowId : number ){ 
    console.log(" hello from add webhook function")
    console.log(" workflow Id" + workflowId)
    let id = workflowId
    let size = (nodes.length + 1).toString()
    console.log("size" + size)
    
    setNodes(nodes => [...nodes , { 
      id : size , 
      position : { x : 200 , y : 200} , 
      data : { label : 'action', 
        message : "", 
        webhook : false , 
        isExecuting : false ,
        afterPlayNodes : null,
        workflowId : workflowId, 
      } , 
      type : name
    }])
  }
  async function executeWithLogs() {
    if (nodes.length === 0) {
      setMessage('Add nodes to execute workflow');
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    setMessage("Started workflow execution...\n"); // reset message

    try {
      // Open SSE connection to backend logs
      const eventSource = new EventSource(`http://localhost:3002/execute/logs/${workflowId}?token=${token}`);

      eventSource.onmessage = (event) => {
        // append each incoming log to message
        setMessage((prev) => prev + event.data + "\n");
        console.log("message aya message aya  " + event.data)

        if (event.data === "done") {
            console.log("Workflow finished!");
            setMessage((prev) => (prev ? prev + "\n" : "") + "Execution completed!");
            eventSource.close(); // close SSE connection
            setLoading(false);
          }

      };

      eventSource.onerror = (err) => {
        setMessage((prev) => prev + "Error streaming logs\n");
        console.error("SSE error:", err);
        eventSource.close();
        setLoading(false);
      };

      // Trigger backend execution separately (so logs start streaming)
      await axios.post(`http://localhost:3002/execute`, {
        nodes: JSON.stringify(nodes),
        connections: JSON.stringify(edges),
        id: workflowId,
      }, {
        headers: { authorization: token },
      });

    } catch (error) {
      setMessage((prev) => prev + "Execution failed\n");
      console.error(error);
      setLoading(false);
    }
}
  // Execute workflow
  const executeWorkflow = async () => {
    if (nodes.length === 0) {
      setMessage('Add nodes to execute workflow');
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const workflowData = {
        nodes: nodes,
        connections: edges,
      };

      // Simulate API call and then run demo execution
      const response = await axios.post(`http://localhost:3002/execute`, {
        nodes : JSON.stringify(nodes) , 
        connections : JSON.stringify(edges) ,
        id : workflowId
        } ,{ 
        headers : { 
            authorization : token
        }
        })
      console.log("response " + response)
      setTimeout(() => simulateExecution(), 500);
    } catch (error) {
      // If API fails, still run demo execution
      setTimeout(() => simulateExecution(), 500);
    }
    setLoading(false);
  };

  // Make functions available globally for nodes
  // useEffect(() => {
  //   window.handlePlusClick = handlePlusClick;
  //   window.handleNodeConfig = handleNodeConfig;
  //   return () => {
  //     delete window.handlePlusClick;
  //     delete window.handleNodeConfig;
  //   };
    
  // }, [handlePlusClick, handleNodeConfig]);

  const fetchWorkflows = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3002/workflow' , { 
        headers : { 
          authorization : token 
        }
      });
      const data = response.data;
      console.log("incoming data " + JSON.stringify(data))
      setWorkflows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
      setWorkflows([]);
    }
  };
  return (
    <div className="h-screen flex bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Save Warning Modal */}
      {showSaveWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg p-6 max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">Save Changes?</h3>
            <p className="text-[hsl(var(--foreground-muted))] mb-4">
              You have unsaved  changes. Would you like to save before navigating away?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelNavigation}
                className="px-4 py-2 text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSaveWarning(false);
                  setPendingNavigation(null);
                  window.location.href = pendingNavigation || '/';
                }}
                className="px-4 py-2 bg-[hsl(var(--surface))] hover:bg-[hsl(var(--surface-elevated))] border border-[hsl(var(--border))] rounded-lg transition-colors"
              >
                Don't Save
              </button>
              <button
                onClick={confirmNavigation}
                className="px-4 py-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white rounded-lg transition-colors"
              >
                Save & Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Left Navigation Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-[hsl(var(--surface))] border-r border-[hsl(var(--border))] flex flex-col"
      >
        {/* Navigation Header */}
        <div className="p-4 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Navigation</h2>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-4 space-y-2">
          <button
            onClick={() => handleNavigation('/')}
            className="w-full p-3 text-left hover:bg-[hsl(var(--surface-elevated))] rounded-lg transition-colors flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-[hsl(var(--foreground-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[hsl(var(--foreground))]">Homepage</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/workflows')}
            className="w-full p-3 text-left hover:bg-[hsl(var(--surface-elevated))] rounded-lg transition-colors flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-[hsl(var(--foreground-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-[hsl(var(--foreground))]">All Workflows</span>
          </button>

          <div className="pt-4 border-t border-[hsl(var(--border))] mt-4">
            <h3 className="text-sm font-medium text-[hsl(var(--foreground-muted))] mb-2 px-3">Switch Workflow</h3>
            {Array.isArray(workflows) && workflows.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-[hsl(var(--surface))]/60 backdrop-blur-xl border border-[hsl(var(--border))] rounded-2xl p-6 hover:border-[hsl(var(--primary))]/50 hover:scale-105 transition-[var(--transition-slow)] group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-[var(--radius)] flex items-center justify-center group-hover:bg-[hsl(var(--primary))]/30 transition-[var(--transition-smooth)]">
                    <svg
                      className="w-6 h-6 text-[hsl(var(--primary))]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <Link 
                    key={workflow.id}
                    href={`/workflow/${workflow.id}`}
                  >
                    <div className="flex-1">
          
                      <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                        {workflow.title || 'Untitled Workflow'}
                      </h3>

                      <p className="text-sm text-[hsl(var(--foreground-muted))]">
                        {(JSON.parse(workflow.nodes)).length|| 0} nodes
                      </p>
                    
                    </div>
                    </Link>
                  
                </div>
              
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">No workflows yet</h3>
            <p className="text-[hsl(var(--foreground-muted))] mb-6">Create your first automation workflow to get started</p>
            <button
              className="px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--foreground))] rounded-[var(--radius)] hover:bg-[hsl(var(--primary-hover))] transition-[var(--transition-smooth)]"
            >
              Create Your First Workflow
            </button>
          </div>
        )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[hsl(var(--surface))] border-b border-[hsl(var(--border))] p-4 flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-semibold text-[hsl(var(--foreground))]">
              Workflow #{workflowId}
            </h1>
            <p className="text-sm text-[hsl(var(--foreground-muted))]">Design your automation flow</p>
          </div>
          <div className="flex items-center gap-3">
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-3 py-1 rounded-lg text-sm ${
                  message.includes('successfully') || message.includes('completed')
                    ? 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] border border-[hsl(var(--success))]/30'
                    : message.includes('Add nodes')
                    ? 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))] border border-[hsl(var(--warning))]/30'
                    : 'bg-[hsl(var(--error))]/20 text-[hsl(var(--error))] border border-[hsl(var(--error))]/30'
                }`}
              >
                {message}
              </motion.div>
            )}
            
            {/* Add Actions Button - Only show when nodes exist */}
            {nodes.length > 0 && (
              <button
                onClick={() => {
                  // Find the last node and set it as selected for adding actions
                  const lastNode = nodes[nodes.length - 1];
                  //@ts-ignore
                  setSelectedNodeId(lastNode.id);
                  setPanelType('action');
                  setShowRightPanel(true);
                }}
                className="px-4 py-2 bg-[hsl(var(--primary))]/10 hover:bg-[hsl(var(--primary))]/20 border border-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Actions
              </button>
            )}

            <button
              onClick={() => {
                saveWorkflow();
                setHasUnsavedChanges(false);
              }}
              disabled={loading}
              className="px-4 py-2 bg-[hsl(var(--surface-elevated))] hover:bg-[hsl(var(--border))] border border-[hsl(var(--border))] disabled:opacity-50 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-[hsl(var(--foreground))]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[hsl(var(--foreground-muted))]/30 border-t-[hsl(var(--foreground-muted))] rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Save Workflow
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* ReactFlow Canvas */}
        <div className="flex-1 bg-[hsl(var(--background))] relative">
          {nodes.length === 0 ? (
            // Empty State - Add First Step
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">Add your first step</h3>
                <p className="text-[hsl(var(--foreground-muted))] mb-6 max-w-md">
                  Get started by adding a trigger to begin your automation workflow
                </p>
                <button
                  onClick={() => {
                    setPanelType('trigger');
                    setShowRightPanel(true);
                  }}
                  className="px-6 py-3 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Add First Step
                </button>
              </motion.div>
            </div>
          ) : (
            // ReactFlow with nodes
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodeChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Strict}
              defaultViewport={{ x: 0, y: 0, zoom: 1.0 }}
              className="bg-[hsl(var(--background))]"
              
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
              <Controls />
              <MiniMap  bgColor='#000000' nodeColor="#333" />
            </ReactFlow>
          )}
        </div>

        {/* Bottom Execute Button */}
        {nodes.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
          >
            <button
              onClick={executeWithLogs}
              disabled={loading || isExecuting}
              className="px-8 py-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] disabled:opacity-50 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
            >
              {isExecuting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Executing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 5a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                  Execute Workflow
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>

      {/* Right Panel for Triggers/Actions */}
      <AnimatePresence>
        {showRightPanel && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-[hsl(var(--surface))] border-l border-[hsl(var(--border))] z-40 shadow-2xl"
          >
            <div className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
              <h3 className="font-semibold text-[hsl(var(--foreground))]">
                {panelType === 'trigger' ? 'Choose Trigger' : 'Choose Action'}
              </h3>
              <button
                onClick={() => setShowRightPanel(false)}
                className="p-2 hover:bg-[hsl(var(--surface-elevated))] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-[hsl(var(--foreground-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto h-full pb-20">
              {panelType === 'trigger' ? (
                <>
                  <button
                    onClick={() => addFirstNode('trigger')}
                    className="w-full p-3 bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20 rounded-lg text-left hover:bg-[hsl(var(--success))]/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[hsl(var(--success))] rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[hsl(var(--foreground))] text-sm">Manual Trigger</p>
                        <p className="text-xs text-[hsl(var(--foreground-muted))]">Start manually</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => addFirstNode('webhook')}
                    className="w-full p-3 bg-[hsl(var(--secondary))]/10 border border-[hsl(var(--secondary))]/20 rounded-lg text-left hover:bg-[hsl(var(--secondary))]/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[hsl(var(--secondary))] rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[hsl(var(--foreground))] text-sm">Webhook</p>
                        <p className="text-xs text-[hsl(var(--foreground-muted))]">HTTP endpoint</p>
                      </div>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => addActionNode('telegram')}
                    className="w-full p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-left hover:bg-blue-500/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[hsl(var(--foreground))] text-sm">Telegram</p>
                        <p className="text-xs text-[hsl(var(--foreground-muted))]">Send message</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => addActionNode('webhook')}
                    className="w-full p-3 bg-[hsl(var(--secondary))]/10 border border-[hsl(var(--secondary))]/20 rounded-lg text-left hover:bg-[hsl(var(--secondary))]/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[hsl(var(--secondary))] rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[hsl(var(--foreground))] text-sm">Webhook</p>
                        <p className="text-xs text-[hsl(var(--foreground-muted))]">HTTP endpoint</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => addActionNode('gmail')}
                    className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-left hover:bg-red-500/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[hsl(var(--foreground))] text-sm">Gmail</p>
                        <p className="text-xs text-[hsl(var(--foreground-muted))]">Send email</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => addActionNode('awaitGmail')}
                    className="w-full p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-left hover:bg-orange-500/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[hsl(var(--foreground))] text-sm">Await Gmail</p>
                        <p className="text-xs text-[hsl(var(--foreground-muted))]">Wait for reply</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => addActionNode('aiagent')}
                    className="w-full p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-left hover:bg-purple-500/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[hsl(var(--foreground))] text-sm">AI Agent</p>
                        <p className="text-xs text-[hsl(var(--foreground-muted))]">AI automation</p>
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div> 
  );
};

