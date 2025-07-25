import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Copy, Download, Type, Globe, Code, Book } from 'lucide-react';
import { toast } from 'sonner';

type WebResourceTool = 'lorem-ipsum' | 'mime-types' | 'html-entities' | 'i18n-standards';

const WebResources: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTool, setActiveTool] = useState<WebResourceTool>('lorem-ipsum');
  const [output, setOutput] = useState('');
  const [paragraphCount, setParagraphCount] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const toolParam = searchParams.get('tool');
    const toolMapping: Record<string, WebResourceTool> = {
      'lorem-ipsum': 'lorem-ipsum',
      'mime-types': 'mime-types',
      'html-entities': 'html-entities',
      'i18n-standards': 'i18n-standards'
    };
    
    if (toolParam && toolMapping[toolParam]) {
      setActiveTool(toolMapping[toolParam]);
    }
  }, [searchParams]);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const mimeTypes = [
    { extension: '.txt', mimeType: 'text/plain', description: 'Plain text file' },
    { extension: '.html', mimeType: 'text/html', description: 'HTML document' },
    { extension: '.css', mimeType: 'text/css', description: 'Cascading Style Sheets' },
    { extension: '.js', mimeType: 'application/javascript', description: 'JavaScript file' },
    { extension: '.json', mimeType: 'application/json', description: 'JSON data' },
    { extension: '.xml', mimeType: 'application/xml', description: 'XML document' },
    { extension: '.pdf', mimeType: 'application/pdf', description: 'PDF document' },
    { extension: '.zip', mimeType: 'application/zip', description: 'ZIP archive' },
    { extension: '.jpg', mimeType: 'image/jpeg', description: 'JPEG image' },
    { extension: '.png', mimeType: 'image/png', description: 'PNG image' },
    { extension: '.gif', mimeType: 'image/gif', description: 'GIF image' },
    { extension: '.svg', mimeType: 'image/svg+xml', description: 'SVG vector image' },
    { extension: '.mp3', mimeType: 'audio/mpeg', description: 'MP3 audio' },
    { extension: '.mp4', mimeType: 'video/mp4', description: 'MP4 video' },
    { extension: '.csv', mimeType: 'text/csv', description: 'Comma-separated values' }
  ];

  const htmlEntities = [
    { entity: '&amp;', character: '&', description: 'Ampersand' },
    { entity: '&lt;', character: '<', description: 'Less than' },
    { entity: '&gt;', character: '>', description: 'Greater than' },
    { entity: '&quot;', character: '"', description: 'Double quote' },
    { entity: '&nbsp;', character: ' ', description: 'Non-breaking space' },
    { entity: '&copy;', character: '©', description: 'Copyright symbol' },
    { entity: '&reg;', character: '®', description: 'Registered trademark' },
    { entity: '&trade;', character: '™', description: 'Trademark symbol' },
    { entity: '&euro;', character: '€', description: 'Euro symbol' },
    { entity: '&pound;', character: '£', description: 'Pound symbol' },
    { entity: '&yen;', character: '¥', description: 'Yen symbol' },
    { entity: '&cent;', character: '¢', description: 'Cent symbol' }
  ];

  const i18nStandards = [
    {
      category: 'Language Codes (ISO 639-1)',
      items: [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'zh', name: 'Chinese' }
      ]
    },
    {
      category: 'Country Codes (ISO 3166-1)',
      items: [
        { code: 'US', name: 'United States' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'CA', name: 'Canada' },
        { code: 'AU', name: 'Australia' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'ES', name: 'Spain' },
        { code: 'IT', name: 'Italy' },
        { code: 'JP', name: 'Japan' },
        { code: 'CN', name: 'China' }
      ]
    },
    {
      category: 'Currency Codes (ISO 4217)',
      items: [
        { code: 'USD', name: 'US Dollar' },
        { code: 'EUR', name: 'Euro' },
        { code: 'GBP', name: 'British Pound' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'CHF', name: 'Swiss Franc' },
        { code: 'CNY', name: 'Chinese Yuan' },
        { code: 'INR', name: 'Indian Rupee' },
        { code: 'KRW', name: 'South Korean Won' }
      ]
    }
  ];

  const generateLoremIpsum = () => {
    const paragraphs = [];
    
    for (let p = 0; p < paragraphCount; p++) {
      const words = [];
      
      if (p === 0 && startWithLorem) {
        words.push('Lorem', 'ipsum');
      }
      
      const remainingWords = wordsPerParagraph - words.length;
      for (let w = 0; w < remainingWords; w++) {
        const randomWord = loremWords[Math.floor(Math.random() * loremWords.length)];
        words.push(randomWord);
      }
      
      if (words.length > 0) {
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        const paragraph = words.join(' ') + '.';
        paragraphs.push(paragraph);
      }
    }
    
    setOutput(paragraphs.join('\n\n'));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded successfully!');
  };

  const tools = [
    {
      id: 'lorem-ipsum',
      name: 'Lorem Ipsum Generator',
      icon: Type,
      category: 'Web Resources'
    },
    {
      id: 'mime-types',
      name: 'MIME Types List',
      icon: Globe,
      category: 'Web Resources'
    },
    {
      id: 'html-entities',
      name: 'HTML Entities',
      icon: Code,
      category: 'Web Resources'
    },
    {
      id: 'i18n-standards',
      name: 'I18N Standards',
      icon: Book,
      category: 'Web Resources'
    }
  ];

  const filteredMimeTypes = mimeTypes.filter(item => 
    item.extension.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.mimeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHtmlEntities = htmlEntities.filter(item => 
    item.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.character.includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredI18nStandards = i18nStandards.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const renderLoremIpsumTool = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Paragraphs
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={paragraphCount}
            onChange={(e) => setParagraphCount(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Words per Paragraph
          </label>
          <input
            type="number"
            min="10"
            max="200"
            value={wordsPerParagraph}
            onChange={(e) => setWordsPerParagraph(parseInt(e.target.value) || 50)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Start with Lorem ipsum
            </span>
          </label>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={generateLoremIpsum}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Generate Lorem Ipsum
        </button>
        {output && (
          <>
            <button
              onClick={() => copyToClipboard(output)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={() => downloadAsFile(output, 'lorem-ipsum.txt')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </>
        )}
      </div>
      
      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Generated Lorem Ipsum
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
      )}
    </div>
  );

  const renderMimeTypesTool = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search MIME Types
        </label>
        <input
          type="text"
          placeholder="Search by extension, MIME type, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Extension
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                MIME Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMimeTypes.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.extension}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {item.mimeType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHtmlEntitiesTool = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search HTML Entities
        </label>
        <input
          type="text"
          placeholder="Search by entity, character, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Entity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Character
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredHtmlEntities.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {item.entity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center text-lg">
                  {item.character}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderI18nStandardsTool = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search I18N Standards
        </label>
        <input
          type="text"
          placeholder="Search by code or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {filteredI18nStandards.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Name
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {category.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {item.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );

  const renderToolContent = () => {
    switch (activeTool) {
      case 'lorem-ipsum':
        return renderLoremIpsumTool();
      case 'mime-types':
        return renderMimeTypesTool();
      case 'html-entities':
        return renderHtmlEntitiesTool();
      case 'i18n-standards':
        return renderI18nStandardsTool();
      default:
        return renderLoremIpsumTool();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">Web Resources</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Essential web development resources including Lorem Ipsum generator, MIME types, HTML entities, and internationalization standards.
            </p>
          </div>

          {/* Tool Selector */}
          <div className="bg-white border-2 border-black rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id as WebResourceTool)}
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
          </div>

          {/* Tool Content */}
          <div className="bg-white border-2 border-black rounded-lg p-6">
            {renderToolContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WebResources;