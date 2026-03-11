import React, { useRef, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const requestCounterRef = useRef(0);

  const handleExplain = async () => {
    const requestId = requestCounterRef.current + 1;
    requestCounterRef.current = requestId;

    setShowResult(false);
    setExplanation('');
    setCopyStatus('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/explain', { code });

      // Ignore stale responses from older requests.
      if (requestCounterRef.current !== requestId) return;

      setExplanation(response.data.explanation);
      setShowResult(true);
    } catch (error) {
      // Ignore stale errors from older requests.
      if (requestCounterRef.current !== requestId) return;

      console.error("Connection Error:", error);
      setExplanation("Error: Ensure the Python backend is running at http://127.0.0.1:8000");
      setShowResult(true);
    } finally {
      if (requestCounterRef.current === requestId) {
        setLoading(false);
      }
    }
  };

  const parseExplanation = (text) => {
    const sections = {
      security: { title: '🔒 Security Vulnerabilities', content: '' },
      performance: { title: '⚡ Performance Issues', content: '' },
      improvements: { title: '✨ Recommended Improvements', content: '' },
      quality: { title: '📊 Code Quality Assessment', content: '' },
      corrected: { title: '✅ Suggested Corrected Code', content: '' },
    };

    // Split by section headers with flexible matching so slight model format changes still parse.
    const securityMatch = text.match(/##\s*1\.?\s*[^\n]*Security[^\n]*([\s\S]*?)(?=##\s*2\.?\s*|$)/i);
    const performanceMatch = text.match(/##\s*2\.?\s*[^\n]*Performance[^\n]*([\s\S]*?)(?=##\s*3\.?\s*|$)/i);
    const improvementsMatch = text.match(/##\s*3\.?\s*[^\n]*Improvement[^\n]*([\s\S]*?)(?=##\s*4\.?\s*|$)/i);
    const qualityMatch = text.match(/##\s*4\.?\s*[^\n]*Quality[^\n]*([\s\S]*?)(?=##\s*5\.?\s*|$)/i);
    const correctedMatch = text.match(/##\s*5\.?\s*[^\n]*Suggested\s*Corrected\s*Code[^\n]*([\s\S]*?)$/i)
      || text.match(/(?:##|###)\s*[^\n]*Suggested\s*Corrected\s*Code[^\n]*([\s\S]*?)$/i);

    if (securityMatch) sections.security.content = securityMatch[1].trim();
    if (performanceMatch) sections.performance.content = performanceMatch[1].trim();
    if (improvementsMatch) sections.improvements.content = improvementsMatch[1].trim();
    if (qualityMatch) sections.quality.content = qualityMatch[1].trim();
    if (correctedMatch) sections.corrected.content = correctedMatch[1].trim();

    return sections;
  };

  const extractLongestCodeBlock = (content) => {
    const matches = [...content.matchAll(/```[^\n\r]*\r?\n([\s\S]*?)```/g)];
    if (!matches.length) return '';

    return matches
      .map((match) => match[1].trim())
      .sort((a, b) => b.length - a.length)[0];
  };

  const handleCopyCode = async (codeToCopy) => {
    if (!codeToCopy) return;

    try {
      await navigator.clipboard.writeText(codeToCopy);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 1800);
    } catch (error) {
      setCopyStatus('Copy failed');
      setTimeout(() => setCopyStatus(''), 1800);
    }
  };

  const renderContent = (content) => {
    const parts = [];
    const lines = content.split('\n');
    let currentPart = '';
    let inCodeBlock = false;
    let codeBlockType = '';
    let codeContent = '';

    lines.forEach((line, idx) => {
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockType = line.trim().replace('```', '') || 'code';
          codeContent = '';
          if (currentPart.trim()) {
            parts.push({ type: 'text', content: currentPart.trim() });
            currentPart = '';
          }
        } else {
          inCodeBlock = false;
          parts.push({ 
            type: 'code', 
            language: codeBlockType, 
            content: codeContent.trim() 
          });
          codeContent = '';
        }
      } else if (inCodeBlock) {
        codeContent += line + '\n';
      } else {
        currentPart += line + '\n';
      }
    });

    if (currentPart.trim()) {
      parts.push({ type: 'text', content: currentPart.trim() });
    }

    return parts.map((part, idx) => {
      if (part.type === 'code') {
        return (
          <div key={idx} className="code-block">
            <pre><code>{part.content}</code></pre>
          </div>
        );
      } else {
        return (
          <div key={idx} className="text-part">
            {part.content.split('\n').map((line, lineIdx) => (
              <p key={lineIdx}>{line}</p>
            ))}
          </div>
        );
      }
    });
  };

  const sections = explanation ? parseExplanation(explanation) : null;
  const correctedCode = sections?.corrected?.content
    ? extractLongestCodeBlock(sections.corrected.content)
    : '';
  const correctedFallbackText = sections?.corrected?.content?.trim() || '';

  return (
    <div className="App">
      <div className="header">
        <h1 className="title">🤖 AgenticInsight</h1>
        <p className="subtitle">AI-Powered Code Analysis & Security Auditing</p>
      </div>

      <div className="container">
        <div className="content-wrapper">
          {/* Input Section */}
          <div className="input-section">
            <h2>Paste Your Code</h2>
            <textarea 
              className="code-textarea"
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="Paste your React, Node, Python, or any code here..."
            />
            
            <button 
              className={`analyze-btn ${loading ? 'loading' : ''}`}
              onClick={handleExplain} 
              disabled={loading || !code}
            >
              {loading ? '⏳ Analyzing...' : '🚀 Start Audit'}
            </button>
          </div>

          {/* Output Section */}
          {(loading || showResult) && (
            <div className="output-section">
              <h2>{loading ? '⏳ Generating Audit Report...' : '📈 Audit Report'}</h2>

              {loading ? (
                <>
                  <div className="sections-grid">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="card loading-card">
                        <div className="loading-line loading-title" />
                        <div className="loading-line" />
                        <div className="loading-line" />
                        <div className="loading-line short" />
                      </div>
                    ))}
                  </div>

                  <div className="suggested-code-section loading-suggested">
                    <div className="suggested-code-header">
                      <h3>🧩 Suggested Corrected Code</h3>
                    </div>
                    <div className="suggested-code-block">
                      <div className="loading-line" />
                      <div className="loading-line" />
                      <div className="loading-line" />
                      <div className="loading-line short" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="sections-grid">
                    {sections && ['security', 'performance', 'improvements', 'quality'].map((key) => {
                      const section = sections[key];

                      return (
                      section.content.trim() && (
                        <div key={key} className="card">
                          <h3 className={`card-title card-title-${key}`}>{section.title}</h3>
                          <div className="card-content">
                            {renderContent(section.content)}
                          </div>
                        </div>
                      )
                    );
                    })}
                  </div>

                  {(correctedCode || correctedFallbackText) && (
                    <div className="suggested-code-section">
                      <div className="suggested-code-header">
                        <h3>🧩 Suggested Corrected Code</h3>
                        {correctedCode && (
                          <button
                            className="copy-btn"
                            onClick={() => handleCopyCode(correctedCode)}
                          >
                            {copyStatus || 'Copy Code'}
                          </button>
                        )}
                      </div>
                      <div className="suggested-code-block">
                        <pre><code>{correctedCode || correctedFallbackText}</code></pre>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;