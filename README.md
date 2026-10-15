# Anvik Frontend — UPI Fraud-Ring Graph Investigator

> **PS 16 — UPI Fraud-Ring Graph Investigator with Explainable Alerts**  
> *Code-e-Manipal Hackathon Project*

---

## 1. Project Overview & Authorship

**Anvik Frontend** is the interactive investigative dashboard and graph visualization interface for the **Anvik** decision-support system. It surfaces multi-hop financial structuring flows, mule rings, device collusion farms, and evidence-backed fraud alerts.

### Team Ownership & Attribution
- **Frontend & Graph Visualization**: Designed and authored by **Piyush (Members 1 & 2)**.
- **Backend, Database & Detection Engine**: Designed and implemented by **Bharath (Member 3)**.
- **Dataset Quality & QA**: Validated by **Aryan (Member 4)**.
- **Synthetic Data Generation**: Handled by **Shivam (Member 5)**.

> [!IMPORTANT]
> **Investigative Decision Support Only**: Anvik is an analytical decision-support system for investigators, not an automated system for declaring guilt. Detected patterns represent deterministic investigative leads, not legal proof of wrongdoing.

> [!NOTE]
> **Synthetic Data Policy**: Anvik exclusively operates on synthetic transaction datasets. It does not connect to live payment switches, real banking infrastructure, or private financial records.

---

## 2. Technology Stack

### Frontend Application
- **Framework**: React 18 / TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Network Graph Engines**:
  - **Cytoscape.js**: Dynamic spring-embedded (`cose`) and concentric topology explorer for real backend subgraphs.
  - **Interactive SVG Canvas**: Chronological transaction playback with animated flow motion.
- **Icons**: Lucide React
- **API Client**: Typed fetch service with live backend connection status and fallback to synthetic demo data.

### Backend Integration
- **Framework**: FastAPI (Python 3.11+)
- **Database**: Turso hosted SQL (libSQL via `turso_serverless`)
- **Graph Engine**: NetworkX directed multigraph
- **API Endpoints**:
  - `GET /api/health`: Service liveness probe.
  - `GET /api/ready`: Database readiness probe.
  - `GET /api/graph`: Cytoscape.js compliant nodes and edges (`?status=SUCCESS&limit=200`).

---

## 3. Configuration & Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the Anvik FastAPI backend | `http://127.0.0.1:8000` |

If `VITE_API_BASE_URL` is omitted or the backend is temporarily unreachable, the frontend automatically provides an option to view the synthetic offline demo dataset with clear, visible demo mode indicators.

---

## 4. Quickstart & Development

### Installation
```bash
npm install
```

### Run Tests
```bash
npm test
```

### Run Local Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Generates a minified production build in `dist/`.

---

## 5. License & Compliance
Developed for the **Code-e-Manipal Hackathon**. All datasets, identifiers, VPAs, account numbers, and device IDs are strictly synthetic.
