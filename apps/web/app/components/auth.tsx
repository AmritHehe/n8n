"useClient"
interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthCard = ({ children, title, subtitle }: AuthCardProps) => {
  return (
    <div 
      className="min-h-screen text-zinc-500 flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="w-full max-w-sm relative z-10">
        <div className="bg-surface/80 backdrop-blur-xl rounded-2xl shadow-[var(--shadow-strong)] border border-border/30 p-6 relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl"></div>
          
          <div className="relative">
            <div className="text-center mb-6">
              <div 
                className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center relative overflow-hidden"
                style={{ background: 'var(--gradient-primary)' }}
              >
                {/* n8n-style workflow icon */}
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>
              <h1 className="text-2xl  text-amber-50 font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text">{title}</h1>
              <p className="text-foreground-muted">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

