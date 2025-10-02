import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface NodeConfigModalProps {
  isOpen: boolean;
  nodeType: string;
  nodeData: any;
  onClose: () => void;
  onSave: (data: any) => void;
  previousNodes?: any[]; // to allow picking from previous nodes
}

const NodeConfigModal = ({ isOpen, nodeType, nodeData, onClose, onSave, previousNodes }: NodeConfigModalProps) => {
  const [formData, setFormData] = useState(nodeData || {});
  const [credentials, setCredentials] = useState<any[]>([]);

  // Fetch credentials from API
  useEffect(() => {
    async function fetchCredentials() {
      try {
        const token = localStorage.getItem('token')

        const res  = await axios.get('http://localhost:3002/api/v1/credentials', { 
            headers : { 
                authorization : token
            }
        });
        console.log("response " + JSON.stringify(res))
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
        {credentials.map((cred) => (
          <option key={cred.id} value={cred.id}>
            {cred.type} - {cred.title || cred.name || cred.label}
          </option>
        ))}
        {previousNodes && previousNodes.length > 0 && (
          <optgroup label="From Previous Nodes">
            {previousNodes.map((node) => (
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
      case 'awaitGmail':
        return (
          <div className="space-y-4 scrollbar-hide">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Credentials
              </label>
               <select
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
                value={formData.credentialsId || ''}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedCred = credentials.find((c) => c.id === selectedId);
                  setFormData({
                    ...formData,
                    credentialsId: selectedId,
                    credentialsLabel: selectedCred ? selectedCred.platform : "",
                  });
                }}
              >
                <option value="">Select Account</option>
                {renderCredentialOptions()}
              </select>
            </div>

            {nodeType === 'gmail' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">From</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
                    value={formData.from || ''}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="sender@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">To</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
                    value={formData.to || ''}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="recipient@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
                    value={formData.subject || ''}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Body</label>
                  <textarea
                    className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] h-24"
                    value={formData.message || ''}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Email content..."
                  />
                </div>
              </>
            )}

            {nodeType === 'awaitGmail' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">From Filter</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
                    value={formData.fromFilter || ''}
                    onChange={(e) => setFormData({ ...formData, fromFilter: e.target.value })}
                    placeholder="sender@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Subject Contains</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
                    value={formData.subjectFilter || ''}
                    onChange={(e) => setFormData({ ...formData, subjectFilter: e.target.value })}
                    placeholder="Keywords to match"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'telegram':
        return (
          <div className="space-y-4 scrollbar-hide">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Credentials</label>
              <select
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
                value={formData.credentials || ''}
                onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
              >
                {renderCredentialOptions()}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Chat ID</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
                value={formData.chatId || ''}
                onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                placeholder="@username or chat ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Message</label>
              <textarea
                className="w-full px-3 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] h-24"
                value={formData.message || ''}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Message to send..."
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-[hsl(var(--foreground-muted))]">No configuration available for this node type.</p>
          </div>
        );
    }
  };

  const getModalTitle = () => {
    switch (nodeType) {
      case 'gmail': return 'Configure Gmail';
      case 'telegram': return 'Configure Telegram';
      case 'aiagent': return 'Configure AI Agent';
      case 'webhook': return 'Configure Webhook';
      case 'awaitGmail': return 'Configure Await Gmail';
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
            className="relative w-[500px] max-h-[80vh] bg-[hsl(var(--background-tertiary))] border border-[hsl(var(--border))] rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[hsl(var(--border))] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">{getModalTitle()}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[hsl(var(--surface-elevated))] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-[hsl(var(--foreground-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto min-h-0">{renderForm()}</div>

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
