import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Copy, Download, Upload, CheckCircle, XCircle, Clock, CreditCard, Calendar, Hash } from 'lucide-react';
import { toast } from 'sonner';

type ValidatorTool = 'xml-validator' | 'json-validator' | 'html-validator' | 'xpath-tester' | 'credit-card-generator' | 'regex-tester' | 'java-regex-tester' | 'cron-generator';

const Validators: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTool, setSelectedTool] = useState<ValidatorTool>('xml-validator');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [regexPattern, setRegexPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [regexFlags, setRegexFlags] = useState('');
  const [xpathExpression, setXpathExpression] = useState('');
  const [cronExpression, setCronExpression] = useState('0 0 12 * * ?');
  const [creditCardType, setCreditCardType] = useState('visa');
  const [creditCardCount, setCreditCardCount] = useState(5);

  const tools = [
    { id: 'xml-validator', name: 'XML Validator', icon: CheckCircle },
    { id: 'json-validator', name: 'JSON Validator', icon: CheckCircle },
    { id: 'html-validator', name: 'HTML Validator', icon: CheckCircle },
    { id: 'xpath-tester', name: 'XPath Tester', icon: Hash },
    { id: 'credit-card-generator', name: 'Credit Card Generator', icon: CreditCard },
    { id: 'regex-tester', name: 'Regular Expression Tester', icon: Hash },
    { id: 'java-regex-tester', name: 'Java Regular Expression Tester', icon: Hash },
    { id: 'cron-generator', name: 'Cron Expression Generator', icon: Calendar },
  ];

  useEffect(() => {
    const tool = searchParams.get('tool') as ValidatorTool;
    if (tool && tools.find(t => t.id === tool)) {
      setSelectedTool(tool);
    }
  }, [searchParams]);

  useEffect(() => {
    setSearchParams({ tool: selectedTool });
    setInput('');
    setOutput('');
    setIsValid(null);
  }, [selectedTool, setSearchParams]);

  const validateXML = (xmlString: string): { isValid: boolean; message: string } => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'application/xml');
      const parseError = doc.querySelector('parsererror');
      
      if (parseError) {
        return { isValid: false, message: parseError.textContent || 'Invalid XML' };
      }
      return { isValid: true, message: 'Valid XML document' };
    } catch (error) {
      return { isValid: false, message: 'Invalid XML: ' + (error as Error).message };
    }
  };

  const validateJSON = (jsonString: string): { isValid: boolean; message: string } => {
    try {
      JSON.parse(jsonString);
      return { isValid: true, message: 'Valid JSON' };
    } catch (error) {
      return { isValid: false, message: 'Invalid JSON: ' + (error as Error).message };
    }
  };

  const validateHTML = (htmlString: string): { isValid: boolean; message: string } => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      
      // Basic HTML validation - check for common issues
      const errors: string[] = [];
      
      // Check for unclosed tags (basic check)
      const openTags = htmlString.match(/<[^/][^>]*>/g) || [];
      const closeTags = htmlString.match(/<\/[^>]*>/g) || [];
      
      if (openTags.length !== closeTags.length) {
        errors.push('Possible unclosed tags detected');
      }
      
      if (errors.length > 0) {
        return { isValid: false, message: errors.join(', ') };
      }
      
      return { isValid: true, message: 'HTML appears to be well-formed' };
    } catch (error) {
      return { isValid: false, message: 'Invalid HTML: ' + (error as Error).message };
    }
  };

  const testXPath = (xml: string, xpath: string): { isValid: boolean; message: string; result?: any } => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'application/xml');
      
      const result = document.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
      const nodes = [];
      let node = result.iterateNext();
      
      while (node) {
        nodes.push(node.textContent || node.nodeValue || node.nodeName);
        node = result.iterateNext();
      }
      
      return {
        isValid: true,
        message: `XPath executed successfully. Found ${nodes.length} result(s).`,
        result: nodes
      };
    } catch (error) {
      return { isValid: false, message: 'XPath error: ' + (error as Error).message };
    }
  };

  const testRegex = (pattern: string, testStr: string, flags: string): { isValid: boolean; message: string; matches?: string[] } => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = testStr.match(regex);
      
      return {
        isValid: true,
        message: matches ? `Pattern matched! Found ${matches.length} match(es).` : 'Pattern did not match.',
        matches: matches || []
      };
    } catch (error) {
      return { isValid: false, message: 'Regex error: ' + (error as Error).message };
    }
  };

  const generateCreditCards = (type: string, count: number): string[] => {
    const prefixes = {
      visa: ['4'],
      mastercard: ['51', '52', '53', '54', '55'],
      amex: ['34', '37'],
      discover: ['6011', '65']
    };
    
    const cards: string[] = [];
    const typePrefixes = prefixes[type as keyof typeof prefixes] || prefixes.visa;
    
    for (let i = 0; i < count; i++) {
      const prefix = typePrefixes[Math.floor(Math.random() * typePrefixes.length)];
      let cardNumber = prefix;
      
      // Generate remaining digits
      const targetLength = type === 'amex' ? 15 : 16;
      while (cardNumber.length < targetLength - 1) {
        cardNumber += Math.floor(Math.random() * 10).toString();
      }
      
      // Calculate Luhn check digit
      let sum = 0;
      let alternate = false;
      
      for (let j = cardNumber.length - 1; j >= 0; j--) {
        let digit = parseInt(cardNumber.charAt(j));
        
        if (alternate) {
          digit *= 2;
          if (digit > 9) {
            digit = (digit % 10) + 1;
          }
        }
        
        sum += digit;
        alternate = !alternate;
      }
      
      const checkDigit = (10 - (sum % 10)) % 10;
      cardNumber += checkDigit.toString();
      
      cards.push(cardNumber);
    }
    
    return cards;
  };

  const generateCronDescription = (cron: string): string => {
    const parts = cron.split(' ');
    if (parts.length !== 6) return 'Invalid cron expression format';
    
    const [second, minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    
    let description = 'Runs ';
    
    if (second === '0' && minute === '0' && hour === '0') {
      description += 'daily at midnight';
    } else if (second === '0' && minute === '0') {
      description += `daily at ${hour}:00`;
    } else if (second === '0') {
      description += `at ${hour}:${minute.padStart(2, '0')}`;
    } else {
      description += `at ${hour}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
    }
    
    if (dayOfWeek !== '*' && dayOfWeek !== '?') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      description += ` on ${days[parseInt(dayOfWeek)] || dayOfWeek}`;
    }
    
    return description;
  };

  const handleValidate = () => {
    let result: { isValid: boolean; message: string; result?: any; matches?: string[] };
    
    switch (selectedTool) {
      case 'xml-validator':
        result = validateXML(input);
        break;
      case 'json-validator':
        result = validateJSON(input);
        break;
      case 'html-validator':
        result = validateHTML(input);
        break;
      case 'xpath-tester':
        result = testXPath(input, xpathExpression);
        if (result.result) {
          setOutput(result.result.join('\n'));
        }
        break;
      case 'regex-tester':
      case 'java-regex-tester':
        result = testRegex(regexPattern, testString, regexFlags);
        if (result.matches) {
          setOutput(result.matches.join('\n'));
        }
        break;
      case 'credit-card-generator':
        const cards = generateCreditCards(creditCardType, creditCardCount);
        setOutput(cards.join('\n'));
        result = { isValid: true, message: `Generated ${cards.length} credit card numbers` };
        break;
      case 'cron-generator':
        const description = generateCronDescription(cronExpression);
        setOutput(description);
        result = { isValid: true, message: 'Cron expression parsed successfully' };
        break;
      default:
        result = { isValid: false, message: 'Unknown validation tool' };
    }
    
    setIsValid(result.isValid);
    toast(result.message, { 
      icon: result.isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTool}-result.txt`;
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
      };
      reader.readAsText(file);
    }
  };

  const getPlaceholder = () => {
    switch (selectedTool) {
      case 'xml-validator':
        return '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <element>value</element>\n</root>';
      case 'json-validator':
        return '{\n  "name": "John Doe",\n  "age": 30,\n  "city": "New York"\n}';
      case 'html-validator':
        return '<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>';
      case 'xpath-tester':
        return '<?xml version="1.0"?>\n<catalog>\n  <book id="1">\n    <title>XML Guide</title>\n    <author>John Smith</author>\n  </book>\n</catalog>';
      case 'regex-tester':
      case 'java-regex-tester':
        return 'Enter your test string here...';
      default:
        return 'Enter your content here...';
    }
  };

  const getOutputPlaceholder = () => {
    switch (selectedTool) {
      case 'credit-card-generator':
        return 'Generated credit card numbers will appear here...';
      case 'cron-generator':
        return 'Cron expression description will appear here...';
      case 'xpath-tester':
        return 'XPath results will appear here...';
      case 'regex-tester':
      case 'java-regex-tester':
        return 'Regex matches will appear here...';
      default:
        return 'Validation results will appear here...';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Validators & Testers</h1>
          <p className="text-gray-600">
            Validate data formats, test expressions, and generate test data with our comprehensive validation tools.
          </p>
        </div>

        {/* Tool Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id as ValidatorTool)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedTool === tool.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{tool.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Input</h2>
              <div className="flex space-x-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".txt,.xml,.json,.html"
                  />
                  <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Upload</span>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Special inputs for specific tools */}
            {(selectedTool === 'regex-tester' || selectedTool === 'java-regex-tester') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regular Expression Pattern
                  </label>
                  <input
                    type="text"
                    value={regexPattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                    placeholder="Enter regex pattern (e.g., \\d{3}-\\d{3}-\\d{4})"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flags (optional)
                  </label>
                  <input
                    type="text"
                    value={regexFlags}
                    onChange={(e) => setRegexFlags(e.target.value)}
                    placeholder="g, i, m, s, u, y"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test String
                  </label>
                  <textarea
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
              </div>
            )}
            
            {selectedTool === 'xpath-tester' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    XPath Expression
                  </label>
                  <input
                    type="text"
                    value={xpathExpression}
                    onChange={(e) => setXpathExpression(e.target.value)}
                    placeholder="//book/title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    XML Document
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
              </div>
            )}
            
            {selectedTool === 'credit-card-generator' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Type
                  </label>
                  <select
                    value={creditCardType}
                    onChange={(e) => setCreditCardType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Cards
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={creditCardCount}
                    onChange={(e) => setCreditCardCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
            
            {selectedTool === 'cron-generator' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cron Expression (Quartz Format)
                </label>
                <input
                  type="text"
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  placeholder="0 0 12 * * ?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: second minute hour day-of-month month day-of-week
                </p>
              </div>
            )}
            
            {!['regex-tester', 'java-regex-tester', 'xpath-tester', 'credit-card-generator', 'cron-generator'].includes(selectedTool) && (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            )}
            
            <button
              onClick={handleValidate}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {selectedTool === 'credit-card-generator' ? 'Generate' : 
               selectedTool === 'cron-generator' ? 'Parse Expression' :
               selectedTool.includes('tester') ? 'Test' : 'Validate'}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Result</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span className="text-sm">Copy</span>
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!output}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>
            
            {/* Validation Status */}
            {isValid !== null && (
              <div className={`p-3 rounded-md flex items-center space-x-2 ${
                isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {isValid ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <span className="text-sm font-medium">
                  {isValid ? 'Valid' : 'Invalid'}
                </span>
              </div>
            )}
            
            <textarea
              value={output}
              readOnly
              placeholder={getOutputPlaceholder()}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Validators;