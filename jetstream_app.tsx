import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Clock, CheckCircle, XCircle, FileText, 
  Table, Mail, Archive, Settings, BarChart3, Zap, 
  Plus, Trash2, Edit, Download, AlertCircle, TrendingUp
} from 'lucide-react';

const JetStream = () => {
  const [workflows, setWorkflows] = useState([]);
  const [logs, setLogs] = useState([]);
  const [view, setView] = useState('dashboard');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    type: 'word-to-pdf',
    schedule: 'manual',
    enabled: true
  });

  const workflowTypes = [
    { 
      id: 'word-to-pdf', 
      name: 'Word to PDF Converter', 
      icon: FileText,
      description: 'Automatically convert Word documents to PDF format',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'excel-merge', 
      name: 'Excel Report Merger', 
      icon: Table,
      description: 'Combine multiple Excel files into consolidated reports',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'email-summary', 
      name: 'Email Summary Generator', 
      icon: Mail,
      description: 'Generate and send automated summary emails',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'archive-attachments', 
      name: 'Attachment Archiver', 
      icon: Archive,
      description: 'Automatically archive and organize email attachments',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const scheduleOptions = [
    { value: 'manual', label: 'Manual Trigger' },
    { value: 'hourly', label: 'Every Hour' },
    { value: 'daily', label: 'Daily at 9 AM' },
    { value: 'weekly', label: 'Weekly (Monday)' },
    { value: 'monthly', label: 'Monthly (1st)' }
  ];

  useEffect(() => {
    loadWorkflows();
    loadLogs();
  }, []);

  const loadWorkflows = async () => {
    try {
      const result = await window.storage.list('workflow:');
      if (result && result.keys) {
        const loaded = await Promise.all(
          result.keys.map(async (key) => {
            try {
              const data = await window.storage.get(key);
              return data ? JSON.parse(data.value) : null;
            } catch {
              return null;
            }
          })
        );
        setWorkflows(loaded.filter(w => w).sort((a, b) => b.created - a.created));
      }
    } catch (error) {
      console.log('Starting fresh');
      setWorkflows([]);
    }
  };

  const loadLogs = async () => {
    try {
      const result = await window.storage.list('log:');
      if (result && result.keys) {
        const loaded = await Promise.all(
          result.keys.map(async (key) => {
            try {
              const data = await window.storage.get(key);
              return data ? JSON.parse(data.value) : null;
            } catch {
              return null;
            }
          })
        );
        setLogs(loaded.filter(l => l).sort((a, b) => b.timestamp - a.timestamp).slice(0, 100));
      }
    } catch (error) {
      console.log('No logs yet');
      setLogs([]);
    }
  };

  const createWorkflow = async () => {
    if (!newWorkflow.name.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    const workflow = {
      id: Date.now().toString(),
      ...newWorkflow,
      created: Date.now(),
      lastRun: null,
      runCount: 0,
      successCount: 0,
      failureCount: 0,
      status: 'ready'
    };

    try {
      await window.storage.set(`workflow:${workflow.id}`, JSON.stringify(workflow));
      setWorkflows([workflow, ...workflows]);
      setNewWorkflow({ name: '', type: 'word-to-pdf', schedule: 'manual', enabled: true });
      setIsCreating(false);
      addLog('info', `Created workflow: ${workflow.name}`);
    } catch (error) {
      console.error('Failed to create workflow:', error);
      alert('Failed to create workflow');
    }
  };

  const runWorkflow = async (workflow) => {
    const startTime = Date.now();
    
    const updatedWorkflow = {
      ...workflow,
      status: 'running',
      lastRun: startTime
    };
    
    await updateWorkflow(updatedWorkflow);
    addLog('info', `Starting workflow: ${workflow.name}`);

    setTimeout(async () => {
      const success = Math.random() > 0.2;
      const duration = Date.now() - startTime;
      
      const finalWorkflow = {
        ...updatedWorkflow,
        status: success ? 'success' : 'failed',
        runCount: workflow.runCount + 1,
        successCount: workflow.successCount + (success ? 1 : 0),
        failureCount: workflow.failureCount + (success ? 0 : 1)
      };
      
      await updateWorkflow(finalWorkflow);
      
      if (success) {
        addLog('success', `Completed workflow: ${workflow.name} (${duration}ms)`, {
          workflowId: workflow.id,
          duration,
          filesProcessed: Math.floor(Math.random() * 20) + 5
        });
      } else {
        addLog('error', `Failed workflow: ${workflow.name} - Simulated error`, {
          workflowId: workflow.id,
          error: 'Connection timeout'
        });
      }
    }, 2000 + Math.random() * 3000);
  };

  const updateWorkflow = async (workflow) => {
    try {
      await window.storage.set(`workflow:${workflow.id}`, JSON.stringify(workflow));
      setWorkflows(workflows.map(w => w.id === workflow.id ? workflow : w));
    } catch (error) {
      console.error('Failed to update workflow:', error);
    }
  };

  const deleteWorkflow = async (id) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    
    try {
      await window.storage.delete(`workflow:${id}`);
      setWorkflows(workflows.filter(w => w.id !== id));
      addLog('info', 'Deleted workflow');
    } catch (error) {
      console.error('Failed to delete workflow:', error);
    }
  };

  const toggleWorkflow = async (workflow) => {
    const updated = { ...workflow, enabled: !workflow.enabled };
    await updateWorkflow(updated);
    addLog('info', `${updated.enabled ? 'Enabled' : 'Disabled'} workflow: ${workflow.name}`);
  };

  const addLog = async (type, message, details = {}) => {
    const log = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type,
      message,
      details
    };

    try {
      await window.storage.set(`log:${log.id}`, JSON.stringify(log));
      setLogs([log, ...logs].slice(0, 100));
    } catch (error) {
      console.error('Failed to add log:', error);
    }
  };

  const clearLogs = async () => {
    if (!confirm('Clear all logs?')) return;
    
    try {
      const result = await window.storage.list('log:');
      if (result && result.keys) {
        await Promise.all(result.keys.map(key => window.storage.delete(key)));
      }
      setLogs([]);
      addLog('info', 'Logs cleared');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  };

  const exportLogs = () => {
    const data = JSON.stringify(logs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jetstream-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getWorkflowType = (typeId) => {
    return workflowTypes.find(t => t.id === typeId);
  };

  const getStats = () => {
    const total = workflows.length;
    const enabled = workflows.filter(w => w.enabled).length;
    const totalRuns = workflows.reduce((sum, w) => sum + w.runCount, 0);
    const totalSuccess = workflows.reduce((sum, w) => sum + w.successCount, 0);
    const successRate = totalRuns > 0 ? ((totalSuccess / totalRuns) * 100).toFixed(1) : 0;
    
    return { total, enabled, totalRuns, successRate };
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                  JetStream
                </h1>
                <p className="text-blue-200">Office Workflow Automation Suite</p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-blue-200">Workflows</div>
            </div>
          </div>
        </header>

        <nav className="flex gap-2 mb-8 bg-slate-800/50 backdrop-blur rounded-xl p-2">
          <button
            onClick={() => setView('dashboard')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
              view === 'dashboard'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setView('workflows')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
              view === 'workflows'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <Settings className="w-5 h-5 inline mr-2" />
            Workflows
          </button>
          <button
            onClick={() => setView('logs')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
              view === 'logs'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Logs ({logs.length})
          </button>
        </nav>

        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <Settings className="w-8 h-8 mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">{stats.total}</div>
                <div className="text-blue-100">Total Workflows</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <CheckCircle className="w-8 h-8 mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">{stats.enabled}</div>
                <div className="text-green-100">Active Workflows</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <Play className="w-8 h-8 mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">{stats.totalRuns}</div>
                <div className="text-purple-100">Total Executions</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">{stats.successRate}%</div>
                <div className="text-orange-100">Success Rate</div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">No activity yet. Create and run workflows to see logs.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.slice(0, 10).map(log => (
                    <div key={log.id} className="bg-slate-700/50 rounded-lg p-4 flex items-start gap-3">
                      {getLogIcon(log.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-white">{log.message}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Workflow Types</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {workflowTypes.map(type => {
                  const Icon = type.icon;
                  const count = workflows.filter(w => w.type === type.id).length;
                  return (
                    <div key={type.id} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold">{type.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">{type.description}</p>
                          <p className="text-sm text-blue-400 mt-2">{count} workflow{count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {view === 'workflows' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Workflows</h2>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Workflow
              </button>
            </div>

            {isCreating && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Create New Workflow</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Workflow Name
                    </label>
                    <input
                      type="text"
                      value={newWorkflow.name}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                      placeholder="e.g., Daily Report Conversion"
                      className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Workflow Type
                    </label>
                    <select
                      value={newWorkflow.type}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, type: e.target.value })}
                      className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {workflowTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Schedule
                    </label>
                    <select
                      value={newWorkflow.schedule}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, schedule: e.target.value })}
                      className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {scheduleOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={createWorkflow}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      Create Workflow
                    </button>
                    <button
                      onClick={() => setIsCreating(false)}
                      className="flex-1 bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {workflows.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-12 text-center">
                <Settings className="w-20 h-20 mx-auto text-gray-600 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Workflows Yet</h3>
                <p className="text-gray-400 mb-6">Create your first workflow to automate office tasks</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Create Workflow
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {workflows.map(workflow => {
                  const type = getWorkflowType(workflow.type);
                  const Icon = type?.icon || Settings;
                  const isRunning = workflow.status === 'running';
                  
                  return (
                    <div key={workflow.id} className="bg-slate-800/50 backdrop-blur rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 bg-gradient-to-br ${type?.color || 'from-gray-500 to-gray-600'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-white">{workflow.name}</h3>
                            <p className="text-gray-400 text-sm mt-1">{type?.name}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                workflow.enabled 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {workflow.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                                {scheduleOptions.find(s => s.value === workflow.schedule)?.label}
                              </span>
                              {workflow.lastRun && (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                                  Last run: {new Date(workflow.lastRun).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => runWorkflow(workflow)}
                            disabled={isRunning || !workflow.enabled}
                            className={`p-2 rounded-lg transition-all ${
                              isRunning 
                                ? 'bg-yellow-500/20 text-yellow-400 cursor-wait' 
                                : workflow.enabled
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {isRunning ? <Clock className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => toggleWorkflow(workflow)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                          >
                            {workflow.enabled ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => deleteWorkflow(workflow.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{workflow.runCount}</div>
                          <div className="text-sm text-gray-400">Total Runs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{workflow.successCount}</div>
                          <div className="text-sm text-gray-400">Successful</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">{workflow.failureCount}</div>
                          <div className="text-sm text-gray-400">Failed</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {view === 'logs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">System Logs</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportLogs}
                  disabled={logs.length === 0}
                  className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  Export
                </button>
                <button
                  onClick={clearLogs}
                  disabled={logs.length === 0}
                  className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6">
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-20 h-20 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Logs Yet</h3>
                  <p className="text-gray-400">Run workflows to generate system logs</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {logs.map(log => (
                    <div key={log.id} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        {getLogIcon(log.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-white">{log.message}</p>
                          {log.details && Object.keys(log.details).length > 0 && (
                            <div className="mt-2 text-xs text-gray-400 font-mono bg-slate-800/50 p-2 rounded">
                              {JSON.stringify(log.details, null, 2)}
                            </div>
                          )}
                          <p className="text-sm text-gray-400 mt-2">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JetStream;