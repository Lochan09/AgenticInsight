# AgenticInsight
AgenticInsight is an autonomous AI system designed to bridge the gap between complex software architecture and technical education. Leveraging the CrewAI framework and FastAPI, the platform orchestrates a team of specialized AI agents to analyze, simplify, and document source code in real-time.

## Project Structure

```
AgenticInsight/
├── backend/                # FastAPI Application Layer
│   ├── main.py             # Entry point, API Routes, and CORS config
│   ├── crew_logic.py       # LangChain Agents and "Chain" logic
│   ├── .env                # API Keys (Excluded from Git)
│   └── requirements.txt    # Project dependencies
├── frontend/               # React.js UI Layer
│   ├── src/
│   │   ├── components/     # UI components (CodeInput, InsightCard) [cite: 8, 30]
│   │   └── App.js          # Main UI logic and API calling (Axios/Fetch) 
│   └── package.json        # Frontend dependencies
├── .gitignore              # Ignores venv/, .env, and node_modules/
└── README.md               # Professional documentation
```
