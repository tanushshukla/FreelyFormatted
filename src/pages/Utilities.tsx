import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Copy, Download, Upload, Type, Calculator, Shuffle, Search } from 'lucide-react';
import { toast } from 'sonner';
import validator from 'validator';

type UtilityTool = 'text-case' | 'word-count' | 'line-sort' | 'duplicate-remove' | 'text-diff' | 'regex-test' | 'password-gen' | 'lorem-ipsum' | 'email-validate' | 'url-validate' | 'credit-card-validate' | 'uuid-generate';
type TextCase = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab';
type SortOrder = 'asc' | 'desc' | 'random';

const Utilities: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTool, setActiveTool] = useState<UtilityTool>('text-case');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [textCase, setTextCase] = useState<TextCase>('upper');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [regexPattern, setRegexPattern] = useState('');
  const [regexFlags, setRegexFlags] = useState('g');
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [loremParagraphs, setLoremParagraphs] = useState(3);

  // Handle URL parameters to set active tool
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    const toolMapping: Record<string, UtilityTool> = {
      'text-case': 'text-case',
      'word-count': 'word-count',
      'line-sort': 'line-sort',
      'duplicate-remove': 'duplicate-remove',
      'text-diff': 'text-diff',
      'regex-test': 'regex-test',
      'password-gen': 'password-gen',
      'lorem-ipsum': 'lorem-ipsum',
      'email-validate': 'email-validate',
      'url-validate': 'url-validate',
      'credit-card-validate': 'credit-card-validate',
      'uuid-generate': 'uuid-generate'
    };
    
    if (toolParam && toolMapping[toolParam]) {
      setActiveTool(toolMapping[toolParam]);
    }
  }, [searchParams]);

  const convertTextCase = () => {
    try {
      let result = '';
      
      switch (textCase) {
        case 'upper':
          result = input.toUpperCase();
          break;
        case 'lower':
          result = input.toLowerCase();
          break;
        case 'title':
          result = input.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          );
          break;
        case 'sentence':
          result = input.toLowerCase().replace(/(^\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
          break;
        case 'camel':
          result = input
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
              index === 0 ? word.toLowerCase() : word.toUpperCase()
            )
            .replace(/\s+/g, '');
          break;
        case 'pascal':
          result = input
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
            .replace(/\s+/g, '');
          break;
        case 'snake':
          result = input
            .replace(/\W+/g, ' ')
            .split(/ |\s/)
            .join('_')
            .toLowerCase();
          break;
        case 'kebab':
          result = input
            .replace(/\W+/g, ' ')
            .split(/ |\s/)
            .join('-')
            .toLowerCase();
          break;
      }
      
      setOutput(result);
      toast.success('Text case converted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error converting text case';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error converting text case');
    }
  };

  const analyzeText = () => {
    try {
      const text = input.trim();
      const words = text ? text.split(/\s+/) : [];
      const lines = text ? text.split('\n') : [];
      const characters = text.length;
      const charactersNoSpaces = text.replace(/\s/g, '').length;
      const sentences = text ? text.split(/[.!?]+/).filter(s => s.trim().length > 0) : [];
      const paragraphs = text ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0) : [];
      
      const analysis = {
        characters,
        charactersNoSpaces,
        words: words.length,
        lines: lines.length,
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        averageWordsPerSentence: sentences.length > 0 ? (words.length / sentences.length).toFixed(2) : '0',
        averageCharactersPerWord: words.length > 0 ? (charactersNoSpaces / words.length).toFixed(2) : '0',
        readingTime: Math.ceil(words.length / 200) // Assuming 200 words per minute
      };
      
      const result = Object.entries(analysis)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`)
        .join('\n');
      
      setOutput(result);
      toast.success('Text analyzed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error analyzing text';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error analyzing text');
    }
  };

  const sortLines = () => {
    try {
      const lines = input.split('\n');
      let sortedLines: string[] = [];
      
      switch (sortOrder) {
        case 'asc':
          sortedLines = lines.sort((a, b) => a.localeCompare(b));
          break;
        case 'desc':
          sortedLines = lines.sort((a, b) => b.localeCompare(a));
          break;
        case 'random':
          sortedLines = lines.sort(() => Math.random() - 0.5);
          break;
      }
      
      setOutput(sortedLines.join('\n'));
      toast.success('Lines sorted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error sorting lines';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error sorting lines');
    }
  };

  const removeDuplicates = () => {
    try {
      const lines = input.split('\n');
      const uniqueLines = [...new Set(lines)];
      const duplicatesRemoved = lines.length - uniqueLines.length;
      
      setOutput(uniqueLines.join('\n'));
      toast.success(`Removed ${duplicatesRemoved} duplicate lines!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error removing duplicates';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error removing duplicates');
    }
  };

  const compareTexts = () => {
    try {
      const text1Lines = input.split('\n');
      const text2Lines = secondInput.split('\n');
      const maxLines = Math.max(text1Lines.length, text2Lines.length);
      
      const differences: string[] = [];
      
      for (let i = 0; i < maxLines; i++) {
        const line1 = text1Lines[i] || '';
        const line2 = text2Lines[i] || '';
        
        if (line1 !== line2) {
          differences.push(`Line ${i + 1}:`);
          differences.push(`  Text 1: ${line1}`);
          differences.push(`  Text 2: ${line2}`);
          differences.push('');
        }
      }
      
      if (differences.length === 0) {
        setOutput('No differences found. The texts are identical.');
      } else {
        setOutput(differences.join('\n'));
      }
      
      toast.success('Text comparison completed!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error comparing texts';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error comparing texts');
    }
  };

  const testRegex = () => {
    try {
      if (!regexPattern) {
        throw new Error('Please enter a regex pattern');
      }
      
      const regex = new RegExp(regexPattern, regexFlags);
      const matches = input.match(regex);
      
      let result = `Pattern: ${regexPattern}\nFlags: ${regexFlags}\n\n`;
      
      if (matches) {
        result += `Found ${matches.length} match(es):\n\n`;
        matches.forEach((match, index) => {
          result += `Match ${index + 1}: "${match}"\n`;
        });
      } else {
        result += 'No matches found.';
      }
      
      setOutput(result);
      toast.success('Regex test completed!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid regex pattern';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error testing regex');
    }
  };

  const generatePassword = () => {
    try {
      let charset = '';
      if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (includeNumbers) charset += '0123456789';
      if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      if (!charset) {
        throw new Error('Please select at least one character type');
      }
      
      let password = '';
      for (let i = 0; i < passwordLength; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      
      setOutput(password);
      toast.success('Password generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generating password';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error generating password');
    }
  };

  const generateLoremIpsum = () => {
    try {
      const loremText = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
        'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
        'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
        'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
        'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.'
      ];
      
      const paragraphs: string[] = [];
      for (let i = 0; i < loremParagraphs; i++) {
        const sentences = Math.floor(Math.random() * 4) + 3; // 3-6 sentences per paragraph
        const paragraph: string[] = [];
        
        for (let j = 0; j < sentences; j++) {
          paragraph.push(loremText[Math.floor(Math.random() * loremText.length)]);
        }
        
        paragraphs.push(paragraph.join(' '));
      }
      
      setOutput(paragraphs.join('\n\n'));
      toast.success('Lorem ipsum generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generating lorem ipsum';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error generating lorem ipsum');
    }
  };

  const validateEmail = () => {
    try {
      const emails = input.split('\n').filter(email => email.trim());
      const results: string[] = [];
      
      emails.forEach(email => {
        const trimmedEmail = email.trim();
        const isValid = validator.isEmail(trimmedEmail);
        results.push(`${trimmedEmail}: ${isValid ? 'Valid' : 'Invalid'}`);
      });
      
      setOutput(results.join('\n'));
      toast.success('Email validation completed!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error validating emails';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error validating emails');
    }
  };

  const validateUrl = () => {
    try {
      const urls = input.split('\n').filter(url => url.trim());
      const results: string[] = [];
      
      urls.forEach(url => {
        const trimmedUrl = url.trim();
        const isValid = validator.isURL(trimmedUrl);
        results.push(`${trimmedUrl}: ${isValid ? 'Valid' : 'Invalid'}`);
      });
      
      setOutput(results.join('\n'));
      toast.success('URL validation completed!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error validating URLs';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error validating URLs');
    }
  };

  const validateCreditCard = () => {
    try {
      const cards = input.split('\n').filter(card => card.trim());
      const results: string[] = [];
      
      cards.forEach(card => {
        const trimmedCard = card.trim().replace(/\s/g, '');
        const isValid = validator.isCreditCard(trimmedCard);
        results.push(`${trimmedCard}: ${isValid ? 'Valid' : 'Invalid'}`);
      });
      
      setOutput(results.join('\n'));
      toast.success('Credit card validation completed!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error validating credit cards';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error validating credit cards');
    }
  };

  const generateUUID = () => {
    try {
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      
      setOutput(uuid);
      toast.success('UUID generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generating UUID';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error generating UUID');
    }
  };

  const handleProcess = () => {
    switch (activeTool) {
      case 'text-case':
        convertTextCase();
        break;
      case 'word-count':
        analyzeText();
        break;
      case 'line-sort':
        sortLines();
        break;
      case 'duplicate-remove':
        removeDuplicates();
        break;
      case 'text-diff':
        compareTexts();
        break;
      case 'regex-test':
        testRegex();
        break;
      case 'password-gen':
        generatePassword();
        break;
      case 'lorem-ipsum':
        generateLoremIpsum();
        break;
      case 'email-validate':
        validateEmail();
        break;
      case 'url-validate':
        validateUrl();
        break;
      case 'credit-card-validate':
        validateCreditCard();
        break;
      case 'uuid-generate':
        generateUUID();
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
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTool}.txt`;
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
    { id: 'text-case' as UtilityTool, name: 'Text Case', icon: Type },
    { id: 'word-count' as UtilityTool, name: 'Text Analysis', icon: Calculator },
    { id: 'line-sort' as UtilityTool, name: 'Sort Lines', icon: Shuffle },
    { id: 'duplicate-remove' as UtilityTool, name: 'Remove Duplicates', icon: Shuffle },
    { id: 'text-diff' as UtilityTool, name: 'Text Diff', icon: Search },
    { id: 'regex-test' as UtilityTool, name: 'Regex Tester', icon: Search },
    { id: 'password-gen' as UtilityTool, name: 'Password Gen', icon: Shuffle },
    { id: 'lorem-ipsum' as UtilityTool, name: 'Lorem Ipsum', icon: Type },
    { id: 'email-validate' as UtilityTool, name: 'Email Validator', icon: Search },
    { id: 'url-validate' as UtilityTool, name: 'URL Validator', icon: Search },
    { id: 'credit-card-validate' as UtilityTool, name: 'Card Validator', icon: Search },
    { id: 'uuid-generate' as UtilityTool, name: 'UUID Generator', icon: Shuffle },
  ];

  const getPlaceholder = () => {
    switch (activeTool) {
      case 'text-case':
        return 'Enter text to convert case...';
      case 'word-count':
        return 'Enter text to analyze...';
      case 'line-sort':
      case 'duplicate-remove':
        return 'Enter lines of text (one per line)...';
      case 'text-diff':
        return 'Enter first text to compare...';
      case 'regex-test':
        return 'Enter text to test against regex pattern...';
      case 'email-validate':
        return 'Enter email addresses (one per line)...';
      case 'url-validate':
        return 'Enter URLs (one per line)...';
      case 'credit-card-validate':
        return 'Enter credit card numbers (one per line)...';
      case 'password-gen':
      case 'lorem-ipsum':
      case 'uuid-generate':
        return 'Click the button to generate...';
      default:
        return 'Enter your text here...';
    }
  };

  const requiresSecondInput = activeTool === 'text-diff';
  const requiresRegexPattern = activeTool === 'regex-test';
  const isGenerator = ['password-gen', 'lorem-ipsum', 'uuid-generate'].includes(activeTool);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">Text Utilities</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful text manipulation, analysis, validation, and generation tools
            </p>
          </div>

          {/* Tool Selector */}
          <div className="bg-white border-2 border-black rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
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

            {/* Tool Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Text Case Options */}
              {activeTool === 'text-case' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Case Type
                  </label>
                  <select
                    value={textCase}
                    onChange={(e) => setTextCase(e.target.value as TextCase)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="upper">UPPERCASE</option>
                    <option value="lower">lowercase</option>
                    <option value="title">Title Case</option>
                    <option value="sentence">Sentence case</option>
                    <option value="camel">camelCase</option>
                    <option value="pascal">PascalCase</option>
                    <option value="snake">snake_case</option>
                    <option value="kebab">kebab-case</option>
                  </select>
                </div>
              )}

              {/* Sort Options */}
              {activeTool === 'line-sort' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="asc">Ascending (A-Z)</option>
                    <option value="desc">Descending (Z-A)</option>
                    <option value="random">Random</option>
                  </select>
                </div>
              )}

              {/* Regex Options */}
              {requiresRegexPattern && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regex Pattern
                    </label>
                    <input
                      type="text"
                      value={regexPattern}
                      onChange={(e) => setRegexPattern(e.target.value)}
                      placeholder="Enter regex pattern..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flags
                    </label>
                    <input
                      type="text"
                      value={regexFlags}
                      onChange={(e) => setRegexFlags(e.target.value)}
                      placeholder="g, i, m, s, u, y"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </>
              )}

              {/* Password Generator Options */}
              {activeTool === 'password-gen' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Length
                    </label>
                    <input
                      type="number"
                      min="4"
                      max="128"
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Character Types
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={includeUppercase}
                          onChange={(e) => setIncludeUppercase(e.target.checked)}
                          className="mr-2"
                        />
                        Uppercase (A-Z)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={includeLowercase}
                          onChange={(e) => setIncludeLowercase(e.target.checked)}
                          className="mr-2"
                        />
                        Lowercase (a-z)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={includeNumbers}
                          onChange={(e) => setIncludeNumbers(e.target.checked)}
                          className="mr-2"
                        />
                        Numbers (0-9)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={includeSymbols}
                          onChange={(e) => setIncludeSymbols(e.target.checked)}
                          className="mr-2"
                        />
                        Symbols (!@#$...)
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Lorem Ipsum Options */}
              {activeTool === 'lorem-ipsum' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Paragraphs
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={loremParagraphs}
                    onChange={(e) => setLoremParagraphs(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
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
                  <h3 className="text-lg font-semibold text-black">
                    {requiresSecondInput ? 'First Text' : 'Input'}
                  </h3>
                  <div className="flex gap-2">
                    {!isGenerator && (
                      <label className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                        <Upload className="h-4 w-4 inline mr-1" />
                        Upload
                        <input
                          type="file"
                          accept=".txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getPlaceholder()}
                  disabled={isGenerator}
                  className="w-full h-64 p-4 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none disabled:bg-gray-100"
                />
                
                {/* Second Input for Text Diff */}
                {requiresSecondInput && (
                  <>
                    <h4 className="text-md font-semibold text-black mt-4 mb-2">Second Text</h4>
                    <textarea
                      value={secondInput}
                      onChange={(e) => setSecondInput(e.target.value)}
                      placeholder="Enter second text to compare..."
                      className="w-full h-64 p-4 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    />
                  </>
                )}
                
                <button
                  onClick={handleProcess}
                  className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                  {activeTool === 'text-case' && 'Convert Case'}
                  {activeTool === 'word-count' && 'Analyze Text'}
                  {activeTool === 'line-sort' && 'Sort Lines'}
                  {activeTool === 'duplicate-remove' && 'Remove Duplicates'}
                  {activeTool === 'text-diff' && 'Compare Texts'}
                  {activeTool === 'regex-test' && 'Test Regex'}
                  {activeTool === 'password-gen' && 'Generate Password'}
                  {activeTool === 'lorem-ipsum' && 'Generate Lorem Ipsum'}
                  {activeTool === 'email-validate' && 'Validate Emails'}
                  {activeTool === 'url-validate' && 'Validate URLs'}
                  {activeTool === 'credit-card-validate' && 'Validate Cards'}
                  {activeTool === 'uuid-generate' && 'Generate UUID'}
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
                  placeholder="Result will appear here..."
                  className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Utilities;