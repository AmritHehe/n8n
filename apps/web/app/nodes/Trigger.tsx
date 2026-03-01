import { Handle, Position } from "@xyflow/react";

export function Trigger() {
  return (
    <div className="bg-[#0c0c14] border border-emerald-500/30 rounded-xl px-5 py-3.5 flex items-center gap-2.5 shadow-lg shadow-emerald-500/5 hover:border-emerald-500/50 transition-all">
      <div className="w-7 h-7 bg-emerald-500/15 rounded-lg flex items-center justify-center">
        <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M13.2319 2.28681C13.5409 2.38727 13.75 2.6752 13.75 3.00005V9.25005H19C19.2821 9.25005 19.5403 9.40834 19.6683 9.65972C19.7963 9.9111 19.7725 10.213 19.6066 10.4412L11.6066 21.4412C11.4155 21.7039 11.077 21.8137 10.7681 21.7133C10.4591 21.6128 10.25 21.3249 10.25 21.0001V14.7501H5C4.71791 14.7501 4.45967 14.5918 4.33167 14.3404C4.20366 14.089 4.22753 13.7871 4.39345 13.5589L12.3935 2.55892C12.5845 2.2962 12.923 2.18635 13.2319 2.28681Z" />
        </svg>
      </div>
      <span className="text-[13px] font-medium text-white/70">Trigger</span>
      <Handle type="source" position={Position.Right} className="bg-emerald-400! w-3! h-3! border-0!" />
    </div>
  );
}