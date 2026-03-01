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
    useReactFlow,
    ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
    ArrowLeft,
    Save,
    Play,
    MousePointerClick,
    Webhook,
    Bot,
    Sparkles,
    Loader2,
    Key,
} from "lucide-react";

/* Shared components */
import Toast from "../../_components/Toast";
import AnimatedEdge from "../../_components/AnimatedEdge";

/* Node components */
import TriggerNode from "../../_components/nodes/TriggerNode";
import WebhookNode from "../../_components/nodes/WebhookNode";
import TelegramNode from "../../_components/nodes/TelegramNode";
import GmailNode from "../../_components/nodes/GmailNode";
import AwaitGmailNode from "../../_components/nodes/AwaitGmailNode";
import AIAgentNode from "../../_components/nodes/AIAgentNode";

import api from "../../../apiClient";

/* ─── registries ─── */
const edgeTypes = { animated: AnimatedEdge };
const nodeTypes = {
    trigger: TriggerNode,
    webhook: WebhookNode,
    telegram: TelegramNode,
    gmail: GmailNode,
    awaitGmail: AwaitGmailNode,
    aiagent: AIAgentNode,
};

/* ─── types ─── */
interface WorkflowClientProps {
    workflowId: string;
}

/* ═══════════════════════════════════════════════
   WORKFLOW EDITOR INNER
   ═══════════════════════════════════════════════ */

