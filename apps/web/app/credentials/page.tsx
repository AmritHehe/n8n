"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios, { get } from "axios";
import CredentialInput from "../components/CredentialInput";
import CredentialCard from "../components/CredentialCard";
import { redirect } from "next/navigation";
import jwt from 'jsonwebtoken';
import api from "../apiClient";

const Credentials = () => {
  const [existingCredentials, setExistingCredentials] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState<string | null>(null);

  const [telegramData, setTelegramData] = useState({ token: "", chatId: "" });
  const [smtpData, setSmtpData] = useState({  HOST: "", PORT: "", username: "", password: "" });
  const [token , setToken ] = useState<string>()
  const [loading, setLoading] = useState<string | null |number>(null);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    getToken()
    fetchCredentials();
  }, []);
  function getToken(){ 
    const token = localStorage.getItem('token')!
    if(!token) { 
      redirect('/signin')
    }
   
    setToken(token)
    // console.log("token " + token )
  }
  const fetchCredentials = async () => {
    // const token = localStorage.getItem('token')
    // console.log("token inside fetch credentials " + token )
    try {
      const response = await api.get("/api/v1/credentials");
      const data = response.data;
      console.log("data : + " + JSON.stringify(data))
      setExistingCredentials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch credentials:", error);
      setExistingCredentials([]);
    }
  };

  const saveTelegramCredential = async () => {
    if (!telegramData.token || !telegramData.chatId) {
      setMessage("Please fill all Telegram fields");
      return;
    }
    setLoading("telegram");
    try {
      const res = await api.post("/api/v1/credentials", { title: "Telegram Send Message", platform: "teligram", data: telegramData });
      setMessage("Telegram credentials saved successfully!");
      setTelegramData({ token: "", chatId: ""  });
      setShowCreateForm(null);
      fetchCredentials();
    } catch (error) {
      setMessage("Failed to save Telegram credentials");
      console.error(error);
    }
    setLoading(null);
  };

  const saveSMTPCredential = async () => {
    if (!smtpData.HOST || !smtpData.PORT || !smtpData.username || !smtpData.password) {
      setMessage("Please fill all SMTP fields");
      return;
    }
    setLoading("smtp");
    try {
      await api.post("/api/v1/credentials", { title: "SMTP Account", platform: "smtp", data: smtpData });
      setMessage("SMTP credentials saved successfully!");
      setSmtpData({ HOST: "", PORT: "", username: "", password: "" });
      setShowCreateForm(null);
      fetchCredentials();
    } catch (error) {
      setMessage("Failed to save SMTP credentials");
      console.error(error);
    }
    setLoading(null);
  };

  const deleteCredential = async (id: number , platform : string) => {
    setLoading(id);
    console.log("token")
    try {
      await api.delete("/api/v1/credentials",{ 
 
        data : { 
          id : id
        }
      } as any );
      setMessage(` ${platform} credential with ${id}  deleted successfully!`);
      fetchCredentials();
    } catch (error) {
      setMessage(`Failed to delete ${platform} credential with id : ${id} `);
      console.error(error);
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--primary)/0.3)] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-[hsl(var(--secondary)/0.25)] rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Credentials</h1>
            <p className="text-[hsl(var(--foreground-muted))]">Manage your integration credentials securely</p>
          </div>
          <Link
            href="/"
            className="px-6 py-2 bg-[hsl(var(--surface-elevated)/0.5)] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-[var(--radius)] hover:bg-[hsl(var(--surface-elevated))] hover:border-[hsl(var(--border-hover))] transition-[var(--transition-smooth)]"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-[var(--radius)] ${
              message.includes("successfully")
                ? "bg-[hsl(var(--success)/0.2)] border border-[hsl(var(--success)/0.4)] text-[hsl(var(--success))]"
                : "bg-[hsl(var(--error)/0.2)] border border-[hsl(var(--error)/0.4)] text-[hsl(var(--error))]"
            }`}
          >
            {message}
          </div>
        )}

        {/* Existing Credentials */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Credentials</h2>
          {existingCredentials.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {existingCredentials.map((cred, idx) => (
                <div key={idx} className="bg-[hsl(var(--surface)/0.6)] backdrop-blur-xl border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-lg">{cred.id}</h4>
                      <div className="w-12 h-12 bg-[hsl(var(--primary)/0.2)] rounded-[var(--radius)] flex items-center justify-center">
                        {cred.platform === "teligram" ? (
                          <svg className="w-6 h-6 text-[hsl(var(--primary))]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.820 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{cred.title}</h3>
                        <p className="text-sm capitalize">{cred.platform}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCredential(cred.id , cred.platform )}
                      disabled={loading === cred.platform}
                      className="px-4 py-2 bg-[hsl(var(--error)/0.2)] text-[hsl(var(--error))] border border-[hsl(var(--error)/0.4)] rounded-[var(--radius)] hover:bg-[hsl(var(--error)/0.3)] transition-[var(--transition-smooth)]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-[hsl(var(--foreground-muted))]">No credentials found. Create your first credential below.</p>
          )}
        </div>

        {/* Create New Credential */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Add New Credential</h2>
            {showCreateForm && (
              <button
                onClick={() => setShowCreateForm(null)}
                className="px-4 py-2 bg-[hsl(var(--surface-elevated)/0.5)] border border-[hsl(var(--border))] rounded-[var(--radius)] hover:bg-[hsl(var(--surface-elevated))] transition-[var(--transition-smooth)]"
              >
                Cancel
              </button>
            )}
          </div>

          {!showCreateForm ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowCreateForm("telegram")}
                className="p-6 bg-[hsl(var(--surface)/0.6)] backdrop-blur-xl border border-[hsl(var(--border))] rounded-[var(--radius-lg)] hover:border-[hsl(var(--primary)/0.5)] transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[hsl(var(--primary)/0.2)] rounded-[var(--radius)] flex items-center justify-center">📩</div>
                  <div>
                    <h3 className="font-semibold text-lg">Telegram Bot</h3>
                    <p className="text-sm text-[hsl(var(--foreground-muted))]">Send messages via Telegram Bot</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setShowCreateForm("smtp")}
                className="p-6 bg-[hsl(var(--surface)/0.6)] backdrop-blur-xl border border-[hsl(var(--border))] rounded-[var(--radius-lg)] hover:border-[hsl(var(--primary)/0.5)] transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[hsl(var(--primary)/0.2)] rounded-[var(--radius)] flex items-center justify-center">📧</div>
                  <div>
                    <h3 className="font-semibold text-lg">SMTP Account</h3>
                    <p className="text-sm text-[hsl(var(--foreground-muted))]">Send emails via SMTP</p>
                  </div>
                </div>
              </button>
            </div>
          ) : showCreateForm === "telegram" ? (
            <CredentialCard title="Telegram Bot" description="Send messages via Telegram Bot" icon={<span>📩</span>}>
              <div className="space-y-4">
                <CredentialInput
                  label="Bot Token"
                  type="password"
                  placeholder="Enter your bot token"
                  value={telegramData.token}
                  onChange={(value) => setTelegramData((prev) => ({ ...prev, token: value }))}
                  required
                />
                <CredentialInput
                  label="Chat ID"
                  placeholder="Enter chat ID"
                  value={telegramData.chatId}
                  onChange={(value) => setTelegramData((prev) => ({ ...prev, chatId: value }))}
                  required
                />
                <button
                  onClick={saveTelegramCredential}
                  disabled={loading === "telegram"}
                  className="w-full px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 transition-all duration-200"
                >
                  {loading === "telegram" ? "Saving..." : "Save Telegram Credential"}
                </button>
              </div>
            </CredentialCard>
          ) : (
            <CredentialCard title="SMTP Account" description="Send emails via SMTP" icon={<span>📧</span>}>
              <div className="space-y-4">
                <CredentialInput
                  label="SMTP Host"
                  placeholder="smtp.gmail.com"
                  value={smtpData.HOST}
                  onChange={(value) => setSmtpData((prev) => ({ ...prev, HOST: value }))}
                  required
                />
                <CredentialInput
                  label="Port"
                  type="number"
                  placeholder="587"
                  value={smtpData.PORT}
                  onChange={(value) => setSmtpData((prev) => ({ ...prev, PORT: value }))}
                  required
                />
                <CredentialInput
                  label="Username"
                  placeholder="your-email@gmail.com"
                  value={smtpData.username}
                  onChange={(value) => setSmtpData((prev) => ({ ...prev, username: value }))}
                  required
                />
                <CredentialInput
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={smtpData.password}
                  onChange={(value) => setSmtpData((prev) => ({ ...prev, password: value }))}
                  required
                />
                <button
                  onClick={saveSMTPCredential}
                  disabled={loading === "smtp"}
                  className="w-full px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 transition-all duration-200"
                >
                  {loading === "smtp" ? "Saving..." : "Save SMTP Credential"}
                </button>
              </div>
            </CredentialCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Credentials;
