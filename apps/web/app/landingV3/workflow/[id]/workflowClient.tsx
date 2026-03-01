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
    ArrowLeft,
    Save,
    Play,
    X,
    MousePointerClick,
    Webhook,
    Bot,
    Sparkles,
    Trash2,
    Copy,
    Check,
    Loader2,
    Workflow,
    Key,
} from "lucide-react";
import api from "../../../apiClient";

// ============================================
// ANIMATED EDGE COMPONENT
// ============================================
function AnimatedEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: EdgeProps) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const isAnimating = data?.isAnimating;

    return (
        <>
            {/* Base edge */}
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                strokeWidth={isAnimating ? 2.5 : 2}
                stroke={isAnimating ? "#60a5fa" : "#ffffff20"}
                fill="none"
            />

            {/* Subtle glow when executing */}
            {isAnimating && (
                <>
                    <path
                        d={edgePath}
                        strokeWidth={6}
                        stroke="#60a5fa"
                        fill="none"
                        opacity="0.2"
                        style={{ filter: "blur(4px)" }}
                    />
                    {/* Single travelling dot */}
                    <circle r="3" fill="#60a5fa">
                        <animateMotion dur="1s" repeatCount="indefinite" path={edgePath} />
                    </circle>
                </>
            )}
        </>
    );
}

const edgeTypes = {
    animated: AnimatedEdge,
};

// ============================================
// PREMIUM NODE COMPONENTS
// ============================================

