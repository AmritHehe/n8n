"use client"
import { useState } from "react";
import { AuthCard } from "../../components/auth";
import { useRouter } from "next/navigation";
import { AuthButton } from "../../components/AuthButton";
import {FormInput} from "../../components/FormInput"
import Link from "next/link";
import axios from "axios";
// import FormInput from "@/components/FormInput";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
//   const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
     setLoading(true);
    
    try {
      const res = await axios.post("http://localhost:3002/api/v1/signin", { 
        name: email, 
        pass: password
      });

      console.log("response"+ res);
      //@ts-ignore
      const token = res.data.token ;
      localStorage.setItem("token" , token)
      router.push("/");   

    } catch (err) {
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome back" 
      subtitle="Sign in to your n8n account to continue"
    >
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSignIn();
        }}
        className="space-y-6"
      >
        <FormInput
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          required
        />
        
        <FormInput
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          required
        />
        
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-input-border bg-input focus:ring-2 focus:ring-primary/20 text-primary transition-colors"
            />
            <span className="text-foreground-secondary">Remember me</span>
          </label>
          <a href="#" className="text-primary hover:text-primary-hover transition-colors font-medium">
            Forgot password?
          </a>
        </div>
        
        <AuthButton onClick={handleSignIn} loading={loading}>
          Sign In
        </AuthButton>
        
        <div className="text-center">
          <span className="text-foreground-secondary">Don't have an account? </span>
          <Link 
            href="/signup" 
            className="text-primary hover:text-primary-hover transition-colors font-medium"
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};
