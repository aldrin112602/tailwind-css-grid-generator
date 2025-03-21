import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const CodeBlock = ({ type, code, language = "javascript" }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.innerHTML = hljs.highlight(code, { language }).value;
    }
  }, [code, language, type]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-700 text-white rounded-lg overflow-hidden shadow-lg my-4">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded transition"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      {/* Code Container */}
      <pre className="p-4 overflow-x-auto">
        <code ref={codeRef} className={`language-${language}`}></code>
      </pre>
    </div>
  );
};

export default CodeBlock;
