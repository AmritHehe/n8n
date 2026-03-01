"use client";

import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
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
    ConnectionMode,
    Handle,
    Position,
    useReactFlow,
    ReactFlowProvider,
    getBezierPath,
    EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Sparkles,
    Trash2,
    Copy,
    Check,
    Loader2,
    Workflow,
} from "lucide-react";
import api from "../../libs/apiClient";

import { edgeTypes, nodeTypes } from "../../components/nodes";
import EditorSidebar from "../../components/EditorSidebar";
import EditorHeader from "../../components/EditorHeader";

// ============================================
// MAIN WORKFLOW CLIENT
// ============================================

interface WorkflowClientProps {
    workflowId: string;
}

function WorkflowEditorInner({ workflowId }: WorkflowClientProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [executing, setExecuting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
    const [executionLogs, setExecutionLogs] = useState<string[]>([]);
    const [animatingEdgeId, setAnimatingEdgeId] = useState<string | null>(null); // Track which edge is animating

    // Compute edges with animation applied
    const edgesWithAnimation = useMemo(() => {
        return edges.map((e) => ({
            ...e,
            data: { ...e.data, isAnimating: e.id === animatingEdgeId },
        }));
    }, [edges, animatingEdgeId]);

    // Load workflow
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            redirect("/signin");
            return;
        }

        api.get(`/workflow/${workflowId}`)
            .then((res: any) => {
                const nodesData = JSON.parse(res.data?.nodes || "[]");
                const edgesData = JSON.parse(res.data?.Connections || "[]");
                // Make sure edges use animated type and have data
                const animatedEdges = edgesData.map((e: Edge) => ({
                    ...e,
                    type: "animated",
                    data: { ...e.data, isAnimating: false }
                }));
                setNodes(nodesData);
                setEdges(animatedEdges);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [workflowId, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => {
            // Add edge with animated type, data property, and nice styling
            const newEdge: Edge = {
                ...params,
                id: `e${params.source}-${params.target}`,
                type: "animated",
                animated: false,
                data: { isAnimating: false }, // Initialize data!
                style: { stroke: "#ffffff30", strokeWidth: 2 },
            } as Edge;
            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges]
    );


    // Save workflow
    const saveWorkflow = async () => {
        setSaving(true);
        try {
            await api.put(`/workflow/${workflowId}`, {
                data: {
                    nodes: JSON.stringify(nodes),
                    connections: JSON.stringify(edges),
                },
            });
            setMessage({ type: "success", text: "Workflow saved!" });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save" });
        }
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    // Execute workflow with SSE and edge animations
    const executeWorkflow = async () => {
        if (nodes.length === 0) {
            setMessage({ type: "error", text: "Add nodes first!" });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        // First save the workflow
        try {
            await api.put(`/workflow/${workflowId}`, {
                data: {
                    nodes: JSON.stringify(nodes),
                    connections: JSON.stringify(edges),
                },
            });
        } catch (err) {
            console.error("Failed to save before execute", err);
        }

        setExecuting(true);
        setExecutionLogs(["Starting execution..."]);

        // Reset all states
        setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isExecuting: false, isCompleted: false } })));
        setEdges((eds) => eds.map((e) => ({ ...e, data: { ...e.data, isAnimating: false } })));

        const token = localStorage.getItem("token");
        const base = process.env.NEXT_PUBLIC_BACKEND_API;
        const eventSource = new EventSource(`${base}/execute/logs/${workflowId}?token=${token}`);

        // Track execution: previousNodeId is the last node that STARTED executing
        let previousNodeId: string | null = null;

        eventSource.onmessage = (event) => {
            const data = event.data;
            console.log("SSE:", data);

            if (data === "done") {
                setExecutionLogs((logs) => [...logs, "Execution completed"]);
                eventSource.close();
                setExecuting(false);
                setAnimatingEdgeId(null); // Stop animation
                setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isExecuting: false } })));
                return;
            }

            // Try to parse as JSON first
            try {
                const parsed = JSON.parse(data);

                if (parsed.type === "nodeExecuting") {
                    const currentNodeId = String(parsed.nodeId);
                    setExecutionLogs((logs) => [...logs, `Node #${currentNodeId} executing...`]);

                    // Animate edge FROM previous TO current
                    if (previousNodeId && previousNodeId !== currentNodeId) {
                        const edgeId = `e${previousNodeId}-${currentNodeId}`;
                        console.log(`Animating edge: ${edgeId}`);
                        setAnimatingEdgeId(edgeId);
                    }

                    // Mark current node as executing
                    setNodes((nds) =>
                        nds.map((n) => ({
                            ...n,
                            data: {
                                ...n.data,
                                isExecuting: n.id === currentNodeId,
                                isCompleted: n.data.isCompleted || false,
                            },
                        }))
                    );

                    previousNodeId = currentNodeId;
                } else if (parsed.type === "nodeCompleted") {
                    const nodeId = String(parsed.nodeId);
                    setExecutionLogs((logs) => [...logs, `Node #${nodeId} completed`]);

                    setNodes((nds) =>
                        nds.map((n) =>
                            n.id === nodeId
                                ? { ...n, data: { ...n.data, isExecuting: false, isCompleted: true } }
                                : n
                        )
                    );
                }
            } catch {
                // Not JSON - check for plain text patterns
                // Pattern: "currently executing the process no . X"
                const processMatch = data.match(/currently executing the process no \. (\d+)/i);
                if (processMatch) {
                    const processNum = processMatch[1];
                    setExecutionLogs((logs) => [...logs, `Process #${processNum} starting...`]);

                    // The process number corresponds to the node ID in order
                    const currentNodeId = processNum;

                    // Animate edge if we have a previous node
                    if (previousNodeId && previousNodeId !== currentNodeId) {
                        const edgeId = `e${previousNodeId}-${currentNodeId}`;
                        console.log(`Animating edge: ${edgeId}`);
                        setAnimatingEdgeId(edgeId);
                    }

                    // Mark current node as executing
                    setNodes((nds) =>
                        nds.map((n) => ({
                            ...n,
                            data: {
                                ...n.data,
                                isExecuting: n.id === currentNodeId,
                            },
                        }))
                    );

                    previousNodeId = currentNodeId;
                } else {
                    // Just log other messages
                    setExecutionLogs((logs) => [...logs, data]);
                }
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
            setExecuting(false);
        };

        // Wait for SSE connection
        await new Promise<void>((resolve) => {
            eventSource.onopen = () => {
                console.log("SSE connected");
                resolve();
            };
        });

        // Trigger execution
        try {
            await api.post(`/execute`, {
                nodes: JSON.stringify(nodes),
                connections: JSON.stringify(edges),
                id: workflowId,
            });
        } catch (error) {
            setMessage({ type: "error", text: "Execution failed" });
            setExecuting(false);
        }
    };


    if (loading) {
        return (
            <div className="h-screen bg-[#030303] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-300 animate-spin" />
            </div>
        );
    }



    // Add node with correct label based on trigger/action
    // IMPORTANT: webhook/awaitGmail always use label='action' even as first node!
    const addNode = (type: string, isTrigger: boolean = false) => {
        // Use max existing id + 1 to avoid collisions after deletions
        const maxId = nodes.reduce((max, n) => Math.max(max, parseInt(n.id) || 0), 0);
        const id = (maxId + 1).toString();
        // Webhook and awaitGmail ALWAYS use 'action' label - they wait for external trigger
        const isWebhookType = type === "webhook" || type === "awaitGmail";
        const newNode: Node = {
            id,
            type,
            position: { x: 150 + nodes.length * 60, y: 150 + nodes.length * 40 },
            data: {
                label: isWebhookType ? "action" : (isTrigger || type === "trigger" ? "trigger" : "action"),
                workflowId,
                message: "",
                webhook: false, // For webhook/awaitGmail - means waiting for callback
                isExecuting: false,
                afterPlayNodes: null,
            },
        };
        setNodes((nds) => [...nds, newNode]);
    };

    return (
        <div className="h-screen bg-[#030303] flex overflow-hidden">
            {/* Toast */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className={`fixed top-6 left-1/2 z-50 px-6 py-3 rounded-full backdrop-blur-xl border ${message.type === "success"
                            ? "bg-blue-300/20 border-blue-300/40 text-blue-300"
                            : message.type === "error"
                                ? "bg-red-500/20 border-red-500/40 text-red-300"
                                : "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <EditorSidebar
                workflowId={workflowId}
                nodes={nodes}
                addNode={addNode}
                executionLogs={executionLogs}
            />

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col">
                 {/* Top Bar */}
                <EditorHeader
                    nodesCount={nodes.length}
                    saveWorkflow={saveWorkflow}
                    saving={saving}
                    executeWorkflow={executeWorkflow}
                    executing={executing}
                />

                {/* ReactFlow Canvas */}
                <div className="flex-1">
                    {nodes.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                
                                <h3 className="text-xl font-semibold text-white mb-2">Start Building</h3>
                                <p className="text-white/40 mb-6 max-w-xs">
                                    Add your first node from the sidebar to start building your automation workflow
                                </p>
                            </motion.div>
                        </div>
                    ) : (
                        <ReactFlow
                            nodes={nodes}
                            edges={edgesWithAnimation}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            connectionMode={ConnectionMode.Strict}
                            fitView
                            className="bg-[#030303]"
                            defaultEdgeOptions={{
                                type: "animated",
                                style: { stroke: "#ffffff30", strokeWidth: 2 },
                            }}
                            connectionLineStyle={{ stroke: "#60a5fa", strokeWidth: 2 }}
                        >
                            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#ffffff10" />
                        <Controls className="bg-[#0a0a0a]! border-white/10! rounded-xl! [&>button]:bg-transparent1 [&>button]:border-white/10! [&>button]:text-white/601 [&>button:hover]:bg-white/10!" />
                            <MiniMap
                            className="bg-[#0a0a0a]! border-white/10! rounded-xl!"
                                nodeColor={(node) => {
                                    const colors: Record<string, string> = {
                                        trigger: "#60a5fa",
                                        webhookTrigger: "#8b5cf6",
                                        telegram: "#0ea5e9",
                                        gmail: "#ef4444",
                                        awaitGmail: "#f97316",
                                        aiagent: "#a855f7",
                                    };
                                    return colors[node.type || ""] || "#666";
                                }}
                            />
                        </ReactFlow>
                    )}
                </div>
            </div>
        </div>
    );
}

// Wrap with ReactFlow Provider
export default function WorkflowClient({ workflowId }: WorkflowClientProps) {
    return (
        <ReactFlowProvider>
            <WorkflowEditorInner workflowId={workflowId} />
        </ReactFlowProvider>
    );
}
