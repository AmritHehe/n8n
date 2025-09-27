"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { redirect } from 'next/navigation';
const Workflows = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkflowTitle, setNewWorkflowTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [token , setToken ] = useState<string>()
  useEffect(() => {
    fetchWorkflows();
    getToken();
  }, []);

  function getToken(){ 
      const tokennn = localStorage.getItem("token")
      if(!tokennn) { 
        redirect('/signin')
      }
     
      setToken(tokennn)
      // console.log("token " + tokennn )
    }
  const fetchWorkflows = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3002/workflow' , { 
        headers : { 
          authorization : token 
        }
      });
      const data = response.data;
      console.log("incoming data " + JSON.stringify(data))
      setWorkflows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
      setWorkflows([]);
    }
  };

  const deleteWorkflow = async (id: number  , title : string) => {
    setLoading(true);
    console.log("token")
    try {
      await axios.delete("http://localhost:3002/workflow",{ 
        headers : { 
          authorization : token

        }, 
        data : { 
          id : id
        }
      } as any );
      setMessage(`workflow ${title}  deleted successfully!`);
      fetchWorkflows();
    } catch (error) {
      setMessage(`Failed to delete credential with id : ${title} `);
      console.error(error);
    }
    setLoading(false);
  };
  const createWorkflow = async () => {
    // const token = localStorage.getItem('token');
    if (!newWorkflowTitle.trim()) {
      setMessage('Please enter a workflow title');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3002/workflow', {
        title: newWorkflowTitle,
        nodes: [],
        connections: []
      } , { 
        headers : { 
          authorization : token
        }
      });
      setMessage('Workflow created successfully!');
      setNewWorkflowTitle('');
      setShowCreateForm(false);
      fetchWorkflows();
    } catch (error) {
      setMessage('Failed to create workflow');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen p-8 relative overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--primary))]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-[hsl(var(--secondary))]/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-2">Workflows</h1>
            <p className="text-[hsl(var(--foreground-muted))]">Manage your automation workflows</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-6 py-2 bg-[hsl(var(--surface-elevated))]/50 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-[var(--radius)] hover:bg-[hsl(var(--surface-elevated))] hover:border-[hsl(var(--border-hover))] transition-[var(--transition-smooth)]"
            >
              ← Back to Home
            </Link>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--foreground))] rounded-[var(--radius)] hover:bg-[hsl(var(--primary-hover))] transition-[var(--transition-smooth)]"
            >
              + Create Workflow
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-[var(--radius)] ${
              message.includes('successfully')
                ? 'bg-[hsl(var(--success))]/20 border border-[hsl(var(--success))]/40 text-[hsl(var(--success))]'
                : 'bg-[hsl(var(--error))]/20 border border-[hsl(var(--error))]/40 text-[hsl(var(--error))]'
            }`}
          >
            {message}
          </div>
        )}

        {/* Create Workflow Form */}
        {showCreateForm && (
          <div className="mb-8 bg-[hsl(var(--surface))]/60 backdrop-blur-xl border border-[hsl(var(--border))] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-4">Create New Workflow</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter workflow title"
                value={newWorkflowTitle}
                onChange={(e) => setNewWorkflowTitle(e.target.value)}
                className="flex-1 px-4 py-3 bg-[hsl(var(--input-background))] border border-[hsl(var(--input-border))] rounded-[var(--radius)] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground-dim))] focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]/30 transition-[var(--transition-smooth)]"
              />
              <button
                onClick={createWorkflow}
                disabled={loading}
                className="px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--foreground))] rounded-[var(--radius)] hover:bg-[hsl(var(--primary-hover))] disabled:opacity-50 transition-[var(--transition-smooth)]"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewWorkflowTitle('');
                }}
                className="px-6 py-3 bg-[hsl(var(--surface-elevated))]/50 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-[var(--radius)] hover:bg-[hsl(var(--surface-elevated))] hover:border-[hsl(var(--border-hover))] transition-[var(--transition-smooth)]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Workflows Grid */}
        {Array.isArray(workflows) && workflows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-[hsl(var(--surface))]/60 backdrop-blur-xl border border-[hsl(var(--border))] rounded-2xl p-6 hover:border-[hsl(var(--primary))]/50 hover:scale-105 transition-[var(--transition-slow)] group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-[var(--radius)] flex items-center justify-center group-hover:bg-[hsl(var(--primary))]/30 transition-[var(--transition-smooth)]">
                    <svg
                      className="w-6 h-6 text-[hsl(var(--primary))]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <Link 
                    key={workflow.id}
                    href={`/workflow/${workflow.id}`}
                  >
                    <div className="flex-1">
          
                      <h3 className="font-semibold text-lg text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                        {workflow.title || 'Untitled Workflow'}
                      </h3>

                      <p className="text-sm text-[hsl(var(--foreground-muted))]">
                        {(JSON.parse(workflow.nodes)).length|| 0} nodes
                      </p>
                    
                    </div>
                    </Link>
                  <button
                      onClick={() => deleteWorkflow(workflow.id , workflow.title)}
                      // disabled={loading === true}
                      className="px-4 py-2 bg-[hsl(var(--error)/0.2)] text-[hsl(var(--error))] border border-[hsl(var(--error)/0.4)] rounded-[var(--radius)] hover:bg-[hsl(var(--error)/0.3)] transition-[var(--transition-smooth)]"
                    >
                      Delete
                    </button>
                </div>
                <div className="text-xs text-[hsl(var(--foreground-dim))]">
                  Created: {new Date(workflow.createdAt).toLocaleDateString()}
                </div>
              
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">No workflows yet</h3>
            <p className="text-[hsl(var(--foreground-muted))] mb-6">Create your first automation workflow to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--foreground))] rounded-[var(--radius)] hover:bg-[hsl(var(--primary-hover))] transition-[var(--transition-smooth)]"
            >
              Create Your First Workflow
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workflows;
