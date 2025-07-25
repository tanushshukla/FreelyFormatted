import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Copy, Download, Upload, Type, Code, Globe, Database } from 'lucide-react';
import { toast } from 'sonner';

type StringEscaperTool = 'html-escape' | 'xml-escape' | 'java-escape' | 'javascript-escape' | 'json-escape' | 'csv-escape' | 'sql-escape' | 'url-parser';

const StringEscaper: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTool, setActiveTool] = useState<StringEscaperTool>('html-escape');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [urlParts, setUrlParts] = useState<any>(null);

  // Handle URL parameters to set active tool
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    const toolMapping: Record<string, StringEscaperTool> = {
      'html-escape': 'html-escape',
      'xml-escape': 'xml-escape',
      'java-escape': 'java-escape',
      'javascript-escape': 'javascript-escape',
      'json-escape': 'json-escape',
      'csv-escape': 'csv-escape',
      'sql-escape': 'sql-escape',
      'url-parser': 'url-parser'
    };
    
    if (toolParam && toolMapping[toolParam]) {
      setActiveTool(toolMapping[toolParam]);
    }
  }, [searchParams]);

  const escapeHtml = () => {
    try {
      const escaped = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\//g, '&#x2F;');
      setOutput(escaped);
      toast.success('HTML escaped successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error escaping HTML';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error escaping HTML');
    }
  };

  const escapeXml = () => {
    try {
      const escaped = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      setOutput(escaped);
      toast.success('XML escaped successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error escaping XML';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error escaping XML');
    }
  };

  const escapeJava = () => {
    try {
      const escaped = input
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'") 
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/\b/g, '\\b')
        .replace(/\f/g, '\\f');
      setOutput(escaped);
      toast.success('Java/C# escaped successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error escaping Java/C#';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error escaping Java/C#');
    }
  };

  const escapeJavaScript = () => {
    try {
      const escaped = input
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'") 
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/\b/g, '\\b')
        .replace(/\f/g, '\\f')
        .replace(/\v/g, '\\v')
        .replace(/\0/g, '\\0');
      setOutput(escaped);
      toast.success('JavaScript escaped successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error escaping JavaScript';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error escaping JavaScript');
    }
  };

  const escapeJson = () => {
    try {
      const escaped = JSON.stringify(input);
      setOutput(escaped.slice(1, -1)); // Remove surrounding quotes
      toast.success('JSON escaped successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error escaping JSON';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error escaping JSON');
    }
  };

  const escapeCsv = () => {
    try {
      let escaped = input;
      
      // If contains comma, newline, or quote, wrap in quotes
      if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
        escaped = '"' + escaped.replace(/"/g, '""') + '"';
      }
      
      setOutput(escaped);
      toast.success('CSV escaped successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error escaping CSV';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error escaping CSV');
    }
  };

  const escapeSql = () => {
    try {
      const escaped = input.replace(/'/g, "''");
      setOutput(escaped);
      toast.success('SQL escaped successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error escaping SQL';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error escaping SQL');
    }
  };

  const parseUrl = () => {
    try {
      const url = new URL(input);
      const queryParams: Record<string, string> = {};
      
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      
      const parsed = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? '443' : '80'),
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        queryParameters: queryParams
      };
      
      setUrlParts(parsed);
      setOutput(JSON.stringify(parsed, null, 2));
      toast.success('URL parsed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid URL format';
      setOutput(`Error: ${errorMessage}`);
      setUrlParts(null);
      toast.error('Error parsing URL');
    }
  };

  const handleProcess = () => {
    switch (activeTool) {
      case 'html-escape':
        escapeHtml();
        break;
      case 'xml-escape':
        escapeXml();
        break;
      case 'java-escape':
        escapeJava();
        break;
      case 'javascript-escape':
        escapeJavaScript();
        break;
      case 'json-escape':
        escapeJson();
        break;
      case 'csv-escape':
        escapeCsv();
        break;
      case 'sql-escape':
        escapeSql();
        break;
      case 'url-parser':
        parseUrl();
        break;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      toast.success('File uploaded successfully!');
    };
    reader.readAsText(file);
  };

  const tools = [
    { id: 'html-escape' as StringEscaperTool, name: 'HTML Escape', icon: Globe },
    { id: 'xml-escape' as StringEscaperTool, name: 'XML Escape', icon: Code },
    { id: 'java-escape' as StringEscaperTool, name: 'Java/.Net Escape', icon: Code },
    { id: 'javascript-escape' as StringEscaperTool, name: 'JavaScript Escape', icon: Code },
    { id: 'json-escape' as StringEscaperTool, name: 'JSON Escape', icon: Database },
    { id: 'csv-escape' as StringEscaperTool, name: 'CSV Escape', icon: Database },
    { id: 'sql-escape' as StringEscaperTool, name: 'SQL Escape', icon: Database },
    { id: 'url-parser' as StringEscaperTool, name: 'URL Parser', icon: Globe },
  ];

  const getPlaceholder = () => {
    switch (activeTool) {
      case 'html-escape':
        return 'Enter HTML content to escape...';
      case 'xml-escape':
        return 'Enter XML content to escape...';
      case 'java-escape':
        return 'Enter Java/C# string to escape...';
      case 'javascript-escape':
        return 'Enter JavaScript string to escape...';
      case 'json-escape':
        return 'Enter JSON string to escape...';
      case 'csv-escape':
        return 'Enter CSV field to escape...';
      case 'sql-escape':
        return 'Enter SQL string to escape...';
      case 'url-parser':
        return 'Enter URL to parse (e.g., https://example.com/path?param=value)...';
      default:
        return 'Enter your text here...';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">String Escaper &amp; Utilities</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Escape strings for various programming languages and parse URLs with query parameters
            </p>
          </div>

          {/* Tool Selector */}
          <div className="bg-white border-2 border-black rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex flex-col items-center justify-center px-3 py-3 rounded-md font-medium transition-colors duration-200 text-xs ${
                      activeTool === tool.id
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mb-1" />
                    <span className="text-center">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white border-2 border-black rounded-lg">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">Input</h3>
                  <div className="flex gap-2">
                    <label className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                      <Upload className="h-4 w-4 inline mr-1" />
                      Upload
                      <input
                        type="file"
                        accept=".txt,.html,.xml,.js,.json,.csv,.sql"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
                <button
                  onClick={handleProcess}
                  disabled={!input.trim()}
                  className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {activeTool === 'url-parser' ? 'Parse URL' : 'Escape Text'}
                </button>
              </div>
            </div>

            {/* Output Section */}
            <div className="bg-white border-2 border-black rounded-lg">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">Output</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(output)}
                      disabled={!output}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Copy className="h-4 w-4 inline mr-1" />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadFile(output, `escaped-${activeTool}.txt`)}
                      disabled={!output}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Download className="h-4 w-4 inline mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                {activeTool === 'url-parser' && urlParts ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
                        <div className="p-2 bg-gray-50 rounded border text-sm font-mono">{urlParts.protocol}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hostname</label>
                        <div className="p-2 bg-gray-50 rounded border text-sm font-mono">{urlParts.hostname}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                        <div className="p-2 bg-gray-50 rounded border text-sm font-mono">{urlParts.port}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pathname</label>
                        <div className="p-2 bg-gray-50 rounded border text-sm font-mono">{urlParts.pathname}</div>
                      </div>
                    </div>
                    
                    {Object.keys(urlParts.queryParameters).length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Query Parameters</label>
                        <div className="space-y-2">
                          {Object.entries(urlParts.queryParameters).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-2 gap-2">
                              <div className="p-2 bg-blue-50 rounded border text-sm font-mono">{key}</div>
                              <div className="p-2 bg-green-50 rounded border text-sm font-mono">{String(value)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full JSON</label>
                      <textarea
                        value={output}
                        readOnly
                        className="w-full h-32 p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={output}
                    readOnly
                    placeholder="Escaped output will appear here..."
                    className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StringEscaper;