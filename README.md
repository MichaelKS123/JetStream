# JetStream

**Office Workflow Automation Suite**

*Developed by Michael Semera*

---

## 🚀 Overview

JetStream is a comprehensive workflow automation platform designed to streamline repetitive office tasks. It provides a modern web-based dashboard for creating, managing, and monitoring automated workflows including document conversion, report merging, email automation, and file archiving.

The platform features a modular plugin architecture where each task type is implemented as a separate module, allowing for easy extensibility and maintenance. JetStream tracks all workflow executions with detailed logging and provides real-time statistics and insights.

---

## ✨ Key Features

### Workflow Management
- **4 Built-in Automation Types**:
  - 📄 Word to PDF Converter
  - 📊 Excel Report Merger
  - 📧 Email Summary Generator
  - 📦 Attachment Archiver
- **Flexible Scheduling**: Manual, hourly, daily, weekly, and monthly execution
- **Enable/Disable Workflows**: Quick pause without deletion
- **Real-time Status**: Live execution monitoring with running indicators
- **Success Tracking**: Comprehensive statistics for each workflow

### Dashboard & Analytics
- **Live Statistics**: Total workflows, active count, execution totals, success rates
- **Recent Activity Feed**: Last 10 system events displayed prominently
- **Workflow Type Overview**: Visual breakdown of automation types
- **Performance Metrics**: Success/failure tracking per workflow

### Logging & Reporting
- **Comprehensive Logging**: All workflow executions logged with timestamps
- **Structured Log Data**: JSON-based log entries with metadata
- **Log Filtering**: Success, error, and info categorization
- **Export Functionality**: Download logs as JSON for external analysis
- **Log Management**: Clear all logs with confirmation

### User Interface
- **Modern Dark Theme**: Professional slate/blue gradient design
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback on all actions
- **Intuitive Navigation**: Three-tab interface (Dashboard, Workflows, Logs)
- **Visual Feedback**: Color-coded status indicators and animations

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 18**: Component-based UI architecture
- **React Hooks**: Modern state management (useState, useEffect, useRef)
- **Lucide React**: Professional icon library with 20+ icons
- **Tailwind CSS**: Utility-first styling with custom gradients

### Data Architecture
- **Browser Storage API**: Client-side persistent storage
- **JSON Serialization**: Structured data storage
- **Async/Await Patterns**: Non-blocking operations
- **Key-Value Storage**: Efficient data retrieval

### Design Patterns
- **Plugin Architecture**: Modular workflow types
- **State Management**: Centralized React state
- **Event-Driven Logging**: Asynchronous log creation
- **Separation of Concerns**: Clear data/UI boundaries

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm installed
- Modern web browser (Chrome, Firefox, Safari, Edge)
- 100MB+ available storage for logs and workflow data

### Quick Start

1. **Create React Application**
```bash
npx create-react-app jetstream
cd jetstream
```

2. **Install Dependencies**
```bash
npm install lucide-react
```

3. **Setup Tailwind CSS**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Replace App Component**
- Copy JetStream code into `src/App.js`

5. **Start Development Server**
```bash
npm start
```

6. **Access Dashboard**
- Open `http://localhost:3000`

### Production Build
```bash
npm run build
```

Deploy the `build` folder to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

---

## 💡 User Guide

### Creating a Workflow

1. **Navigate to Workflows Tab**
   - Click "Workflows" in the main navigation

2. **Click "New Workflow"**
   - Opens the workflow creation form

3. **Configure Workflow**
   - **Name**: Descriptive name (e.g., "Daily Sales Reports")
   - **Type**: Choose from 4 automation types
   - **Schedule**: Select execution frequency
   - Enable by default (can be toggled later)

4. **Create Workflow**
   - Click "Create Workflow" to save
   - Workflow appears in the list immediately

### Running Workflows

#### Manual Execution
1. Navigate to workflow in the list
2. Click the green Play button
3. Watch status change to "Running"
4. View completion in logs after 2-5 seconds

#### Scheduled Execution
- Workflows with non-manual schedules execute automatically
- Current implementation simulates scheduled runs
- Production version would integrate with cron/task scheduler

### Managing Workflows

**Enable/Disable**
- Click the Pause/Play button next to workflow
- Disabled workflows cannot be executed
- Useful for temporary suspension

