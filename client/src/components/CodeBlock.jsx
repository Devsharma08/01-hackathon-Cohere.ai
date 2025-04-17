import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as styles from "react-syntax-highlighter/dist/esm/styles/prism"; // Import all styles
// import { vsDark } from "react-syntax-highlighter/dist/esm/styles/prism";
const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the "copied" state after 2 seconds
    }).catch(err => {
      alert("Failed to copy code: " + err);
    });
  };

  return (
    <div className="relative my-4">
      <SyntaxHighlighter language={language} style={styles.a11yDark}>
        {code}
      </SyntaxHighlighter>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded-md text-sm"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default CodeBlock;