function WorkflowEditorInner({ workflowId }: WorkflowClientProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [executing, setExecuting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
    const [executionLogs, setExecutionLogs] = useState<string[]>([]);
    const [animatingEdgeId, setAnimatingEdgeId] = useState<string | null>(null);
    const logsRef = useRef<HTMLDivElement>(null);

    /* edges with animation applied */
    const edgesWithAnimation = useMemo(
        () => edges.map((e) => ({ ...e, data: { ...e.data, isAnimating: e.id === animatingEdgeId } })),
        [edges, animatingEdgeId]
    );

    /* load workflow */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { redirect("/landingV4/signin"); return; }

        api.get(`/workflow/${workflowId}`)
            .then((res: any) => {
                const nd = JSON.parse(res.data?.nodes || "[]");
                const ed = JSON.parse(res.data?.Connections || "[]").map((e: Edge) => ({
                    ...e,
                    type: "animated",
                    data: { ...e.data, isAnimating: false },
                }));
                setNodes(nd);
                setEdges(ed);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [workflowId, setNodes, setEdges]);

    /* connect */
    const onConnect = useCallback(
        (params: Connection) => {
            const edge: Edge = {
                ...params,
                id: `e${params.source}-${params.target}`,
                type: "animated",
                animated: false,
                data: { isAnimating: false },
                style: { stroke: "#ffffff20", strokeWidth: 2 },
            } as Edge;
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges]
    );

    /* save */
    const saveWorkflow = async () => {
        setSaving(true);
        try {
            await api.put(`/workflow/${workflowId}`, {
                data: { nodes: JSON.stringify(nodes), connections: JSON.stringify(edges) },
            });
            setMessage({ type: "success", text: "Workflow saved!" });
        } catch {
            setMessage({ type: "error", text: "Failed to save" });
        }
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    /* execute */
    const executeWorkflow = async () => {
        if (nodes.length === 0) {
            setMessage({ type: "error", text: "Add nodes first!" });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        try {
            await api.put(`/workflow/${workflowId}`, {
                data: { nodes: JSON.stringify(nodes), connections: JSON.stringify(edges) },
            });
        } catch { /* best-effort save */ }

        setExecuting(true);
        setExecutionLogs(["Starting execution..."]);
        setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isExecuting: false, isCompleted: false } })));
        setEdges((eds) => eds.map((e) => ({ ...e, data: { ...e.data, isAnimating: false } })));

        const token = localStorage.getItem("token");
        const base = process.env.NEXT_PUBLIC_BACKEND_API;
        const es = new EventSource(`${base}/execute/logs/${workflowId}?token=${token}`);

        let prevNodeId: string | null = null;

        es.onmessage = (event) => {
            const d = event.data;
            if (d === "done") {
                setExecutionLogs((l) => [...l, "Execution completed"]);
                es.close();
                setExecuting(false);
                setAnimatingEdgeId(null);
                setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isExecuting: false } })));
                return;
            }

            try {
                const parsed = JSON.parse(d);
                if (parsed.type === "nodeExecuting") {
                    const cid = String(parsed.nodeId);
                    setExecutionLogs((l) => [...l, `Node #${cid} executing...`]);
                    if (prevNodeId && prevNodeId !== cid) setAnimatingEdgeId(`e${prevNodeId}-${cid}`);
                    setNodes((nds) =>
                        nds.map((n) => ({
                            ...n,
                            data: { ...n.data, isExecuting: n.id === cid, isCompleted: n.data.isCompleted || false },
                        }))
                    );
                    prevNodeId = cid;
                } else if (parsed.type === "nodeCompleted") {
                    const nid = String(parsed.nodeId);
                    setExecutionLogs((l) => [...l, `Node #${nid} completed`]);
                    setNodes((nds) =>
                        nds.map((n) =>
                            n.id === nid ? { ...n, data: { ...n.data, isExecuting: false, isCompleted: true } } : n
                        )
                    );
                }
            } catch {
                const m = d.match(/currently executing the process no \. (\d+)/i);
                if (m) {
                    const cid = m[1];
                    setExecutionLogs((l) => [...l, `Process #${cid} starting...`]);
                    if (prevNodeId && prevNodeId !== cid) setAnimatingEdgeId(`e${prevNodeId}-${cid}`);
                    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isExecuting: n.id === cid } })));
                    prevNodeId = cid;
                } else {
                    setExecutionLogs((l) => [...l, d]);
                }
            }
        };

        es.onerror = () => { es.close(); setExecuting(false); };

        await new Promise<void>((r) => { es.onopen = () => r(); });

        try {
            await api.post("/execute", { nodes: JSON.stringify(nodes), connections: JSON.stringify(edges), id: workflowId });
        } catch {
            setMessage({ type: "error", text: "Execution failed" });
            setExecuting(false);
        }
    };

    /* auto-scroll logs */
    useEffect(() => { logsRef.current && (logsRef.current.scrollTop = logsRef.current.scrollHeight); }, [executionLogs]);

    const clearMessage = useCallback(() => setMessage(null), []);

    /* ─── loading state ─── */
    if (loading) {
        return (
            <div className="h-screen bg-[#08080c] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400/60 animate-spin" />
            </div>
        );
    }

    /* ─── node palette config ─── */
    const triggerNodes = [
        { type: "trigger", icon: <MousePointerClick className="w-4 h-4" style={{ color: "#60a5fa" }} />, label: "Manual Trigger", color: "#60a5fa" },
        { type: "webhook", icon: <Webhook className="w-4 h-4" style={{ color: "#8b5cf6" }} />, label: "Webhook Trigger", color: "#8b5cf6", isTrigger: true },
    ];

    const actionNodes = [
        { type: "telegram", icon: <Image src="/telegram.svg" alt="" width={16} height={16} className="invert" />, label: "Telegram", color: "#0ea5e9" },
        { type: "gmail", icon: <Image src="/sendmail.svg" alt="" width={16} height={16} className="invert" />, label: "Gmail", color: "#ef4444" },
        { type: "webhook", icon: <Webhook className="w-4 h-4" style={{ color: "#8b5cf6" }} />, label: "Webhook (Wait)", color: "#8b5cf6", isTrigger: false },
        { type: "awaitGmail", icon: <Image src="/sendMail&wait.svg" alt="" width={16} height={16} className="invert" />, label: "Await Gmail", color: "#f97316" },
        { type: "aiagent", icon: <Bot className="w-4 h-4" style={{ color: "#a855f7" }} />, label: "AI Agent", color: "#a855f7" },
    ];

    const addNode = (type: string, isTrigger: boolean = false) => {
        const maxId = nodes.reduce((mx, n) => Math.max(mx, parseInt(n.id) || 0), 0);
        const id = (maxId + 1).toString();
        const isWebhookType = type === "webhook" || type === "awaitGmail";
        const newNode: Node = {
            id,
            type,
            position: { x: 150 + nodes.length * 60, y: 150 + nodes.length * 40 },
            data: {
                label: isWebhookType ? "action" : isTrigger || type === "trigger" ? "trigger" : "action",
                workflowId,
                message: "",
                webhook: false,
                isExecuting: false,
                afterPlayNodes: null,
            },
        };
        setNodes((nds) => [...nds, newNode]);
    };

    /* ─── render ─── */
    return (
        <div className="h-screen bg-[#08080c] flex overflow-hidden antialiased">
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <style>{`
                :root { --serif: 'Playfair Display', Georgia, serif; --sans: 'Inter', system-ui, sans-serif; }
                body, * { font-family: var(--sans); }
                .font-ed { font-family: var(--serif); }
            `}</style>

            <Toast message={message} onDismiss={clearMessage} />

            {/* ─── Left Sidebar ─── */}
            <div className="w-64 bg-[#0c0c14] border-r border-white/6 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-white/6">
                    <Link href="/landingV4/workflows" className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-4 text-[13px] group">
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Workflows</span>
                    </Link>
                    <h1 className="font-ed text-base text-white/80">Workflow Editor</h1>
                    <p className="text-[11px] text-white/20 mt-0.5 font-mono">ID: {workflowId}</p>
                </div>

                {/* Node palette */}
                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-[10px] font-medium text-white/25 uppercase tracking-[0.1em] mb-3">Add Nodes</h3>

                    {nodes.length === 0 && (
                        <div className="mb-4">
                            <p className="text-[10px] text-white/20 mb-2 uppercase tracking-wider">Triggers</p>
                            <div className="space-y-1.5">
                                {triggerNodes.map((opt) => (
                                    <button
                                        key={`${opt.type}-t`}
                                        onClick={() => addNode(opt.type, opt.isTrigger ?? true)}
                                        className="w-full p-2.5 bg-white/3 hover:bg-white/6 border border-white/6 hover:border-white/12 rounded-xl text-left transition-all flex items-center gap-3 group"
                                    >
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${opt.color}18` }}>
                                            {opt.icon}
                                        </div>
                                        <span className="text-[12px] text-white/50 group-hover:text-white/80">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {nodes.length > 0 && (
                        <div>
                            <p className="text-[10px] text-white/20 mb-2 uppercase tracking-wider">Actions</p>
                            <div className="space-y-1.5">
                                {actionNodes.map((opt, i) => (
                                    <button
                                        key={`${opt.type}-${i}`}
                                        onClick={() => addNode(opt.type, opt.isTrigger ?? false)}
                                        className="w-full p-2.5 bg-white/3 hover:bg-white/6 border border-white/6 hover:border-white/12 rounded-xl text-left transition-all flex items-center gap-3 group"
                                    >
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${opt.color}18` }}>
                                            {opt.icon}
                                        </div>
                                        <span className="text-[12px] text-white/50 group-hover:text-white/80">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {nodes.length === 0 && (
                        <p className="text-[11px] text-white/15 mt-6 text-center">Start by adding a trigger node</p>
                    )}
                </div>

                {/* Credentials link */}
                <Link
                    href="/landingV4/credentials"
                    className="m-4 p-3 bg-white/3 border border-white/6 rounded-xl flex items-center gap-3 text-white/30 hover:text-white/60 hover:border-white/12 transition-all group"
                >
                    <Key className="w-4 h-4" />
                    <span className="text-[12px]">Manage Credentials</span>
                </Link>

                {/* Execution logs */}
                {executionLogs.length > 0 && (
                    <div className="border-t border-white/6 p-4">
                        <h3 className="text-[10px] font-medium text-white/25 uppercase tracking-[0.1em] mb-2">Logs</h3>
                        <div
                            ref={logsRef}
                            className="h-32 overflow-y-auto bg-black/30 rounded-lg p-2 text-[11px] font-mono text-white/40 space-y-0.5"
                        >
                            {executionLogs.map((log, i) => (
                                <div key={i}>{log}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Main Canvas ─── */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <div className="bg-[#0c0c14] border-b border-white/6 px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/20 text-[12px]">
                        <span>{nodes.length} nodes</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={saveWorkflow}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-white/4 hover:bg-white/8 border border-white/6 rounded-xl text-white/60 transition-all disabled:opacity-40 text-[12px]"
                        >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save
                        </button>
                        <button
                            onClick={executeWorkflow}
                            disabled={executing || nodes.length === 0}
                            className="flex items-center gap-2 px-5 py-2 bg-blue-400/90 hover:bg-blue-400 rounded-xl text-white text-[12px] font-medium transition-all disabled:opacity-40 hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]"
                        >
                            {executing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                            {executing ? "Running..." : "Execute"}
                        </button>
                    </div>
                </div>

                {/* ReactFlow */}
                <div className="flex-1">
                    {nodes.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-blue-400/8 flex items-center justify-center mx-auto mb-5 border border-blue-400/15">
                                    <Sparkles className="w-7 h-7 text-blue-300/50" />
                                </div>
                                <h3 className="font-ed text-lg text-white/70 mb-1.5">Start Building</h3>
                                <p className="text-white/25 text-[13px] max-w-xs">
                                    Add your first node from the sidebar to start building your automation workflow
                                </p>
                            </div>
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
                            className="bg-[#08080c]"
                            defaultEdgeOptions={{
                                type: "animated",
                                style: { stroke: "#ffffff15", strokeWidth: 2 },
                            }}
                            connectionLineStyle={{ stroke: "#60a5fa", strokeWidth: 2 }}
                        >
                            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#ffffff08" />
                            <Controls className="bg-[#0c0c14]! border-white/6! rounded-xl!" />
                            <MiniMap
                                className="bg-[#0c0c14]! border-white/6! rounded-xl!"
                                nodeColor={(node) => {
                                    const c: Record<string, string> = {
                                        trigger: "#60a5fa",
                                        webhook: "#8b5cf6",
                                        telegram: "#0ea5e9",
                                        gmail: "#ef4444",
                                        awaitGmail: "#f97316",
                                        aiagent: "#a855f7",
                                    };
                                    return c[node.type || ""] || "#444";
                                }}
                            />
                        </ReactFlow>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Provider Wrapper ─── */
export default function WorkflowClient({ workflowId }: WorkflowClientProps) {
    return (
        <ReactFlowProvider>
            <WorkflowEditorInner workflowId={workflowId} />
        </ReactFlowProvider>
    );
}