**Delete Workflow**
- Click red Trash icon
- Confirm deletion in dialog
- Removes workflow and stops scheduled execution

**View Statistics**
- Each workflow card shows:
  - Total runs
  - Successful executions
  - Failed executions
  - Last run timestamp

### Monitoring & Logs

**Dashboard View**
- Overview cards show system-wide statistics
- Recent activity feed displays last 10 events
- Workflow type breakdown shows distribution

**Logs View**
- Chronological list of all system events
- Color-coded by type (success, error, info)
- Detailed JSON metadata for each entry
- Search/filter capabilities (future enhancement)

**Export Logs**
- Click "Export" button in Logs tab
- Downloads JSON file with all log entries
- Filename includes current date
- Use for external analysis or backup

**Clear Logs**
- Click "Clear" button (confirmation required)
- Removes all log entries
- Creates new log entry documenting the clear action

---

## 🏗️ Architecture

### Component Structure

```
JetStream (Main Component)
├── State Management
│   ├── workflows: Array<Workflow>
│   ├── logs: Array<LogEntry>
│   ├── view: 'dashboard' | 'workflows' | 'logs'
│   ├── selectedWorkflow: Workflow | null
│   ├── isCreating: boolean
│   └── newWorkflow: WorkflowForm
├── Workflow Operations
│   ├── createWorkflow()
│   ├── runWorkflow()
│   ├── updateWorkflow()
│   ├── deleteWorkflow()
│   └── toggleWorkflow()
├── Logging System
│   ├── addLog()
│   ├── loadLogs()
│   ├── clearLogs()
│   └── exportLogs()
└── UI Rendering
    ├── Dashboard View
    ├── Workflows View
    └── Logs View
```

### Data Models

```typescript
// Workflow Definition
interface Workflow {
  id: string;                    // Unique identifier (timestamp)
  name: string;                  // User-defined name
  type: WorkflowType;            // Automation type
  schedule: ScheduleType;        // Execution frequency
  enabled: boolean;              // Active status
  created: number;               // Creation timestamp
  lastRun: number | null;        // Last execution time
  runCount: number;              // Total executions
  successCount: number;          // Successful runs
  failureCount: number;          // Failed runs
  status: 'ready' | 'running' | 'success' | 'failed';
}

// Log Entry
interface LogEntry {
  id: string;                    // Unique identifier
  timestamp: number;             // Unix timestamp
  type: 'success' | 'error' | 'info';
  message: string;               // Human-readable description
  details: Record<string, any>;  // Structured metadata
}

// Workflow Type
interface WorkflowType {
  id: string;                    // Type identifier
  name: string;                  // Display name
  icon: LucideIcon;              // Icon component
  description: string;           // Type description
  color: string;                 // Gradient classes
}
```

### Storage Schema

**Workflow Storage**
```
Key: workflow:{workflowId}
Value: JSON string of Workflow object

Example:
workflow:1699564800000 -> {"id":"1699564800000","name":"Daily Reports",...}
```

**Log Storage**
```
Key: log:{logId}
Value: JSON string of LogEntry object

Example:
log:1699564801000 -> {"id":"1699564801000","type":"success",...}
```

---

## 🔧 Workflow Types

### 1. Word to PDF Converter

**Purpose**: Automatically convert Microsoft Word documents to PDF format

**Use Cases**:
- Report distribution in read-only format
- Document archiving
- Cross-platform compatibility
- File size optimization

**Implementation Notes**:
```javascript
// Production implementation would use:
// - docx-pdf library for conversion
// - File system watchers for input folder
// - PDF generation with metadata
// - Error handling for corrupt files
```

**Configuration Options** (Future):
- Input folder path
- Output folder path
- PDF quality settings
- Naming conventions
- Batch processing limits

---

### 2. Excel Report Merger

**Purpose**: Combine multiple Excel files into consolidated reports

**Use Cases**:
- Monthly sales report consolidation
- Multi-department data aggregation
- Budget compilation from teams
- Inventory reports from warehouses

**Implementation Notes**:
```javascript
// Production implementation would use:
// - xlsx or exceljs library
// - Sheet merging algorithms
// - Formula preservation
// - Format retention
```

**Configuration Options** (Future):
- Source folder pattern matching
- Sheet selection rules
- Column mapping
- Calculation refresh
- Output format (XLSX, CSV)

---

### 3. Email Summary Generator

**Purpose**: Generate and send automated summary emails

