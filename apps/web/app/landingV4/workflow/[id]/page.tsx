import WorkflowClient from "./workflowClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function WorkflowPage({ params }: PageProps) {
    const { id } = await params;
    return <WorkflowClient workflowId={id} />;
}
