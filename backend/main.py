from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from crew_logic import run_explanation_crew
import uvicorn

app = FastAPI()

# Enable CORS so your React frontend (localhost:3000) can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

@app.get("/")
def read_root():
    return {"status": "AgenticInsight Backend is Online"}

@app.post("/explain")
async def explain_code(request: CodeRequest):
    try:
        # Pass the input code to our CrewAI logic
        result = run_explanation_crew(request.code)
        return {"explanation": result} 
    except Exception as e:
        print(f"Error in execution: {e}")
        # Return 500 error to frontend if something goes wrong
        raise HTTPException(status_code=500, detail=f"AI Agent Error: {str(e)}")

# This allows you to run the file directly using 'python main.py'
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)