**Use Cases**:
- Daily digest emails
- Weekly performance reports
- Monthly statistics summaries
- Alert notifications

**Implementation Notes**:
```javascript
// Production implementation would use:
// - nodemailer for SMTP
// - Template engine (Handlebars, EJS)
// - HTML email generation
// - Attachment support
```

**Configuration Options** (Future):
- Recipient lists
- Email templates
- Subject line patterns
- Data source queries
- Attachment rules

---

### 4. Attachment Archiver

**Purpose**: Automatically archive and organize email attachments

**Use Cases**:
- Invoice collection
- Contract storage
- Document organization
- Backup automation

**Implementation Notes**:
```javascript
// Production implementation would use:
// - IMAP client for email access
// - File system operations
// - Metadata extraction
// - Duplicate detection
```

**Configuration Options** (Future):
- Email account credentials
- Filter rules (sender, subject)
- Folder structure
- File naming patterns
- Duplicate handling

---

## 🔐 Security Considerations

### Current Implementation (Demo)
- Client-side storage only
- No authentication required
- Data isolated to browser
- No external API calls

### Production Requirements

**Authentication & Authorization**
```javascript
// Implement user authentication
- JWT token-based auth
- Role-based access control (RBAC)
- Per-workflow permissions
- Audit logging of access
```

**Data Protection**
```javascript
// Secure sensitive information
- Encrypt credentials at rest
- Secure credential storage (Azure Key Vault, AWS Secrets Manager)
- HTTPS-only communication
- Input validation and sanitization
```

**Workflow Security**
```javascript
// Prevent malicious workflows
- Sandbox execution environment
- Resource limits (CPU, memory, time)
- File system access restrictions
- Network access controls
```

---

## 📊 Performance Optimization

### Current Optimizations
- **Lazy Loading**: Workflows and logs loaded on demand
- **Pagination**: Logs limited to 100 most recent entries
- **Debounced Storage**: Batch write operations
- **Efficient Sorting**: In-memory array operations
- **Conditional Rendering**: Only render active view

### Production Optimizations

**Backend Processing**
```javascript
// Move heavy operations to backend
- Async job processing (Bull, RabbitMQ)
- Worker pools for parallel execution
- Progress tracking with WebSockets
- Result caching
```

**Database Optimization**
```javascript
// Efficient data storage and retrieval
- Indexed queries on timestamp, status
- Pagination for large datasets
- Aggregation pipelines for statistics
- Archive old logs to cold storage
```

**UI Performance**
```javascript
// Optimize frontend rendering
- Virtual scrolling for large lists
- React.memo for expensive components
- Debounced search/filter
- Service workers for offline capability
```

---

## 🧪 Testing Strategy

### Unit Tests

```javascript
// Workflow operations
describe('createWorkflow', () => {
  it('should create workflow with valid data', () => {});
  it('should reject invalid workflow names', () => {});
  it('should generate unique IDs', () => {});
});

// Logging system
describe('addLog', () => {
  it('should create log entry with timestamp', () => {});
  it('should support all log types', () => {});
  it('should limit log count to 100', () => {});
});
```

### Integration Tests

```javascript
// End-to-end workflow execution
describe('Workflow Execution', () => {
  it('should execute workflow from start to finish', () => {});
  it('should update statistics after run', () => {});
  it('should create log entries', () => {});
  it('should handle failures gracefully', () => {});
});
```

### Manual Testing Checklist
- [ ] Create all workflow types
- [ ] Execute workflows manually
- [ ] Toggle enable/disable
- [ ] Delete workflows
- [ ] View statistics updates
- [ ] Export logs
- [ ] Clear logs
- [ ] Test responsive design on mobile
- [ ] Verify persistence across page reload
- [ ] Check error handling

---

## 🔄 Future Enhancements

### Short-term (v2.0)
- **Real Scheduling**: Integration with cron for true scheduled execution
- **Workflow Templates**: Pre-configured workflows for common tasks
- **Better Error Messages**: Detailed failure information
- **Workflow Editing**: Modify existing workflows without recreation
- **Search & Filter**: Find workflows and logs quickly

### Medium-term (v3.0)
- **User Authentication**: Multi-user support with login
- **Team Collaboration**: Share workflows across team
- **Notification System**: Email/Slack alerts on completion
- **Advanced Scheduling**: Cron expression support
- **Workflow Variables**: Dynamic configuration per run

