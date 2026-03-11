AgenticInsight 🚀
AgenticInsight is a full-stack, AI-native platform that audits source code for security, performance, and quality issues, then provides actionable fixes and a full corrected version users can copy directly.

🏗️ Architecture
The project follows a Decoupled 3-Tier Architecture for clean separation and scalability:

Frontend: Built with React.js, handles user input, loading states, report rendering, and copy-to-clipboard actions.
Backend: A high-performance FastAPI server exposing REST endpoints and request validation.
AI Analysis Layer: Powered by Google Gemini (gemini-2.5-flash) through the Google Generative AI SDK, using a strict structured prompt to return:
Security Vulnerabilities
Performance Issues
Recommended Improvements
Code Quality Assessment
Suggested Corrected Code (Full Version)

🛠️ Tech Stack
Frontend: React.js, Axios, CSS3
Backend: Python, FastAPI, Uvicorn, Pydantic, python-dotenv
AI Engine: Google Generative AI (Gemini 2.5 Flash)
Infrastructure: REST API with CORS-enabled communication between frontend and backend

🚀 Installation & Setup
Backend

cd backend
python -m venv venv
Activate.ps1
pip install -r requirements.txt

Create a .env file in backend and add:

Start backend:

Frontend

cd frontend
npm install
npm start

Frontend runs at:

http://localhost:3000
Backend runs at:

http://127.0.0.1:8000

🔍 Core Workflow
User pastes code in the frontend.
Frontend sends code to POST /explain.
Backend sends structured audit prompt to Gemini.
Gemini returns a markdown report with 5 required sections.

Frontend parses and displays:
4 audit cards in a 2x2 layout
1 Suggested Corrected Code section with copy action

🛡️ Resilience & Decisions
Strict structured prompting: Enforces consistent multi-section audit output.
Defensive frontend parsing: Handles heading/code-block variation in model output.
Latest-request rendering control: Prevents stale responses from replacing active results.
Explicit loading UI: Audit and suggested code are hidden/replaced by loading skeletons during analysis.
Actionable output design: Shows problematic snippets, fixed snippets, and complete corrected code.

📌 API Contract
GET /

Returns backend health status.
POST /explain

Request body:

{
"code": "your source code"
}

Response body:

{
"explanation": "structured markdown audit report"
}
