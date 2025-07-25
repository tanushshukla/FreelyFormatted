import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Copy, Download, Upload, Code, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
import { format as prettierFormat } from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserPostcss from 'prettier/parser-postcss';
import { format as sqlFormat } from 'sql-formatter';

type CodeTool = 'js-beautifier' | 'js-minifier' | 'css-beautifier' | 'css-minifier' | 'sql-formatter';
type IndentationType = '2' | '3' | '4' | 'tab';
type SqlLanguage = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'tsql';
type KeywordCase = 'upper' | 'lower' | 'preserve';

const CodeTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<CodeTool>('js-beautifier');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentation, setIndentation] = useState<IndentationType>('2');
  const [sqlLanguage, setSqlLanguage] = useState<SqlLanguage>('sql');
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper');
  const [semicolons, setSemicolons] = useState(true);
  const [singleQuotes, setSingleQuotes] = useState(false);

  const beautifyJavaScript = async () => {
    try {
      const options = {
        parser: 'babel',
        plugins: [parserBabel],
        tabWidth: indentation === 'tab' ? 4 : parseInt(indentation),
        useTabs: indentation === 'tab',
        semi: semicolons,
        singleQuote: singleQuotes,
        trailingComma: 'es5' as const,
        bracketSpacing: true,
        arrowParens: 'avoid' as const,
      };

      const formatted = await prettierFormat(input, options);
      setOutput(formatted);
      toast.success('JavaScript beautified successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error beautifying JavaScript';
      setOutput(`// Error: ${errorMessage}`);
      toast.error('Error beautifying JavaScript');
    }
  };

  const minifyJavaScript = () => {
    try {
      // Simple minification - remove comments, extra whitespace, and line breaks
      const minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
        .replace(/}\s*/g, '}') // Remove spaces after closing braces
        .replace(/;\s*/g, ';') // Remove spaces after semicolons
        .replace(/,\s*/g, ',') // Remove spaces after commas
        .trim();

      setOutput(minified);
      toast.success('JavaScript minified successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error minifying JavaScript';
      setOutput(`// Error: ${errorMessage}`);
      toast.error('Error minifying JavaScript');
    }
  };

  const beautifyCSS = async () => {
    try {
      const options = {
        parser: 'css',
        plugins: [parserPostcss],
        tabWidth: indentation === 'tab' ? 4 : parseInt(indentation),
        useTabs: indentation === 'tab',
      };

      const formatted = await prettierFormat(input, options);
      setOutput(formatted);
      toast.success('CSS beautified successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error beautifying CSS';
      setOutput(`/* Error: ${errorMessage} */`);
      toast.error('Error beautifying CSS');
    }
  };

  const minifyCSS = () => {
    try {
      // Simple CSS minification
      const minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
        .replace(/}\s*/g, '}') // Remove spaces after closing braces
        .replace(/;\s*/g, ';') // Remove spaces after semicolons
        .replace(/,\s*/g, ',') // Remove spaces after commas
        .replace(/:\s*/g, ':') // Remove spaces after colons
        .trim();

      setOutput(minified);
      toast.success('CSS minified successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error minifying CSS';
      setOutput(`/* Error: ${errorMessage} */`);
      toast.error('Error minifying CSS');
    }
  };

  const formatSQL = () => {
    try {
      const options = {
        language: sqlLanguage,
        tabWidth: indentation === 'tab' ? 4 : parseInt(indentation),
        useTabs: indentation === 'tab',
        keywordCase: keywordCase,
        linesBetweenQueries: 2,
      };

      const formatted = sqlFormat(input, options);
      setOutput(formatted);
      toast.success('SQL formatted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error formatting SQL';
      setOutput(`-- Error: ${errorMessage}`);
      toast.error('Error formatting SQL');
    }
  };

  const handleProcess = async () => {
    switch (activeTool) {
      case 'js-beautifier':
        await beautifyJavaScript();
        break;
      case 'js-minifier':
        minifyJavaScript();
        break;
      case 'css-beautifier':
        await beautifyCSS();
        break;
      case 'css-minifier':
        minifyCSS();
        break;
      case 'sql-formatter':
        formatSQL();
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
    let extension = 'txt';
    let mimeType = 'text/plain';
    
    if (activeTool.includes('js')) {
      extension = 'js';
      mimeType = 'text/javascript';
    } else if (activeTool.includes('css')) {
      extension = 'css';
      mimeType = 'text/css';
    } else if (activeTool.includes('sql')) {
      extension = 'sql';
      mimeType = 'text/plain';
    }

    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.${extension}`;
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
    { id: 'js-beautifier' as CodeTool, name: 'JS Beautifier', icon: Maximize2 },
    { id: 'js-minifier' as CodeTool, name: 'JS Minifier', icon: Minimize2 },
    { id: 'css-beautifier' as CodeTool, name: 'CSS Beautifier', icon: Maximize2 },
    { id: 'css-minifier' as CodeTool, name: 'CSS Minifier', icon: Minimize2 },
    { id: 'sql-formatter' as CodeTool, name: 'SQL Formatter', icon: Code },
  ];

  const getPlaceholder = () => {
    switch (activeTool) {
      case 'js-beautifier':
      case 'js-minifier':
        return 'Paste your JavaScript code here...';
      case 'css-beautifier':
      case 'css-minifier':
        return 'Paste your CSS code here...';
      case 'sql-formatter':
        return 'Paste your SQL query here...';
      default:
        return 'Paste your code here...';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">Code Tools</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Beautify, minify, and format JavaScript, CSS, and SQL code
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Indentation */}
              {!activeTool.includes('minifier') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Indentation
                  </label>
                  <select
                    value={indentation}
                    onChange={(e) => setIndentation(e.target.value as IndentationType)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="2">2 spaces</option>
                    <option value="3">3 spaces</option>
                    <option value="4">4 spaces</option>
                    <option value="tab">Tab</option>
                  </select>
                </div>
              )}

              {/* JavaScript Options */}
              {activeTool.includes('js') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semicolons
                    </label>
                    <select
                      value={semicolons ? 'true' : 'false'}
                      onChange={(e) => setSemicolons(e.target.value === 'true')}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="true">Add semicolons</option>
                      <option value="false">Remove semicolons</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quotes
                    </label>
                    <select
                      value={singleQuotes ? 'single' : 'double'}
                      onChange={(e) => setSingleQuotes(e.target.value === 'single')}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="double">Double quotes</option>
                      <option value="single">Single quotes</option>
                    </select>
                  </div>
                </>
              )}

              {/* SQL Options */}
              {activeTool === 'sql-formatter' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SQL Dialect
                    </label>
                    <select
                      value={sqlLanguage}
                      onChange={(e) => setSqlLanguage(e.target.value as SqlLanguage)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="sql">Standard SQL</option>
                      <option value="mysql">MySQL</option>
                      <option value="postgresql">PostgreSQL</option>
                      <option value="sqlite">SQLite</option>
                      <option value="tsql">T-SQL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keyword Case
                    </label>
                    <select
                      value={keywordCase}
                      onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="upper">UPPERCASE</option>
                      <option value="lower">lowercase</option>
                      <option value="preserve">Preserve</option>
                    </select>
                  </div>
                </>
              )}
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
                        accept=".js,.css,.sql,.txt"
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
                  className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                  {activeTool === 'js-beautifier' && 'Beautify JavaScript'}
                  {activeTool === 'js-minifier' && 'Minify JavaScript'}
                  {activeTool === 'css-beautifier' && 'Beautify CSS'}
                  {activeTool === 'css-minifier' && 'Minify CSS'}
                  {activeTool === 'sql-formatter' && 'Format SQL'}
                </button>
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
                  placeholder="Formatted code will appear here..."
                  className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none"
                />
                
                {/* Stats */}
                {output && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Input size:</span>
                        <span className="ml-2 text-gray-600">{input.length} characters</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Output size:</span>
                        <span className="ml-2 text-gray-600">{output.length} characters</span>
                      </div>
                      {activeTool.includes('minifier') && (
                        <div className="col-span-2">
                          <span className="font-medium text-gray-700">Compression:</span>
                          <span className="ml-2 text-gray-600">
                            {((1 - output.length / input.length) * 100).toFixed(1)}% reduction
                          </span>
                        </div>
                      )}
                    </div>
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

export default CodeTools;