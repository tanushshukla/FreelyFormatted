import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/json-tools', label: 'JSON Tools' },
    { path: '/xml-html-tools', label: 'XML/HTML Tools' },
    { path: '/code-tools', label: 'Code Tools' },
    { path: '/formatters', label: 'Formatters' },
    { path: '/converters', label: 'Converters' },
    { path: '/encoders-crypto', label: 'Encoders/Crypto' },
    { path: '/utilities', label: 'Utilities' },
    { path: '/validators', label: 'Validators' },
  ];

  const allTools = [
    // JSON Tools
    { name: 'JSON Formatter', category: 'JSON Tools', path: '/json-tools' },
    { name: 'JSON Validator', category: 'JSON Tools', path: '/json-tools' },
    { name: 'JSON Escape/Unescape', category: 'JSON Tools', path: '/json-tools' },
    
    // XML/HTML Tools
    { name: 'XML Formatter', category: 'XML/HTML Tools', path: '/xml-html-tools' },
    { name: 'HTML Formatter', category: 'XML/HTML Tools', path: '/xml-html-tools' },
    { name: 'XML Validator', category: 'XML/HTML Tools', path: '/xml-html-tools' },
    { name: 'HTML Validator', category: 'XML/HTML Tools', path: '/xml-html-tools' },
    { name: 'XPath Tester', category: 'XML/HTML Tools', path: '/xml-html-tools' },
    
    // Code Tools
    { name: 'JavaScript Beautifier', category: 'Code Tools', path: '/code-tools' },
    { name: 'JavaScript Minifier', category: 'Code Tools', path: '/code-tools' },
    { name: 'CSS Beautifier', category: 'Code Tools', path: '/code-tools' },
    { name: 'CSS Minifier', category: 'Code Tools', path: '/code-tools' },
    
    // Formatters
    { name: 'JSON Formatter', category: 'Formatters', path: '/formatters' },
    { name: 'XML Formatter', category: 'Formatters', path: '/formatters' },
    { name: 'HTML Formatter', category: 'Formatters', path: '/formatters' },
    { name: 'SQL Formatter', category: 'Formatters', path: '/formatters' },
    
    // Converters
    { name: 'JSON to YAML', category: 'Converters', path: '/converters' },
    { name: 'YAML to JSON', category: 'Converters', path: '/converters' },
    { name: 'JSON to CSV', category: 'Converters', path: '/converters' },
    { name: 'CSV to JSON', category: 'Converters', path: '/converters' },
    { name: 'XML to JSON', category: 'Converters', path: '/converters' },
    { name: 'JSON to XML', category: 'Converters', path: '/converters' },
    { name: 'CSV to XML', category: 'Converters', path: '/converters' },
    { name: 'Base64 Encode', category: 'Converters', path: '/converters' },
    { name: 'Base64 Decode', category: 'Converters', path: '/converters' },
    { name: 'URL Encode', category: 'Converters', path: '/converters' },
    { name: 'URL Decode', category: 'Converters', path: '/converters' },
    { name: 'Epoch to Date', category: 'Converters', path: '/converters' },
    { name: 'Date to Epoch', category: 'Converters', path: '/converters' },
    { name: 'XSD Generator', category: 'Converters', path: '/converters' },
    { name: 'XSLT Transformer', category: 'Converters', path: '/converters' },
    
    // Encoders/Crypto
    { name: 'MD5 Hash', category: 'Encoders/Crypto', path: '/encoders-crypto' },
    { name: 'SHA1 Hash', category: 'Encoders/Crypto', path: '/encoders-crypto' },
    { name: 'SHA256 Hash', category: 'Encoders/Crypto', path: '/encoders-crypto' },
    { name: 'SHA512 Hash', category: 'Encoders/Crypto', path: '/encoders-crypto' },
    { name: 'AES Encrypt', category: 'Encoders/Crypto', path: '/encoders-crypto' },
    { name: 'AES Decrypt', category: 'Encoders/Crypto', path: '/encoders-crypto' },
    { name: 'QR Code Generator', category: 'Encoders/Crypto', path: '/encoders-crypto' },
    { name: 'HTML Encode', category: 'Encoders/Crypto', path: '/encoders-crypto' },
    { name: 'HTML Decode', category: 'Encoders/Crypto', path: '/encoders-crypto' },
    
    // Utilities
    { name: 'Text Case Converter', category: 'Utilities', path: '/utilities' },
    { name: 'Word Count', category: 'Utilities', path: '/utilities' },
    { name: 'Line Sort', category: 'Utilities', path: '/utilities' },
    { name: 'Remove Duplicates', category: 'Utilities', path: '/utilities' },
    { name: 'Text Diff', category: 'Utilities', path: '/utilities' },
    { name: 'Password Generator', category: 'Utilities', path: '/utilities' },
    { name: 'Lorem Ipsum Generator', category: 'Utilities', path: '/utilities' },
    { name: 'Email Validator', category: 'Utilities', path: '/utilities' },
    { name: 'URL Validator', category: 'Utilities', path: '/utilities' },
    { name: 'UUID Generator', category: 'Utilities', path: '/utilities' },
    
    // Validators
    { name: 'Regular Expression Tester', category: 'Validators', path: '/validators' },
    { name: 'Java Regex Tester', category: 'Validators', path: '/validators' },
    { name: 'Cron Expression Generator', category: 'Validators', path: '/validators' },
    { name: 'Credit Card Generator', category: 'Validators', path: '/validators' },
  ];

  const filteredTools = allTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <span className="text-black font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold">FreeFormatter</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-white border-b-2 border-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        {showSidebar && (
          <aside className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Tools</h3>
              
              {/* Search Results */}
              {searchQuery && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Search Results</h4>
                  <div className="space-y-1">
                    {filteredTools.map((tool, index) => (
                      <Link
                        key={index}
                        to={tool.path}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {tool.name}
                        <span className="text-xs text-gray-400 ml-2">({tool.category})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tool Categories */}
              {!searchQuery && (
                <div className="space-y-6">
                  {/* JSON Tools */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">JSON Tools</h4>
                    <div className="space-y-1">
                      <Link to="/json-tools?tool=formatter" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">JSON Formatter</Link>
                      <Link to="/json-tools?tool=validator" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">JSON Validator</Link>
                      <Link to="/json-tools?tool=escape" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">JSON Escape/Unescape</Link>
                    </div>
                  </div>
                  
                  {/* XML/HTML Tools */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">XML/HTML Tools</h4>
                    <div className="space-y-1">
                      <Link to="/xml-html-tools?tool=xml-formatter" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">XML Formatter</Link>
                      <Link to="/xml-html-tools?tool=html-formatter" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">HTML Formatter</Link>
                      <Link to="/xml-html-tools?tool=xml-validator" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">XML Validator</Link>
                      <Link to="/xml-html-tools?tool=html-validator" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">HTML Validator</Link>
                      <Link to="/xml-html-tools?tool=xpath-tester" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">XPath Tester</Link>
                    </div>
                  </div>
                  
                  {/* Code Tools */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Code Tools</h4>
                    <div className="space-y-1">
                      <Link to="/code-tools?tool=js-beautifier" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">JavaScript Beautifier</Link>
                      <Link to="/code-tools?tool=js-minifier" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">JavaScript Minifier</Link>
                      <Link to="/code-tools?tool=css-beautifier" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">CSS Beautifier</Link>
                      <Link to="/code-tools?tool=css-minifier" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">CSS Minifier</Link>
                    </div>
                  </div>
                  
                  {/* Formatters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Formatters</h4>
                    <div className="space-y-1">
                      <Link to="/formatters?tool=json" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">JSON Formatter</Link>
                      <Link to="/formatters?tool=xml" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">XML Formatter</Link>
                      <Link to="/formatters?tool=html" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">HTML Formatter</Link>
                      <Link to="/formatters?tool=sql" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">SQL Formatter</Link>
                    </div>
                  </div>
                  
                  {/* Converters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Converters</h4>
                    <div className="space-y-1">
                      <Link to="/converters?tool=json-to-yaml" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">JSON to YAML</Link>
                      <Link to="/converters?tool=yaml-to-json" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">YAML to JSON</Link>
                      <Link to="/converters?tool=json-to-csv" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">JSON to CSV</Link>
                      <Link to="/converters?tool=csv-to-json" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">CSV to JSON</Link>
                      <Link to="/converters?tool=xml-to-json" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">XML to JSON</Link>
                      <Link to="/converters?tool=json-to-xml" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">JSON to XML</Link>
                      <Link to="/converters?tool=csv-to-xml" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">CSV to XML</Link>
                      <Link to="/converters?tool=base64-encode" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Base64 Encode</Link>
                      <Link to="/converters?tool=base64-decode" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Base64 Decode</Link>
                      <Link to="/converters?tool=url-encode" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">URL Encode</Link>
                      <Link to="/converters?tool=url-decode" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">URL Decode</Link>
                      <Link to="/converters?tool=epoch-to-date" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Epoch to Date</Link>
                      <Link to="/converters?tool=date-to-epoch" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Date to Epoch</Link>
                      <Link to="/converters?tool=xsd-generator" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">XSD Generator</Link>
                      <Link to="/converters?tool=xslt-transformer" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">XSLT Transformer</Link>
                    </div>
                  </div>
                  
                  {/* Encoders/Crypto */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Encoders/Crypto</h4>
                    <div className="space-y-1">
                      <Link to="/encoders-crypto?tool=md5" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">MD5 Hash</Link>
                      <Link to="/encoders-crypto?tool=sha1" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">SHA1 Hash</Link>
                      <Link to="/encoders-crypto?tool=sha256" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">SHA256 Hash</Link>
                      <Link to="/encoders-crypto?tool=sha512" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">SHA512 Hash</Link>
                      <Link to="/encoders-crypto?tool=aes-encrypt" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">AES Encrypt</Link>
                      <Link to="/encoders-crypto?tool=aes-decrypt" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">AES Decrypt</Link>
                      <Link to="/encoders-crypto?tool=qr-generator" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">QR Code Generator</Link>
                      <Link to="/encoders-crypto?tool=html-encode" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">HTML Encode</Link>
                      <Link to="/encoders-crypto?tool=html-decode" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">HTML Decode</Link>
                    </div>
                  </div>
                  
                  {/* Utilities */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Utilities</h4>
                    <div className="space-y-1">
                      <Link to="/utilities?tool=text-case" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Text Case Converter</Link>
                      <Link to="/utilities?tool=word-count" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Word Count</Link>
                      <Link to="/utilities?tool=line-sort" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Line Sort</Link>
                      <Link to="/utilities?tool=duplicate-remove" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Remove Duplicates</Link>
                      <Link to="/utilities?tool=text-diff" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Text Diff</Link>
                      <Link to="/utilities?tool=password-gen" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Password Generator</Link>
                      <Link to="/utilities?tool=lorem-ipsum" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Lorem Ipsum Generator</Link>
                      <Link to="/utilities?tool=email-validate" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Email Validator</Link>
                      <Link to="/utilities?tool=url-validate" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">URL Validator</Link>
                      <Link to="/utilities?tool=uuid-generate" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">UUID Generator</Link>
                    </div>
                  </div>
                  
                  {/* Validators */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Validators</h4>
                    <div className="space-y-1">
                      <Link to="/validators?tool=regex-tester" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Regular Expression Tester</Link>
                      <Link to="/validators?tool=java-regex-tester" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Java Regex Tester</Link>
                      <Link to="/validators?tool=cron-generator" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Cron Expression Generator</Link>
                      <Link to="/validators?tool=credit-card-generator" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Credit Card Generator</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 FreeFormatter Clone. Free online tools for developers.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export { Layout as default };
