import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function LandingV3WorkflowEditor({ params }: PageProps) {
    const { id } = await params;
    redirect(`/workflow/${id}`);
}