### Long-term (v4.0)
- **Visual Workflow Builder**: Drag-and-drop workflow creation
- **Plugin Marketplace**: Community-contributed automation types
- **Machine Learning**: Predictive failure detection
- **Multi-tenant Architecture**: Enterprise-scale deployment
- **Mobile Apps**: iOS and Android native applications

---

## 🌐 Deployment

### Local Development
```bash
npm start
# Access at http://localhost:3000
```

### Static Hosting (Netlify)
```bash
npm run build
netlify deploy --prod --dir=build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

```bash
docker build -t jetstream .
docker run -p 3000:3000 jetstream
```

### Production Architecture

```
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│  Web  │ │  Web  │
│Server1│ │Server2│
└───┬───┘ └──┬────┘
    │        │
    └────┬───┘
         │
┌────────▼────────┐
│   API Server    │
│  (Node.js)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│Redis  │ │MongoDB│
│Cache  │ │  DB   │
└───────┘ └───────┘
```

---

## 🐛 Troubleshooting

### Workflows Not Saving
**Issue**: Workflows disappear after page reload
**Solution**: 
- Check browser storage quota
- Verify browser supports Storage API
- Clear browser cache and try again

### Workflows Stuck in "Running"
**Issue**: Workflow shows running status indefinitely
**Solution**:
- Refresh the page (simulated async operation timeout)
- Check browser console for errors
- Delete and recreate workflow if persists

### Logs Not Displaying
**Issue**: Logs view is empty despite workflow runs
**Solution**:
- Check that workflows completed (not stuck running)
- Verify storage permissions
- Clear all logs and run workflow again

### Poor Performance
**Issue**: UI becomes sluggish with many workflows
**Solution**:
- Delete unused workflows
- Clear old logs (keep last 100)
- Refresh page to reset state
- Close other browser tabs

---

## 📚 API Reference

### Workflow Operations

```javascript
// Create new workflow
async createWorkflow(workflow: WorkflowForm): Promise<Workflow>

// Execute workflow
async runWorkflow(workflow: Workflow): Promise<void>

// Update workflow
async updateWorkflow(workflow: Workflow): Promise<void>

// Delete workflow
async deleteWorkflow(id: string): Promise<void>

// Toggle enabled status
async toggleWorkflow(workflow: Workflow): Promise<void>
```

### Logging Operations

```javascript
// Add log entry
async addLog(
  type: 'success' | 'error' | 'info',
  message: string,
  details?: Record<string, any>
): Promise<void>

// Load all logs
async loadLogs(): Promise<LogEntry[]>

// Clear all logs
async clearLogs(): Promise<void>

// Export logs to file
exportLogs(): void
```

### Storage Operations

```javascript
// Save data
await window.storage.set(key: string, value: string): Promise<void>

// Retrieve data
await window.storage.get(key: string): Promise<{key, value} | null>

// Delete data
await window.storage.delete(key: string): Promise<void>

// List keys
await window.storage.list(prefix: string): Promise<{keys: string[]}>
```

---

## 🤝 Contributing

This is a portfolio project by Michael Semera. Feedback and suggestions are welcome!

---

## 📄 License

This project is created for portfolio purposes. All rights reserved by Michael Semera.

---

## 👨‍💻 About the Developer

**Michael Semera**
- Portfolio Project: JetStream
- Specialization: Workflow automation and enterprise applications
- Focus: Building scalable, maintainable business automation tools

### Skills Demonstrated
- React application architecture
- State management patterns
- Async/await data operations
- UI/UX design for business applications
- Logging and monitoring systems
- Plugin-based architecture

---

## 🙏 Acknowledgments

- **React Team**: Excellent framework and documentation
- **Lucide Icons**: Beautiful, consistent iconography
- **Tailwind CSS**: Rapid UI development
- **Browser Storage API**: Client-side data persistence

---

## 📞 Support

For questions about this project, please contact Michael Semera.

- 💼 LinkedIn: [Michael Semera](https://www.linkedin.com/in/michael-semera-586737295/)
- 🐙 GitHub: [@MichaelKS123](https://github.com/MichaelKS123)
- 📧 Email: michaelsemera15@gmail.com

---

**Automate. Optimize. Accelerate. ⚡**

*Built with precision by Michael Semera*

*Last Updated: November 2025*