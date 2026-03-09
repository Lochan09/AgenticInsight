# AgenticInsight 🚀

**AgenticInsight** is a full-stack, AI-native platform that uses autonomous agents to analyze complex source code and provide simplified, metaphor-based explanations.

## 🏗️ Architecture
The project follows a **Decoupled 3-Tier Architecture** to ensure scalability and high performance:
* **Frontend:** Built with **React.js**, managing user state and asynchronous API communication via Axios.
* **Backend:** A high-performance **FastAPI** server serving as the RESTful gateway.
* **AI Orchestration:** Powered by **LangChain**, utilizing specialized "Technical Educator" chains for code reasoning.

## 🛠️ Tech Stack
* [cite_start]**Frontend:** React.js, CSS3[cite: 8].
* **Backend:** Python 3.14, FastAPI, Pydantic.
* **AI Engine:** LangChain, OpenAI (GPT-4o-mini).
* **Infrastructure:** REST API with CORS-secured endpoints.

## 🚀 Installation & Setup
1.  **Backend:**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate
    pip install "fastapi>=0.100.0" "uvicorn>=0.20.0" "python-dotenv>=1.0.0" "langchain-openai>=0.0.1" --only-binary=:all:
    uvicorn main:app --reload
    ```
2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm start
    ```

## 🛡️ Resilience & Decisions
* **Binary-First Installation:** Implemented a specific pip installation strategy to ensure compatibility with Python 3.14 on restricted environments.
* **LCEL Logic:** Used LangChain Expression Language (LCEL) for a lightweight, faster reasoning engine compared to standard multi-agent frameworks.
