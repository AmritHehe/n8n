"use client"
interface CredentialInputProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const CredentialInput = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required 
}: CredentialInputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[hsl(var(--foreground-muted))]">
        {label} {required && <span className="text-[hsl(var(--error))]">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="
          w-full px-4 py-3 
          bg-[hsl(var(--input))] 
          border border-[hsl(var(--input-border))] 
          rounded-[var(--radius)] 
          text-[hsl(var(--foreground))] 
          placeholder:text-[hsl(var(--foreground-dim))] 
          focus:outline-none 
          focus:border-[hsl(var(--primary))] 
          focus:ring-1 focus:ring-[hsl(var(--primary)/0.3)] 
          transition-[var(--transition-smooth)]
        "
      />
    </div>
  );
};

export default CredentialInput;
