import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import {
  FileText,
  CheckCircle,
  RefreshCw,
  Lock,
  Code,
  Type,
  Globe,
  ArrowRight,
  Zap,
  Shield,
  Cpu,
  Quote,
  Book,
} from 'lucide-react';

interface ToolCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  toolCount: number;
  tools: string[];
}

interface FeaturedTool {
  id: string;
  title: string;
  description: string;
  path: string;
  category: string;
  popular: boolean;
}

const toolCategories: ToolCategory[] = [
  {
    id: 'formatters',
    title: 'Formatters',
    description: 'Beautify and format your code with proper indentation',
    icon: <FileText className="h-8 w-8" />,
    path: '/formatters',
    toolCount: 4,
    tools: ['JSON Formatter', 'XML Formatter', 'HTML Formatter', 'SQL Formatter'],
  },
  {
    id: 'validators',
    title: 'Validators',
    description: 'Validate your code and data against standards',
    icon: <CheckCircle className="h-8 w-8" />,
    path: '/validators',
    toolCount: 7,
    tools: ['JSON Validator', 'XML Validator', 'HTML Validator', 'XPath Tester'],
  },
  {
    id: 'converters',
    title: 'Converters',
    description: 'Convert between different data formats seamlessly',
    icon: <RefreshCw className="h-8 w-8" />,
    path: '/converters',
    toolCount: 8,
    tools: ['XML to JSON', 'JSON to XML', 'CSV Converters', 'YAML Converters'],
  },
  {
    id: 'encoders',
    title: 'Encoders/Crypto',
    description: 'Encode, decode, and generate cryptographic hashes',
    icon: <Lock className="h-8 w-8" />,
    path: '/encoders-crypto',
    toolCount: 15,
    tools: ['URL Encoder', 'Base64 Encoder', 'Hash Generators', 'QR Code Generator'],
  },
  {
    id: 'minifiers',
    title: 'Code Tools',
    description: 'Minify and beautify JavaScript, CSS, and other code',
    icon: <Code className="h-8 w-8" />,
    path: '/code-tools',
    toolCount: 4,
    tools: ['JavaScript Beautifier', 'CSS Beautifier', 'Code Minifiers'],
  },
  {
    id: 'utilities',
    title: 'Utilities',
    description: 'String manipulation and various developer utilities',
    icon: <Type className="h-8 w-8" />,
    path: '/utilities',
    toolCount: 12,
    tools: ['String Utilities', 'Regex Tester', 'Lorem Ipsum', 'Credit Card Validator'],
  },
  {
    id: 'string-escaper',
    title: 'String Escaper',
    description: 'Escape and unescape strings for various programming languages',
    icon: <Quote className="h-8 w-8" />,
    path: '/string-escaper',
    toolCount: 8,
    tools: ['HTML Escape', 'XML Escape', 'JavaScript Escape', 'SQL Escape'],
  },
  {
    id: 'web-resources',
    title: 'Web Resources',
    description: 'Essential web development resources and references',
    icon: <Book className="h-8 w-8" />,
    path: '/web-resources',
    toolCount: 4,
    tools: ['Lorem Ipsum Generator', 'MIME Types', 'HTML Entities', 'I18N Standards'],
  },
];

const featuredTools: FeaturedTool[] = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format and beautify JSON with syntax highlighting and tree view',
    path: '/json-tools',
    category: 'Formatters',
    popular: true,
  },
  {
    id: 'xml-validator',
    title: 'XML Validator',
    description: 'Validate XML against XSD schemas with detailed error reporting',
    path: '/xml-html-tools',
    category: 'Validators',
    popular: true,
  },
  {
    id: 'base64-encoder',
    title: 'Base64 Encoder',
    description: 'Encode and decode Base64 strings with file upload support',
    path: '/encoder-tools',
    category: 'Encoders',
    popular: true,
  },
];

export default function Home() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="bg-black text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Free Online Tools For Developers
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional-grade formatting, validation, conversion, and encoding tools.
              All free, all online, all the time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/json-tools"
                className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Formatting
              </Link>
              <Link
                to="/utility-tools"
                className="border border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-black transition-colors duration-200 flex items-center justify-center"
              >
                <Shield className="h-5 w-5 mr-2" />
                Explore Tools
              </Link>
            </div>
          </div>
        </section>

        {/* Tool Categories */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">Tool Categories</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our comprehensive collection of developer tools organized by category
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {toolCategories.map((category) => (
                <Link
                  key={category.id}
                  to={category.path}
                  className="bg-white border-2 border-black p-6 rounded-lg hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="text-black group-hover:text-gray-600 transition-colors duration-200">
                      {category.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-black">{category.title}</h3>
                      <span className="text-sm text-gray-500">{category.toolCount} tools</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.tools.slice(0, 3).map((tool, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {tool}
                      </span>
                    ))}
                    {category.tools.length > 3 && (
                      <span className="text-xs text-gray-500">+{category.tools.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex items-center text-black group-hover:text-gray-600 transition-colors duration-200">
                    <span className="text-sm font-medium">Explore tools</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tools */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">Featured Tools</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Most popular tools used by developers worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="bg-black text-white p-8 rounded-lg hover:bg-gray-800 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm bg-white text-black px-3 py-1 rounded-full font-medium">
                      {tool.category}
                    </span>
                    {tool.popular && (
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        Popular
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
                  <p className="text-gray-300 mb-6">{tool.description}</p>
                  <div className="flex items-center text-white group-hover:text-gray-200 transition-colors duration-200">
                    <span className="text-sm font-medium">Try it now</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white border border-black p-8 rounded-lg">
                <div className="text-black mb-4">
                  <Cpu className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-3xl font-bold text-black mb-2">40+</h3>
                <p className="text-gray-600">Developer Tools</p>
              </div>
              <div className="bg-white border border-black p-8 rounded-lg">
                <div className="text-black mb-4">
                  <Globe className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-3xl font-bold text-black mb-2">100%</h3>
                <p className="text-gray-600">Free & Online</p>
              </div>
              <div className="bg-white border border-black p-8 rounded-lg">
                <div className="text-black mb-4">
                  <Shield className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-3xl font-bold text-black mb-2">Secure</h3>
                <p className="text-gray-600">Client-side Processing</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}