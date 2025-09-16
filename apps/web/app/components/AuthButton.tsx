"use client"
interface AuthButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
}

export const AuthButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  variant = "primary"
}: AuthButtonProps) => {
  const isPrimary = variant === "primary";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full py-3 px-6 rounded-xl font-semibold text-center relative overflow-hidden
        transition-all duration-300 ease-out
        hover:scale-[1.01] active:scale-[0.99]
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${isPrimary 
          ? `text-white shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-strong)]
             focus:ring-primary/50 group` 
          : `bg-surface-elevated/50 border-2 border-border text-foreground backdrop-blur-sm
             hover:bg-surface-elevated hover:border-border-hover
             focus:ring-primary/30`
        }
      `}
      style={isPrimary ? { background: 'var(--gradient-primary)' } : {}}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

