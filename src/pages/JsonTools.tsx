import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Copy, Download, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type JsonTool = 'formatter' | 'validator' | 'escape';
type IndentationType = '2' | '3' | '4' | 'compact' | 'tab';

interface JsonError {
  line: number;
  column: number;
  message: string;
}

const JsonTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<JsonTool>('formatter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentation, setIndentation] = useState<IndentationType>('2');
  const [validationMode, setValidationMode] = useState<'strict' | 'lenient'>('strict');
  const [errors, setErrors] = useState<JsonError[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      let formatted: string;
      
      switch (indentation) {
        case 'compact':
          formatted = JSON.stringify(parsed);
          break;
        case 'tab':
          formatted = JSON.stringify(parsed, null, '\t');
          break;
        default:
          formatted = JSON.stringify(parsed, null, parseInt(indentation));
      }
      
      setOutput(formatted);
      setErrors([]);
      setIsValid(true);
      toast.success('JSON formatted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
      setErrors([{ line: 1, column: 1, message: errorMessage }]);
      setOutput('');
      setIsValid(false);
      toast.error('Invalid JSON format');
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setErrors([]);
      setIsValid(true);
      setOutput('✅ Valid JSON');
      toast.success('JSON is valid!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
      const match = errorMessage.match(/position (\d+)/);
      const position = match ? parseInt(match[1]) : 0;
      
      setErrors([{ line: 1, column: position, message: errorMessage }]);
      setIsValid(false);
      setOutput(`❌ Invalid JSON: ${errorMessage}`);
      toast.error('JSON validation failed');
    }
  };

  const escapeJson = () => {
    try {
      const escaped = JSON.stringify(input);
      setOutput(escaped.slice(1, -1)); // Remove surrounding quotes
      toast.success('JSON escaped successfully!');
    } catch {
      toast.error('Error escaping JSON');
    }
  };

  const unescapeJson = () => {
    try {
      const unescaped = JSON.parse(`"${input}"`);
      setOutput(unescaped);
      toast.success('JSON unescaped successfully!');
    } catch {
      toast.error('Error unescaping JSON');
    }
  };

  const handleProcess = () => {
    switch (activeTool) {
      case 'formatter':
        formatJson();
        break;
      case 'validator':
        validateJson();
        break;
      case 'escape':
        escapeJson();
        break;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
        toast.success('File uploaded successfully!');
      };
      reader.readAsText(file);
    }
  };

  const tools = [
    { id: 'formatter' as JsonTool, name: 'JSON Formatter', icon: FileText },
    { id: 'validator' as JsonTool, name: 'JSON Validator', icon: CheckCircle },
    { id: 'escape' as JsonTool, name: 'JSON Escape', icon: AlertCircle },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">JSON Tools</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Format, validate, and escape JSON data with professional-grade tools
            </p>
          </div>

          {/* Tool Selector */}
          <div className="bg-white border-2 border-black rounded-lg p-6 mb-8">
            <div className="flex flex-wrap gap-4 mb-6">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      activeTool === tool.id
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {tool.name}
                  </button>
                );
              })}
            </div>

            {/* Tool Options */}
            {activeTool === 'formatter' && (
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Indentation
                  </label>
                  <select
                    value={indentation}
                    onChange={(e) => setIndentation(e.target.value as IndentationType)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="2">2 spaces</option>
                    <option value="3">3 spaces</option>
                    <option value="4">4 spaces</option>
                    <option value="tab">Tab</option>
                    <option value="compact">Compact</option>
                  </select>
                </div>
              </div>
            )}

            {activeTool === 'validator' && (
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validation Mode
                  </label>
                  <select
                    value={validationMode}
                    onChange={(e) => setValidationMode(e.target.value as 'strict' | 'lenient')}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="strict">Strict (RFC 4627)</option>
                    <option value="lenient">Lenient</option>
                  </select>
                </div>
              </div>
            )}

            {activeTool === 'escape' && (
              <div className="flex gap-4 mb-4">
                <button
                  onClick={escapeJson}
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                  Escape JSON
                </button>
                <button
                  onClick={unescapeJson}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                >
                  Unescape JSON
                </button>
              </div>
            )}
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
                        accept=".json,.txt"
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
                  placeholder={`Paste your JSON here...`}
                  className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
                {activeTool !== 'escape' && (
                  <button
                    onClick={handleProcess}
                    className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200"
                  >
                    {activeTool === 'formatter' ? 'Format JSON' : 'Validate JSON'}
                  </button>
                )}
              </div>
            </div>

            {/* Output Section */}
            <div className="bg-white border-2 border-black rounded-lg">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">Output</h3>
                  <div className="flex gap-2">
                    {output && (
                      <>
                        <button
                          onClick={copyToClipboard}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        >
                          <Copy className="h-4 w-4 inline mr-1" />
                          Copy
                        </button>
                        <button
                          onClick={downloadFile}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        >
                          <Download className="h-4 w-4 inline mr-1" />
                          Download
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <textarea
                  value={output}
                  readOnly
                  placeholder="Formatted output will appear here..."
                  className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none"
                />
                
                {/* Validation Status */}
                {activeTool === 'validator' && isValid !== null && (
                  <div className={`mt-4 p-3 rounded-md ${
                    isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className={`flex items-center ${
                      isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isValid ? (
                        <CheckCircle className="h-5 w-5 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 mr-2" />
                      )}
                      {isValid ? 'Valid JSON' : 'Invalid JSON'}
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {errors.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="text-red-800 font-medium mb-2">Errors:</h4>
                    {errors.map((error, index) => (
                      <div key={index} className="text-red-700 text-sm">
                        Line {error.line}, Column {error.column}: {error.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JsonTools;