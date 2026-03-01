import { TriggerNode } from "./TriggerNode";
import { WebhookNode } from "./WebhookNode";
import { TelegramNode } from "./TelegramNode";
import { GmailNode } from "./GmailNode";
import { AwaitGmailNode } from "./AwaitGmailNode";
import { AIAgentNode } from "./AIAgentNode";
import { AnimatedEdge } from "./AnimatedEdge";

export const nodeTypes = {
    trigger: TriggerNode,
    webhook: WebhookNode, // Used for both trigger and action
    telegram: TelegramNode,
    gmail: GmailNode,
    awaitGmail: AwaitGmailNode,
    aiagent: AIAgentNode,
};

export const edgeTypes = {
    animated: AnimatedEdge,
};