function PremiumNode({
    id,
    data,
    icon: Icon,
    color,
    title,
    subtitle,
    children,
    onSave,
}: {
    id: string;
    data: any;
    icon: any;
    color: string;
    title: string;
    subtitle: string;
    children?: React.ReactNode;
    onSave?: () => void;
}) {
    const { setNodes, setEdges } = useReactFlow();
    const [showConfig, setShowConfig] = useState(false);

    const deleteNode = (e: React.MouseEvent) => {
        e.stopPropagation();
        setNodes((nds) => {
            const updated = nds.filter((n) => n.id !== id);
            return [...updated];
        });
        setEdges((eds) => {
            const updated = eds.filter((e) => e.source !== id && e.target !== id);
            return [...updated];
        });
    };

    const handleSave = () => {
        onSave?.();
        setShowConfig(false);
    };

    const isExecuting = data?.isExecuting;
    const isCompleted = data?.isCompleted;

    return (
        <>
            {/* Wrapper for handles - must be outside overflow-hidden */}
            <div className="relative">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group min-w-[280px] rounded-2xl overflow-hidden cursor-pointer"
                    style={{
                        background: `linear-gradient(135deg, ${color}15 0%, #0a0a0a 100%)`,
                        borderColor: isExecuting ? color : `${color}40`,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        boxShadow: isExecuting
                            ? `0 0 20px ${color}30`
                            : `0 4px 24px rgba(0,0,0,0.4)`,
                        transition: 'box-shadow 0.3s ease',
                    }}
                    onClick={() => setShowConfig(true)}
                >

                    {/* Completed Indicator */}
                    {isCompleted && !isExecuting && (
                        <div className="absolute top-3 right-12 w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center z-10">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    )}

                    {/* Header */}
                    <div className="p-4 flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${color}30` }}
                        >
                            {Icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm truncate">{title}</h3>
                            <p className="text-xs text-white/50 truncate">{subtitle}</p>
                        </div>
                        <button
                            onClick={deleteNode}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Node ID badge */}
                    <div className="absolute bottom-2 left-4 text-[10px] text-white/30 font-mono">#{id}</div>
                </motion.div>

                {/* Handles - Outside overflow-hidden container */}
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-4! h-4! bg-white! border-21 hover:scale-150! hover:shadow-lg! transition-all duration-200"
                    style={{ borderColor: color }}
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-4! h-4! bg-white! border-21 hover:scale-150! hover:shadow-lg! transition-all duration-200"
                    style={{ borderColor: color }}
                />
            </div>

            {/* Config Modal */}
            <AnimatePresence>
                {showConfig && children && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-80 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h4 className="font-medium text-white">Configure {title}</h4>
                            <button onClick={() => setShowConfig(false)} className="p-1 rounded hover:bg-white/10">
                                <X className="w-4 h-4 text-white/60" />
                            </button>
                        </div>
                        <div className="p-4">{children}</div>
                        {/* Save Button */}
                        <div className="p-4 pt-0 border-t border-white/5 mt-2">
                            <button
                                onClick={handleSave}
                                className="w-full py-2.5 rounded-lg bg-linear-to-r from-blue-300 to-blue-300 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-300/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Configuration
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// ============================================
// INDIVIDUAL NODE TYPES
// ============================================

// Trigger Node
function TriggerNode({ id, data }: { id: string; data: any }) {
    return (
        <PremiumNode
            id={id}
            data={data}
            icon={<MousePointerClick className="w-5 h-5" style={{ color: "#60a5fa" }} />}
            color="#60a5fa"
            title="Manual Trigger"
            subtitle="Click Execute to start"
        />
    );
}

// Webhook Node (used as both trigger and action - backend uses type: 'webhook')
function WebhookNode({ id, data }: { id: string; data: any }) {
    const [copied, setCopied] = useState(false);
    const base = process.env.NEXT_PUBLIC_BACKEND_API;
    const webhookUrl = `${base}/webhook/${id}?workflowId=${data?.workflowId || ""}`;

    const copyUrl = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Determine if this is a trigger or action based on label
    const isTrigger = data?.label === "trigger";

    return (
        <PremiumNode
            id={id}
            data={data}
            icon={<Webhook className="w-5 h-5" style={{ color: "#8b5cf6" }} />}
            color="#8b5cf6"
            title={isTrigger ? "Webhook Trigger" : "Webhook Action"}
            subtitle="HTTP endpoint"
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-xs text-white/50 mb-1.5">Webhook URL</label>
                    <div className="flex gap-2">
                        <input
                            readOnly
                            value={webhookUrl}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs font-mono truncate"
                        />
                        <button
                            onClick={copyUrl}
                            className="px-3 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <p className="text-xs text-white/40">
                    {isTrigger
                        ? "Send POST request to this URL to trigger workflow"
                        : "Workflow pauses here, waiting for webhook call"
                    }
                </p>
            </div>
        </PremiumNode>
    );
}

// Telegram Node
function TelegramNode({ id, data }: { id: string; data: any }) {
    const { setNodes, getNodes } = useReactFlow();
    const [message, setMessage] = useState(data?.message || "");
    const [credentialId, setCredentialId] = useState(data?.credentialsId || "");
    const [credentials, setCredentials] = useState<any[]>([]);
    const [usePrevious, setUsePrevious] = useState(data?.previousResponse || false);

    useEffect(() => {
        api.get("/api/v1/credentials").then((res: any) => setCredentials(Array.isArray(res.data) ? res.data : []));
    }, []);

    const updateNodeData = (updates: any) => {
        setNodes((nds) =>
            nds.map((n) =>
                n.id === id ? { ...n, data: { ...n.data, ...updates } } : n
            )
        );
    };

    const previousNodes = getNodes().filter((n) => n.id !== id);

    return (
        <PremiumNode
            id={id}
            data={data}
            icon={<Image src="/telegram.svg" alt="Telegram" width={20} height={20} className="invert" />}
            color="#0ea5e9"
            title="Send Telegram"
            subtitle={data?.message ? `"${data.message.slice(0, 20)}..."` : "Configure message"}
            onSave={() => updateNodeData({ message, credentialsId: credentialId, previousResponse: usePrevious })}
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-xs text-white/50 mb-1.5">Credential</label>
                    <select
                        value={credentialId}
                        onChange={(e) => setCredentialId(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    >
                        <option value="">Select credential...</option>
                        {credentials
                            .filter((c) => c.platform === "teligram")
                            .map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={usePrevious}
                        onChange={(e) => setUsePrevious(e.target.checked)}
                        className="rounded"
                    />
                    <label className="text-xs text-white/60">Use previous node response</label>
                </div>

                {usePrevious && (
                    <select
                        value={data?.previousResponseFromWhichNode || ""}
                        onChange={(e) => updateNodeData({ previousResponseFromWhichNode: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    >
                        <option value="">Select node...</option>
                        {previousNodes.map((n) => (
                            <option key={n.id} value={n.id}>Node #{n.id} ({n.type})</option>
                        ))}
                    </select>
                )}

                <div>
                    <label className="block text-xs text-white/50 mb-1.5">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter message..."
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm h-20 resize-none focus:outline-none focus:border-cyan-500/50"
                    />
                </div>
            </div>
        </PremiumNode>
    );
}

// Gmail Node
function GmailNode({ id, data }: { id: string; data: any }) {
    const { setNodes, getNodes } = useReactFlow();
    const [credentials, setCredentials] = useState<any[]>([]);
    const [to, setTo] = useState(data?.to || "");
    const [subject, setSubject] = useState(data?.subject || "");
    const [message, setMessage] = useState(data?.message || "");
    const [credentialId, setCredentialId] = useState(data?.credentialsId || "");

    useEffect(() => {
        api.get("/api/v1/credentials").then((res: any) => setCredentials(Array.isArray(res.data) ? res.data : []));
    }, []);

    const updateNodeData = (updates: any) => {
        setNodes((nds) =>
            nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...updates } } : n))
        );
    };

    return (
        <PremiumNode
            id={id}
            data={data}
            icon={<Image src="/sendmail.svg" alt="Send Mail" width={20} height={20} className="invert" />}
            color="#ef4444"
            title="Send Email"
            subtitle={data?.to ? `To: ${data.to}` : "Configure email"}
            onSave={() => updateNodeData({ to, subject, message, credentialsId: credentialId })}
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-xs text-white/50 mb-1.5">Credential</label>
                    <select
                        value={credentialId}
                        onChange={(e) => setCredentialId(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50"
                    >
                        <option value="">Select credential...</option>
                        {credentials
                            .filter((c) => c.platform === "gmail")
                            .map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                    </select>
                </div>
                <input
                    placeholder="To email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
                <input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
                <textarea
                    placeholder="Message body..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm h-16 resize-none"
                />
            </div>
        </PremiumNode>
    );
}

// Await Gmail Node (Action with webhook)
function AwaitGmailNode({ id, data }: { id: string; data: any }) {
    const { setNodes, getNodes } = useReactFlow();
    const [credentials, setCredentials] = useState<any[]>([]);
    const base = process.env.NEXT_PUBLIC_BACKEND_API;
    const webhookUrl = `${base}/webhook/${id}?workflowId=${data?.workflowId || ""}`;
    const [copied, setCopied] = useState(false);
    const [to, setTo] = useState(data?.to || "");
    const [subject, setSubject] = useState(data?.subject || "");
    const [credentialId, setCredentialId] = useState(data?.credentialsId || "");

    useEffect(() => {
        api.get("/api/v1/credentials").then((res: any) => setCredentials(Array.isArray(res.data) ? res.data : []));
    }, []);

    const updateNodeData = (updates: any) => {
        setNodes((nds) =>
            nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...updates } } : n))
        );
    };

    return (
        <PremiumNode
            id={id}
            data={data}
            icon={<Image src="/sendMail&wait.svg" alt="Send Mail & Wait" width={20} height={20} className="invert" />}
            color="#f97316"
            title="Await Gmail Reply"
            subtitle="Wait for email response"
            onSave={() => updateNodeData({ to, subject, credentialsId: credentialId })}
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-xs text-white/50 mb-1.5">Webhook URL (for response)</label>
                    <div className="flex gap-2">
                        <input readOnly value={webhookUrl} className="flex-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white text-[10px] font-mono truncate" />
                        <button
                            onClick={() => { navigator.clipboard.writeText(webhookUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                            className="px-2 py-1.5 bg-orange-500/20 text-orange-400 rounded text-xs"
                        >
                            {copied ? "✓" : "Copy"}
                        </button>
                    </div>
                </div>
                <select
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                >
                    <option value="">Select credential...</option>
                    {credentials.filter((c) => c.platform === "gmail").map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                </select>
                <input placeholder="To email" value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
            </div>
        </PremiumNode>
    );
}

// AI Agent Node
function AIAgentNode({ id, data }: { id: string; data: any }) {
    const { setNodes, getNodes } = useReactFlow();
    const previousNodes = getNodes().filter((n) => n.id !== id);
    const [message, setMessage] = useState(data?.message || "");
    const [usePrevious, setUsePrevious] = useState(data?.previousResponse || false);

    const updateNodeData = (updates: any) => {
        setNodes((nds) =>
            nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...updates } } : n))
        );
    };

    return (
        <PremiumNode
            id={id}
            data={data}
            icon={<Bot className="w-5 h-5" style={{ color: "#a855f7" }} />}
            color="#a855f7"
            title="AI Agent"
            subtitle={data?.message ? "Prompt configured" : "Configure AI prompt"}
            onSave={() => updateNodeData({ message, previousResponse: usePrevious })}
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-xs text-white/50 mb-1.5">Model</label>
                    <select
                        value={data?.model || "gemini"}
                        onChange={(e) => updateNodeData({ model: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    >
                        <option value="gemini">Gemini (Google)</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={usePrevious}
                        onChange={(e) => setUsePrevious(e.target.checked)}
                    />
                    <label className="text-xs text-white/60">Use previous node response</label>
                </div>

                {usePrevious && (
                    <select
                        value={data?.previousResponseFromWhichNode || ""}
                        onChange={(e) => updateNodeData({ previousResponseFromWhichNode: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    >
                        <option value="">Select node...</option>
                        {previousNodes.map((n) => (
                            <option key={n.id} value={n.id}>#{n.id} ({n.type})</option>
                        ))}
                    </select>
                )}

                <textarea
                    placeholder="Enter AI prompt..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm h-20 resize-none"
                />
            </div>
        </PremiumNode>
    );
}

// Node Types Registry
const nodeTypes = {
    trigger: TriggerNode,
    webhook: WebhookNode, // Used for both trigger and action
    telegram: TelegramNode,
    gmail: GmailNode,
    awaitGmail: AwaitGmailNode,
    aiagent: AIAgentNode,
};

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
    const logsRef = useRef<HTMLDivElement>(null);

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
            redirect("/landingV3/signin");
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

    // Auto-scroll logs
    useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
    }, [executionLogs]);

    if (loading) {
        return (
            <div className="h-screen bg-[#030303] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-300 animate-spin" />
            </div>
        );
    }

    const triggerNodes = [
        { type: "trigger", icon: <MousePointerClick className="w-4 h-4" style={{ color: "#60a5fa" }} />, label: "Manual Trigger", color: "#60a5fa" },
        { type: "webhook", icon: <Webhook className="w-4 h-4" style={{ color: "#8b5cf6" }} />, label: "Webhook Trigger", color: "#8b5cf6", isTrigger: true },
    ];

    const actionNodes = [
        { type: "telegram", icon: <Image src="/telegram.svg" alt="Telegram" width={16} height={16} className="invert" />, label: "Telegram", color: "#0ea5e9" },
        { type: "gmail", icon: <Image src="/sendmail.svg" alt="Gmail" width={16} height={16} className="invert" />, label: "Gmail", color: "#ef4444" },
        { type: "webhook", icon: <Webhook className="w-4 h-4" style={{ color: "#8b5cf6" }} />, label: "Webhook (Wait)", color: "#8b5cf6", isTrigger: false },
        { type: "awaitGmail", icon: <Image src="/sendMail&wait.svg" alt="Await Gmail" width={16} height={16} className="invert" />, label: "Await Gmail", color: "#f97316" },
        { type: "aiagent", icon: <Bot className="w-4 h-4" style={{ color: "#a855f7" }} />, label: "AI Agent", color: "#a855f7" },
    ];

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

            {/* Left Sidebar */}
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                    <Link
                        href="/landingV3/workflows"
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to Workflows</span>
                    </Link>
                    <h1 className="text-lg font-semibold text-white">Workflow Editor</h1>
                    <p className="text-xs text-white/40 mt-1">ID: {workflowId}</p>
                </div>

                {/* Add Nodes Section */}
                {/* Add Nodes Section */}
                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Add Nodes</h3>

                    {/* Triggers - only show when no nodes exist */}
                    {nodes.length === 0 && (
                        <div className="mb-4">
                            <p className="text-xs text-white/30 mb-2">Triggers (start with one)</p>
                            <div className="space-y-2">
                                {triggerNodes.map((opt) => (
                                    <button
                                        key={`${opt.type}-trigger`}
                                        onClick={() => addNode(opt.type, opt.isTrigger ?? true)}
                                        className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-left transition-all flex items-center gap-3 group"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ background: `${opt.color}20` }}
                                        >
                                            {opt.icon}
                                        </div>
                                        <span className="text-sm text-white/80 group-hover:text-white">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions - always show if nodes exist */}
                    {nodes.length > 0 && (
                        <div>
                            <p className="text-xs text-white/30 mb-2">Actions</p>
                            <div className="space-y-2">
                                {actionNodes.map((opt, idx) => (
                                    <button
                                        key={`${opt.type}-${idx}`}
                                        onClick={() => addNode(opt.type, opt.isTrigger ?? false)}
                                        className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-left transition-all flex items-center gap-3 group"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ background: `${opt.color}20` }}
                                        >
                                            {opt.icon}
                                        </div>
                                        <span className="text-sm text-white/80 group-hover:text-white">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty hint */}
                    {nodes.length === 0 && (
                        <p className="text-xs text-white/20 mt-4 text-center">
                            Start by adding a trigger node
                        </p>
                    )}
                </div>

                {/* Credentials Link */}
                <Link
                    href="/landingV3/credentials"
                    className="mx-4 mb-2 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-white/40 hover:text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                    <Key className="w-4 h-4" />
                    <span className="text-xs">Manage Credentials</span>
                </Link>

                {/* Execution Logs */}
                {executionLogs.length > 0 && (
                    <div className="border-t border-white/10 p-4">
                        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Logs</h3>
                        <div
                            ref={logsRef}
                            className="h-32 overflow-y-auto bg-black/40 rounded-lg p-2 text-xs font-mono text-white/60 space-y-1"
                        >
                            {executionLogs.map((log, i) => (
                                <div key={i}>{log}</div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <motion.div
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    className="bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-white/40">

                            <span className="text-sm">{nodes.length} nodes</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={saveWorkflow}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span className="text-sm">Save</span>
                        </button>

                        <button
                            onClick={executeWorkflow}
                            disabled={executing || nodes.length === 0}
                            className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-blue-400 to-blue-300 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-blue-300/20 transition-all disabled:opacity-50"
                        >
                            {executing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                            <span className="text-sm">{executing ? "Running..." : "Execute"}</span>
                        </button>
                    </div>
                </motion.div>

                {/* ReactFlow Canvas */}
                <div className="flex-1">
                    {nodes.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-linear-to-r from-blue-300/20 to-blue-300/10 flex items-center justify-center mx-auto mb-6 border border-blue-300/20">
                                    <Sparkles className="w-8 h-8 text-blue-200" />
                                </div>
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
