"use client"
import { ReactNode } from 'react';

interface CredentialCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

const CredentialCard = ({ title, description, icon, children }: CredentialCardProps) => {
  return (
    <div className="
      bg-[hsl(var(--surface)/0.6)] 
      backdrop-blur-xl 
      border border-[hsl(var(--border))] 
      rounded-[var(--radius)] 
      p-6 
      hover:border-[hsl(var(--border-hover))] 
      transition-[var(--transition-smooth)]
    ">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-[hsl(var(--primary)/0.2)] rounded-[var(--radius)] flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-[hsl(var(--foreground))]">{title}</h3>
          <p className="text-sm text-[hsl(var(--foreground-muted))]">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default CredentialCard;
