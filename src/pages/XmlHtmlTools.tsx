import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Copy, Download, Upload, FileText, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { toast } from 'sonner';

type XmlHtmlTool = 'xml-formatter' | 'html-formatter' | 'xml-validator' | 'html-validator' | 'xpath-tester';
type IndentationType = '2' | '3' | '4' | 'tab';

interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'error' | 'warning';
}

const XmlHtmlTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<XmlHtmlTool>('xml-formatter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentation, setIndentation] = useState<IndentationType>('2');
  const [xpathQuery, setXpathQuery] = useState('');
  // const [xsdSchema, setXsdSchema] = useState(''); // TODO: Implement XSD validation
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatXml = () => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML: ' + parseError.textContent);
      }

      const formatted = formatXmlString(input, indentation);
      setOutput(formatted);
      setErrors([]);
      setIsValid(true);
      toast.success('XML formatted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid XML';
      setErrors([{ line: 1, column: 1, message: errorMessage, type: 'error' }]);
      setOutput('');
      setIsValid(false);
      toast.error('Invalid XML format');
    }
  };

  const formatHtml = () => {
    try {
      const formatted = formatHtmlString(input, indentation);
      setOutput(formatted);
      setErrors([]);
      setIsValid(true);
      toast.success('HTML formatted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error formatting HTML';
      setErrors([{ line: 1, column: 1, message: errorMessage, type: 'error' }]);
      setOutput('');
      setIsValid(false);
      toast.error('Error formatting HTML');
    }
  };

  const validateXml = () => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');
      
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML: ' + parseError.textContent);
      }

      setErrors([]);
      setIsValid(true);
      setOutput('✅ Valid XML - Well-formed document');
      toast.success('XML is valid!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid XML';
      setErrors([{ line: 1, column: 1, message: errorMessage, type: 'error' }]);
      setIsValid(false);
      setOutput(`❌ Invalid XML: ${errorMessage}`);
      toast.error('XML validation failed');
    }
  };

  const validateHtml = () => {
    try {
      // const parser = new DOMParser();
      // const htmlDoc = parser.parseFromString(input, 'text/html'); // TODO: Implement HTML validation
      
      const validationErrors: ValidationError[] = [];
      
      // Basic HTML validation checks
      if (!input.toLowerCase().includes('<!doctype')) {
        validationErrors.push({
          line: 1,
          column: 1,
          message: 'Missing DOCTYPE declaration',
          type: 'warning'
        });
      }
      
      if (!input.toLowerCase().includes('<html')) {
        validationErrors.push({
          line: 1,
          column: 1,
          message: 'Missing HTML root element',
          type: 'error'
        });
      }
      
      if (!input.toLowerCase().includes('<head')) {
        validationErrors.push({
          line: 1,
          column: 1,
          message: 'Missing HEAD element',
          type: 'warning'
        });
      }
      
      if (!input.toLowerCase().includes('<title')) {
        validationErrors.push({
          line: 1,
          column: 1,
          message: 'Missing TITLE element',
          type: 'warning'
        });
      }

      setErrors(validationErrors);
      setIsValid(validationErrors.filter(e => e.type === 'error').length === 0);
      
      if (validationErrors.length === 0) {
        setOutput('✅ Valid HTML - No issues found');
        toast.success('HTML is valid!');
      } else {
        const errorCount = validationErrors.filter(e => e.type === 'error').length;
        const warningCount = validationErrors.filter(e => e.type === 'warning').length;
        setOutput(`⚠️ HTML validation completed: ${errorCount} errors, ${warningCount} warnings`);
        toast.warning('HTML validation completed with issues');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error validating HTML';
      setErrors([{ line: 1, column: 1, message: errorMessage, type: 'error' }]);
      setIsValid(false);
      setOutput(`❌ HTML validation error: ${errorMessage}`);
      toast.error('HTML validation failed');
    }
  };

  const executeXpath = () => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');
      
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML: ' + parseError.textContent);
      }

      const result = xmlDoc.evaluate(
        xpathQuery,
        xmlDoc,
        null,
        XPathResult.ANY_TYPE,
        null
      );

      const matches: string[] = [];
      let node = result.iterateNext();
      
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          matches.push((node as Element).outerHTML || node.textContent || '');
        } else {
          matches.push(node.textContent || '');
        }
        node = result.iterateNext();
      }

      if (matches.length === 0) {
        setOutput('No matches found for the XPath query.');
      } else {
        setOutput(`Found ${matches.length} match(es):\n\n${matches.join('\n\n')}`);
      }
      
      setErrors([]);
      toast.success(`XPath executed: ${matches.length} matches found`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'XPath execution failed';
      setErrors([{ line: 1, column: 1, message: errorMessage, type: 'error' }]);
      setOutput(`❌ XPath Error: ${errorMessage}`);
      toast.error('XPath execution failed');
    }
  };

  const formatXmlString = (xml: string, indent: IndentationType): string => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const serializer = new XMLSerializer();
    
    const indentStr = indent === 'tab' ? '\t' : ' '.repeat(parseInt(indent) || 2);
    
    // Simple formatting - in a real implementation, you'd use a proper XML formatter
    const formatted = serializer.serializeToString(xmlDoc).replace(/></g, '>\n<');
    
    const lines = formatted.split('\n');
    let indentLevel = 0;
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('</')) {
        indentLevel--;
      }
      
      const result = indentStr.repeat(Math.max(0, indentLevel)) + trimmed;
      
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        indentLevel++;
      }
      
      return result;
    }).join('\n');
  };

  const formatHtmlString = (html: string, indent: IndentationType): string => {
    const indentStr = indent === 'tab' ? '\t' : ' '.repeat(parseInt(indent) || 2);
    
    // Simple HTML formatting
    const formatted = html.replace(/></g, '>\n<');
    const lines = formatted.split('\n');
    let indentLevel = 0;
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('</')) {
        indentLevel--;
      }
      
      const result = indentStr.repeat(Math.max(0, indentLevel)) + trimmed;
      
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
        indentLevel++;
      }
      
      return result;
    }).join('\n');
  };

  const handleProcess = () => {
    switch (activeTool) {
      case 'xml-formatter':
        formatXml();
        break;
      case 'html-formatter':
        formatHtml();
        break;
      case 'xml-validator':
        validateXml();
        break;
      case 'html-validator':
        validateHtml();
        break;
      case 'xpath-tester':
        executeXpath();
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
    const extension = activeTool.includes('xml') ? 'xml' : 'html';
    const blob = new Blob([output], { type: `text/${extension}` });
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
    { id: 'xml-formatter' as XmlHtmlTool, name: 'XML Formatter', icon: FileText },
    { id: 'html-formatter' as XmlHtmlTool, name: 'HTML Formatter', icon: FileText },
    { id: 'xml-validator' as XmlHtmlTool, name: 'XML Validator', icon: CheckCircle },
    { id: 'html-validator' as XmlHtmlTool, name: 'HTML Validator', icon: CheckCircle },
    { id: 'xpath-tester' as XmlHtmlTool, name: 'XPath Tester', icon: Search },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">XML/HTML Tools</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Format, validate, and test XML/HTML documents with professional tools
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
            {(activeTool === 'xml-formatter' || activeTool === 'html-formatter') && (
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
                  </select>
                </div>
              </div>
            )}

            {/* XPath Query Input */}
            {activeTool === 'xpath-tester' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  XPath Query
                </label>
                <input
                  type="text"
                  value={xpathQuery}
                  onChange={(e) => setXpathQuery(e.target.value)}
                  placeholder="e.g., //book[@id='1']/title"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
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
                        accept=".xml,.html,.htm,.txt"
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
                  placeholder={`Paste your ${activeTool.includes('xml') ? 'XML' : 'HTML'} here...`}
                  className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
                <button
                  onClick={handleProcess}
                  disabled={activeTool === 'xpath-tester' && !xpathQuery.trim()}
                  className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {activeTool === 'xml-formatter' && 'Format XML'}
                  {activeTool === 'html-formatter' && 'Format HTML'}
                  {activeTool === 'xml-validator' && 'Validate XML'}
                  {activeTool === 'html-validator' && 'Validate HTML'}
                  {activeTool === 'xpath-tester' && 'Execute XPath'}
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
                  placeholder="Formatted output will appear here..."
                  className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none"
                />
                
                {/* Validation Status */}
                {(activeTool.includes('validator')) && isValid !== null && (
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
                      {isValid ? 'Valid Document' : 'Invalid Document'}
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {errors.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {errors.map((error, index) => (
                      <div key={index} className={`p-3 rounded-md ${
                        error.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                      }`}>
                        <div className={`flex items-center ${
                          error.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <span className="font-medium">{error.type === 'error' ? 'Error' : 'Warning'}:</span>
                        </div>
                        <div className={`text-sm mt-1 ${
                          error.type === 'error' ? 'text-red-700' : 'text-yellow-700'
                        }`}>
                          Line {error.line}, Column {error.column}: {error.message}
                        </div>
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

export default XmlHtmlTools;