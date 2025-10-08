import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface NodeConfigModalProps {
  isOpen: boolean;
  nodeType: string;
  nodeData: any;
  nodeId : string | number | null;
  onClose: () => void;
  onSave: (data: any) => void;
  previousNodes?: any[];
}

const NodeConfigModal = ({ isOpen, nodeType, nodeData,  nodeId , onClose, onSave, previousNodes }: NodeConfigModalProps) => {
  const [formData, setFormData] = useState(nodeData || {});
  const [credentials, setCredentials] = useState<any[]>([]);

  // Fetch credentials
  useEffect(() => {
    async function fetchCredentials() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3002/api/v1/credentials', {
          headers: { authorization: token },
        });
        //@ts-ignore
        setCredentials(res.data);
      } catch (err) {
        console.error("Error fetching credentials:", err);
      }
    }
    fetchCredentials();
  }, []);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const renderCredentialOptions = () => {
    return (
      <>
        <option value="">Select Account</option>
        {credentials
          .filter(c => {
            if (nodeType === 'gmail' || nodeType === 'awaitGmail') return c.platform === 'gmail';
            if (nodeType === 'teligram') return c.platform === 'teligram';
            return true;
          })
          .map(c => (
            <option key={c.id} value={c.id}>
              {c.type} - {c.title || c.name || c.label}
            </option>
          ))}
        {previousNodes && previousNodes.length > 0 && (
          <optgroup label="From Previous Nodes">
            {previousNodes.map(node => (
              <option key={node.id} value={`prevNode:${node.id}`}>
                {node.label || node.type} ({node.id})
              </option>
            ))}
          </optgroup>
        )}
      </>
    );
  };

  const renderForm = () => {
    switch (nodeType) {
      case 'gmail':
        return (
          <div className="space-y-4 scrollbar-hide text-[hsl(var(--foreground))]">
            <div>
              <label className="block text-sm font-medium mb-2">Credentials</label>
              <select
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
                value={formData.credentialsId || ''}
                onChange={e => {
                  const selectedId = e.target.value;
                  const selectedCred = credentials.find(c => c.id === selectedId);
                  setFormData({ ...formData, credentialsId: selectedId, credentialsLabel: selectedCred?.platform || "" });
                }}
              >
                {renderCredentialOptions()}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">From</label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
                value={formData.from || ''}
                onChange={e => setFormData({ ...formData, from: e.target.value })}
                placeholder="sender@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">To</label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
                value={formData.to || ''}
                onChange={e => setFormData({ ...formData, to: e.target.value })}
                placeholder="recipient@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
                value={formData.subject || ''}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Body</label>
              <textarea
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg h-24"
                value={formData.message || ''}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Email content..."
              />
            </div>
          </div>
        );

      case 'awaitGmail':
        
      // Ensure node ID exists
      if (!formData.id) setFormData({ ...formData, id: crypto.randomUUID() });
      const webhookUrl = `http://localhost:3002/webhook/${nodeId}?workflowId=${formData.workflowId || ""}`;

      return (
        <div className="space-y-4  text-[hsl(var(--foreground))]">
          <div>
            <label className="block text-sm font-medium mb-2">Webhook URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
                readOnly
                value={webhookUrl}
              />
          
              <button
                className="px-3 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--foreground))] rounded-lg hover:bg-[hsl(var(--primary-hover))]"
                onClick={() => navigator.clipboard.writeText(webhookUrl)}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Credentials */}
          <div>
            <label className="block text-sm font-medium mb-2">Credentials</label>
            <select
              className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
              value={formData.credentialsId || ''}
              onChange={e => {
                const selectedId = e.target.value;
                const selectedCred = credentials.find(c => c.id === selectedId);
                setFormData({ ...formData, credentialsId: selectedId, credentialsLabel: selectedCred?.platform || "" });
              }}
            >
              {renderCredentialOptions()}
            </select>
          </div>

          {/* From */}
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
              value={formData.from || ''}
              onChange={e => setFormData({ ...formData, from: e.target.value })}
              placeholder="sender@gmail.com"
            />
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
              value={formData.to || ''}
              onChange={e => setFormData({ ...formData, to: e.target.value })}
              placeholder="recipient@email.com"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
              value={formData.subject || ''}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Email subject"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium mb-2">Body</label>
            <textarea
              className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg h-24"
              value={formData.message || ''}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              placeholder="Email content..."
            />
          </div>

          {/* Webhook */}
          
        </div>
      );


      case 'teligram':
        return (
          <div className="space-y-4 scrollbar-y-auto max-h-[60vh] text-[hsl(var(--foreground))]">
            {/* Credentials */}
            <div>
              <label className="block text-sm font-medium mb-2">Credentials</label>
              <select
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
                value={formData.credentialsId || ''}
                onChange={e => {
                  const selectedId = e.target.value;
                  const selectedCred = credentials.find(c => c.id === selectedId);
                  setFormData({
                    ...formData,
                    credentialsId: selectedId,
                    credentialsLabel: selectedCred?.platform || ""
                  });
                }}
              >
                <option value="">Select Credential</option>
                {credentials
                  .filter(c => c.platform === 'teligram')
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.type} - {c.title || c.name || c.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* Use previous node response */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.previousResponse || false}
                onChange={e => setFormData({ ...formData, previousResponse: e.target.checked })}
                id="prevResponse"
              />
              <label htmlFor="prevResponse" className="text-sm font-medium">
                Use Response from Previous Node
              </label>
            </div>

            {/* Select previous node */}
            {formData.previousResponse && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Previous Node</label>
                <select
                  className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
                  value={formData.previousResponseFromWhichNode || ''}
                  onChange={e => setFormData({ ...formData, previousResponseFromWhichNode: e.target.value })}
                >
                  <option value="">Select from previous nodes</option>
                  {previousNodes?.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.data.label || node.type} ({node.id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message (always available, can combine with prev response) */}
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg h-24"
                placeholder="Message to send..."
                value={formData.message || ''}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />
              <p className="text-xs text-[hsl(var(--foreground-muted))] mt-1">
                If both message and previous node response are selected, both will be combined.
              </p>
            </div>
          </div>
        );

      case 'agent':
        return (
          <div className="space-y-4 scrollbar-y-auto max-h-[60vh] text-[hsl(var(--foreground))]">
            {/* Select LLM Model */}
            <div>
              <label className="block text-sm font-medium mb-2">LLM Model</label>
              <select
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
                value={formData.model || 'gemini'}
                onChange={e => setFormData({ ...formData, model: e.target.value })}
              >
                <option value="gemini">Gemini (Google Generative AI)</option>
              </select>
            </div>

            {/* Checkbox for previous node response */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.previousResponse || false}
                onChange={e => setFormData({ ...formData, previousResponse: e.target.checked })}
                id="usePrevResponse"
              />
              <label htmlFor="usePrevResponse" className="text-sm font-medium">
                Use Response from Previous Node
              </label>
            </div>

            {/* Select or input for previous node */}
            {/* {formData.previousResponse && (
              <div>
                <label className="block text-sm font-medium mb-2">Previous Node ID</label>
                <select
                  className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
                  value={formData.previousResponseFromWhichNode || ''}
                  onChange={e => setFormData({ ...formData, previousResponseFromWhichNode: e.target.value })}
                >
                  <option value="">Select from previous nodes</option>
                  {previousNodes?.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.data.label || node.type} ({node.id})
                    </option>
                  ))}
                </select>
              </div>
            )} */}
                        {formData.previousResponse && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Previous Node</label>
                <select
                  className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg"
                  value={formData.previousResponseFromWhichNode || ''}
                  onChange={e => setFormData({ ...formData, previousResponseFromWhichNode: e.target.value })}
                >
                  <option value="">Select from previous nodes</option>
                  {previousNodes?.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.data.label || node.type} ({node.id})
                    </option>
                  ))}
                </select>
              </div>
            )}


            {/* Prompt message */}
            <div>
              <label className="block text-sm font-medium mb-2">Prompt Message</label>
              <textarea
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg h-24"
                placeholder="Enter your AI prompt..."
                value={formData.message || ''}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />
              <p className="text-xs text-[hsl(var(--foreground-muted))] mt-1">
                If both message and previous node response are provided, both will be combined before sending to AI.
              </p>
            </div>
          </div>
        );

      default:
        return <p className="text-[hsl(var(--foreground-muted))] text-center py-8">No configuration available.</p>;
    }
  };

  const getModalTitle = () => {
    switch (nodeType) {
      case 'gmail': return 'Configure Gmail';
      case 'awaitGmail': return 'Configure Await Gmail';
      case 'teligram': return 'Configure Teligram';
      default: return 'Configure Node';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-[9999]"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-[500px] max-h-[100vh] bg-[hsl(var(--background-tertiary))] border border-[hsl(var(--border))] rounded-xl shadow-2xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[hsl(var(--border))] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">{getModalTitle()}</h2>
              <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--surface-elevated))] rounded-lg transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto min-h-0">{renderForm()}</div>

            <div className="p-6 border-t border-[hsl(var(--border))] flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-elevated))] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-[hsl(var(--foreground))] rounded-lg font-medium transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NodeConfigModal;
