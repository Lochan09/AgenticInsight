import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

def run_explanation_crew(code_input):
    # 1. Configure Gemini API
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    
    # 2. Initialize the model with available model name
    model = genai.GenerativeModel('models/gemini-2.5-flash')
    
    # 3. Create the prompt
    prompt = f"""You are a Senior DevOps Auditor.
Your goal is to analyze code for security vulnerabilities and performance bottlenecks.
You are direct and critical - you find flaws others miss.

IMPORTANT: For EACH issue found, provide:
1. Clear description of the problem
2. The EXACT problematic code from the submission
3. The CORRECTED code that fixes the issue

Analyze this code:

{code_input}

Provide a detailed audit report with these EXACT sections (use these headers):

## 1. Security Vulnerabilities
For each vulnerability found:
**[Issue Title]**
❌ **Problematic Code:**
```
[exact code snippet that has the vulnerability]
```
✅ **Fixed Code:**
```
[corrected code]
```
**Explanation:** [why this is fixed]

## 2. Performance Issues
For each performance issue found:
**[Issue Title]**
❌ **Problematic Code:**
```
[exact code snippet that has poor performance]
```
✅ **Fixed Code:**
```
[optimized code]
```
**Explanation:** [why this is better]

## 3. Recommended Improvements
For each improvement suggested:
**[Improvement Title]**
❌ **Current Code:**
```
[current approach]
```
✅ **Improved Code:**
```
[better approach]
```
**Explanation:** [why this improves the code]

## 4. Code Quality Assessment
**Overall Assessment:** [summary]
For each quality issue:
**[Quality Issue]**
❌ **Before:**
```
[original code]
```
✅ **After:**
```
[improved code]
```
**Explanation:** [improvement details]

## 5. Suggested Corrected Code (Full Version)
Return ONE complete corrected version of the submitted code that applies all fixes from sections 1-4.
Output it as a single runnable code block:
```[language]
[full corrected code here]
```
Do not omit any required imports, setup, or helper functions.

NOTE: If no issues exist in a category, write "No issues found in this category." Do NOT provide theoretical or hypothetical issues - ONLY report issues that actually exist in the provided code."""
    
    # 4. Generate response
    response = model.generate_content(prompt)
    
    return response.text