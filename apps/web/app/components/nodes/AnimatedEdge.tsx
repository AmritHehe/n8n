"use client";
import { getBezierPath, type EdgeProps } from "@xyflow/react";

export function AnimatedEdge({
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
