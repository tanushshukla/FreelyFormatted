import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Copy, Download, Upload, Code, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
import * as prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserPostcss from 'prettier/parser-postcss';

type BeautifierTool = 'js-beautify' | 'js-minify' | 'css-beautify' | 'css-minify';

const CodeBeautifier: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTool, setActiveTool] = useState<BeautifierTool>('js-beautify');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [useTabs, setUseTabs] = useState(false);
  const [printWidth, setPrintWidth] = useState(80);

  // Handle URL parameters to set active tool
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    const toolMapping: Record<string, BeautifierTool> = {
      'js-beautify': 'js-beautify',
      'js-minify': 'js-minify',
      'css-beautify': 'css-beautify',
      'css-minify': 'css-minify'
    };
    
    if (toolParam && toolMapping[toolParam]) {
      setActiveTool(toolMapping[toolParam]);
    }
  }, [searchParams]);

  const beautifyJavaScript = async () => {
    try {
      const formatted = await prettier.format(input, {
        parser: 'babel',
        plugins: [parserBabel],
        tabWidth: indentSize,
        useTabs: useTabs,
        printWidth: printWidth,
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        arrowParens: 'avoid'
      });
      setOutput(formatted);
      toast.success('JavaScript beautified successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JavaScript format';
      setOutput(`// Error: ${errorMessage}`);
      toast.error('Error beautifying JavaScript');
    }
  };

  const minifyJavaScript = () => {
    try {
      // Simple minification by removing whitespace and comments
      let minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/;\s*}/g, ';}') // Remove space before closing brace
        .replace(/\{\s*/g, '{') // Remove space after opening brace
        .replace(/\s*}/g, '}') // Remove space before closing brace
        .replace(/\s*;\s*/g, ';') // Remove space around semicolons
        .replace(/\s*,\s*/g, ',') // Remove space around commas
        .replace(/\s*\+\s*/g, '+') // Remove space around plus
        .replace(/\s*-\s*/g, '-') // Remove space around minus
        .replace(/\s*\*\s*/g, '*') // Remove space around multiply
        .replace(/\s*\/\s*/g, '/') // Remove space around divide
        .replace(/\s*=\s*/g, '=') // Remove space around equals
        .replace(/\s*<\s*/g, '<') // Remove space around less than
        .replace(/\s*>\s*/g, '>') // Remove space around greater than
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
      const formatted = await prettier.format(input, {
        parser: 'css',
        plugins: [parserPostcss],
        tabWidth: indentSize,
        useTabs: useTabs,
        printWidth: printWidth
      });
      setOutput(formatted);
      toast.success('CSS beautified successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid CSS format';
      setOutput(`/* Error: ${errorMessage} */`);
      toast.error('Error beautifying CSS');
    }
  };

  const minifyCSS = () => {
    try {
      // Simple CSS minification
      let minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/;\s*}/g, ';}') // Remove space before closing brace
        .replace(/\{\s*/g, '{') // Remove space after opening brace
        .replace(/\s*}/g, '}') // Remove space before closing brace
        .replace(/\s*;\s*/g, ';') // Remove space around semicolons
        .replace(/\s*,\s*/g, ',') // Remove space around commas
        .replace(/\s*:\s*/g, ':') // Remove space around colons
        .replace(/;}/g, '}') // Remove unnecessary semicolon before closing brace
        .trim();
      
      setOutput(minified);
      toast.success('CSS minified successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error minifying CSS';
      setOutput(`/* Error: ${errorMessage} */`);
      toast.error('Error minifying CSS');
    }
  };

  const handleProcess = async () => {
    switch (activeTool) {
      case 'js-beautify':
        await beautifyJavaScript();
        break;
      case 'js-minify':
        minifyJavaScript();
        break;
      case 'css-beautify':
        await beautifyCSS();
        break;
      case 'css-minify':
        minifyCSS();
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
    
    if (activeTool.startsWith('js-')) {
      extension = 'js';
      mimeType = 'text/javascript';
    } else if (activeTool.startsWith('css-')) {
      extension = 'css';
      mimeType = 'text/css';
    }

    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTool.includes('minify') ? 'minified' : 'beautified'}.${extension}`;
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
    { id: 'js-beautify' as BeautifierTool, name: 'JS Beautify', icon: Maximize2, type: 'JavaScript' },
    { id: 'js-minify' as BeautifierTool, name: 'JS Minify', icon: Minimize2, type: 'JavaScript' },
    { id: 'css-beautify' as BeautifierTool, name: 'CSS Beautify', icon: Maximize2, type: 'CSS' },
    { id: 'css-minify' as BeautifierTool, name: 'CSS Minify', icon: Minimize2, type: 'CSS' },
  ];

  const getPlaceholder = () => {
    switch (activeTool) {
      case 'js-beautify':
      case 'js-minify':
        return 'Paste your JavaScript code here...';
      case 'css-beautify':
      case 'css-minify':
        return 'Paste your CSS code here...';
      default:
        return 'Paste your code here...';
    }
  };

  const getOutputPlaceholder = () => {
    switch (activeTool) {
      case 'js-beautify':
        return 'Beautified JavaScript will appear here...';
      case 'js-minify':
        return 'Minified JavaScript will appear here...';
      case 'css-beautify':
        return 'Beautified CSS will appear here...';
      case 'css-minify':
        return 'Minified CSS will appear here...';
      default:
        return 'Processed code will appear here...';
    }
  };

  const isBeautifier = activeTool.includes('beautify');

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">Code Minifiers & Beautifiers</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Beautify and minify your JavaScript and CSS code with proper formatting and optimization
            </p>
          </div>

          {/* Tool Selector */}
          <div className="bg-white border-2 border-black rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex items-center justify-center px-3 py-2 rounded-md font-medium transition-colors duration-200 text-sm ${
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

            {/* Formatting Options (only for beautifiers) */}
            {isBeautifier && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Indent Size
                  </label>
                  <select
                    value={indentSize}
                    onChange={(e) => setIndentSize(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                    <option value={8}>8 spaces</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Indentation Type
                  </label>
                  <select
                    value={useTabs ? 'tabs' : 'spaces'}
                    onChange={(e) => setUseTabs(e.target.value === 'tabs')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="spaces">Spaces</option>
                    <option value="tabs">Tabs</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Print Width
                  </label>
                  <select
                    value={printWidth}
                    onChange={(e) => setPrintWidth(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value={80}>80 characters</option>
                    <option value={100}>100 characters</option>
                    <option value={120}>120 characters</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Input/Output Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input */}
            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">Input</h3>
                <div className="flex space-x-2">
                  <label className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200 flex items-center text-sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                    <input
                      type="file"
                      accept=".js,.css,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            {/* Output */}
            <div className="bg-white border-2 border-black rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">Output</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    disabled={!output}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={downloadFile}
                    disabled={!output}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
              <textarea
                value={output}
                readOnly
                placeholder={getOutputPlaceholder()}
                className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none"
              />
            </div>
          </div>

          {/* Process Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleProcess}
              disabled={!input.trim()}
              className="bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              <Code className="h-5 w-5 mr-2" />
              {activeTool.includes('beautify') ? 'Beautify' : 'Minify'} Code
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CodeBeautifier;