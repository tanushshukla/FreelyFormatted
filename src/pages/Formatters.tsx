import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Copy, Download, Upload, Code, FileText, Database, Globe } from 'lucide-react';
import { toast } from 'sonner';
import * as prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import parserPostcss from 'prettier/parser-postcss';
import { format as sqlFormat } from 'sql-formatter';

type FormatterTool = 'xml-formatter' | 'json-formatter' | 'html-formatter' | 'sql-formatter';

const Formatters: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTool, setActiveTool] = useState<FormatterTool>('json-formatter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [sqlDialect, setSqlDialect] = useState('standard');

  // Handle URL parameters to set active tool
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    const toolMapping: Record<string, FormatterTool> = {
      'xml-formatter': 'xml-formatter',
      'json-formatter': 'json-formatter',
      'html-formatter': 'html-formatter',
      'sql-formatter': 'sql-formatter'
    };
    
    if (toolParam && toolMapping[toolParam]) {
      setActiveTool(toolMapping[toolParam]);
    }
  }, [searchParams]);

  const formatJson = () => {
    try {
      const jsonData = JSON.parse(input);
      const formatted = JSON.stringify(jsonData, null, indentSize);
      setOutput(formatted);
      toast.success('JSON formatted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
      setOutput(`// Error: ${errorMessage}`);
      toast.error('Error formatting JSON');
    }
  };

  const formatXml = () => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML format');
      }

      const formatXmlNode = (node: Node, indent = 0): string => {
        const indentStr = ' '.repeat(indent);
        
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          return text ? text : '';
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          let result = `${indentStr}<${element.tagName}`;
          
          // Add attributes
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            result += ` ${attr.name}="${attr.value}"`;
          }
          
          if (element.childNodes.length === 0) {
            result += '/>';
          } else {
            result += '>';
            
            const hasElementChildren = Array.from(element.childNodes).some(child => child.nodeType === Node.ELEMENT_NODE);
            
            if (hasElementChildren) {
              result += '\n';
              for (let i = 0; i < element.childNodes.length; i++) {
                const childResult = formatXmlNode(element.childNodes[i], indent + indentSize);
                if (childResult.trim()) {
                  result += childResult + '\n';
                }
              }
              result += `${indentStr}</${element.tagName}>`;
            } else {
              // Only text content
              const textContent = element.textContent?.trim();
              if (textContent) {
                result += textContent;
              }
              result += `</${element.tagName}>`;
            }
          }
          
          return result;
        }
        
        return '';
      };

      const formatted = '<?xml version="1.0" encoding="UTF-8"?>\n' + formatXmlNode(xmlDoc.documentElement);
      setOutput(formatted);
      toast.success('XML formatted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid XML format';
      setOutput(`<!-- Error: ${errorMessage} -->`);
      toast.error('Error formatting XML');
    }
  };

  const formatHtml = async () => {
    try {
      const formatted = await prettier.format(input, {
        parser: 'html',
        plugins: [parserHtml],
        tabWidth: indentSize,
        useTabs: false,
        printWidth: 80,
        htmlWhitespaceSensitivity: 'css'
      });
      setOutput(formatted);
      toast.success('HTML formatted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid HTML format';
      setOutput(`<!-- Error: ${errorMessage} -->`);
      toast.error('Error formatting HTML');
    }
  };

  const formatSql = () => {
    try {
      const formatted = sqlFormat(input, {
        language: sqlDialect as any,
        tabWidth: indentSize,
        keywordCase: 'upper',
        functionCase: 'upper',
        dataTypeCase: 'upper'
      });
      setOutput(formatted);
      toast.success('SQL formatted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid SQL format';
      setOutput(`-- Error: ${errorMessage}`);
      toast.error('Error formatting SQL');
    }
  };

  const handleFormat = async () => {
    switch (activeTool) {
      case 'json-formatter':
        formatJson();
        break;
      case 'xml-formatter':
        formatXml();
        break;
      case 'html-formatter':
        await formatHtml();
        break;
      case 'sql-formatter':
        formatSql();
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
    
    switch (activeTool) {
      case 'json-formatter':
        extension = 'json';
        mimeType = 'application/json';
        break;
      case 'xml-formatter':
        extension = 'xml';
        mimeType = 'text/xml';
        break;
      case 'html-formatter':
        extension = 'html';
        mimeType = 'text/html';
        break;
      case 'sql-formatter':
        extension = 'sql';
        mimeType = 'text/sql';
        break;
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
    { id: 'json-formatter' as FormatterTool, name: 'JSON Formatter', icon: Code },
    { id: 'xml-formatter' as FormatterTool, name: 'XML Formatter', icon: FileText },
    { id: 'html-formatter' as FormatterTool, name: 'HTML Formatter', icon: Globe },
    { id: 'sql-formatter' as FormatterTool, name: 'SQL Formatter', icon: Database },
  ];

  const getPlaceholder = () => {
    switch (activeTool) {
      case 'json-formatter':
        return 'Paste your JSON data here...';
      case 'xml-formatter':
        return 'Paste your XML data here...';
      case 'html-formatter':
        return 'Paste your HTML code here...';
      case 'sql-formatter':
        return 'Paste your SQL query here...';
      default:
        return 'Paste your code here...';
    }
  };

  const getOutputPlaceholder = () => {
    switch (activeTool) {
      case 'json-formatter':
        return 'Formatted JSON will appear here...';
      case 'xml-formatter':
        return 'Formatted XML will appear here...';
      case 'html-formatter':
        return 'Formatted HTML will appear here...';
      case 'sql-formatter':
        return 'Formatted SQL will appear here...';
      default:
        return 'Formatted code will appear here...';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">Code Formatters</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Format and beautify your code: JSON, XML, HTML, and SQL with proper indentation and structure
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

            {/* Formatting Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              {activeTool === 'sql-formatter' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SQL Dialect
                  </label>
                  <select
                    value={sqlDialect}
                    onChange={(e) => setSqlDialect(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="standard">Standard SQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="sqlite">SQLite</option>
                    <option value="mssql">SQL Server</option>
                  </select>
                </div>
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
                        accept=".json,.xml,.html,.sql,.txt"
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
                  onClick={handleFormat}
                  className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                  Format Code
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
                  placeholder={getOutputPlaceholder()}
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

export default Formatters;