"use client"
import { useState } from "react";
import { AuthCard } from "../../components/auth";
import { useRouter } from "next/navigation";    
import { AuthButton } from "../../components/AuthButton";
import {FormInput} from "../../components/FormInput"
import Link from "next/link";
import axios from "axios";
import api from "../../apiClient";

export default function  SignUp () {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    confirmPassword?: string 
  }>({});
  const [loading, setLoading] = useState(false);
//   const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { 
      email?: string; 
      password?: string; 
      confirmPassword?: string 
    } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const res = await api.post("/api/v1/signup", { 
        name: email, 
        pass: password
      });

      console.log("response"+ res);

      router.push("/signin");  

    } catch (err) {
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Create your account" 
      subtitle="Join thousands of users automating their workflows"
    >
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp();
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
          placeholder="Create a password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          required
        />
        
        <FormInput
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
          required
        />
        
        <div className="text-sm">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              required
              className="w-4 h-4 mt-0.5 rounded border-input-border bg-input focus:ring-2 focus:ring-primary/20 text-primary transition-colors"
            />
            <span className="text-foreground-secondary leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-primary hover:text-primary-hover transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:text-primary-hover transition-colors">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>
        
        <AuthButton onClick={handleSignUp} loading={loading}>
          Create Account
        </AuthButton>
        
        <div className="text-center">
          <span className="text-foreground-secondary">Already have an account? </span>
          <Link 
            href="/signin" 
            className="text-primary hover:text-primary-hover transition-colors font-medium"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

