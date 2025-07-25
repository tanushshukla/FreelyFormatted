import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Copy, Download, Upload, ArrowRightLeft, FileText, Database, Clock, Code, Settings } from 'lucide-react';
import { toast } from 'sonner';
import * as yaml from 'js-yaml';
import Papa from 'papaparse';

type ConverterTool = 'json-yaml' | 'yaml-json' | 'json-csv' | 'csv-json' | 'xml-json' | 'json-xml' | 'csv-xml' | 'base64-text' | 'text-base64' | 'url-encode' | 'url-decode' | 'epoch-date' | 'date-epoch' | 'xsd-generate' | 'xslt-transform';

const Converters: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTool, setActiveTool] = useState<ConverterTool>('json-yaml');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [csvDelimiter, setCsvDelimiter] = useState(',');
  const [csvHasHeaders, setCsvHasHeaders] = useState(true);
  const [xsltStylesheet, setXsltStylesheet] = useState('');
  const [epochFormat, setEpochFormat] = useState('seconds');

  // Handle URL parameters to set active tool
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    const toolMapping: Record<string, ConverterTool> = {
      'json-to-yaml': 'json-yaml',
      'yaml-to-json': 'yaml-json',
      'json-to-csv': 'json-csv',
      'csv-to-json': 'csv-json',
      'xml-to-json': 'xml-json',
      'json-to-xml': 'json-xml',
      'csv-to-xml': 'csv-xml',
      'base64-encode': 'text-base64',
      'base64-decode': 'base64-text',
      'url-encode': 'url-encode',
      'url-decode': 'url-decode',
      'epoch-to-date': 'epoch-date',
      'date-to-epoch': 'date-epoch',
      'xsd-generator': 'xsd-generate',
      'xslt-transformer': 'xslt-transform'
    };
    
    if (toolParam && toolMapping[toolParam]) {
      setActiveTool(toolMapping[toolParam]);
    }
  }, [searchParams]);

  const convertJsonToYaml = () => {
    try {
      const jsonData = JSON.parse(input);
      const yamlOutput = yaml.dump(jsonData, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false
      });
      setOutput(yamlOutput);
      toast.success('JSON converted to YAML successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
      setOutput(`# Error: ${errorMessage}`);
      toast.error('Error converting JSON to YAML');
    }
  };

  const convertYamlToJson = () => {
    try {
      const yamlData = yaml.load(input);
      const jsonOutput = JSON.stringify(yamlData, null, 2);
      setOutput(jsonOutput);
      toast.success('YAML converted to JSON successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid YAML format';
      setOutput(`// Error: ${errorMessage}`);
      toast.error('Error converting YAML to JSON');
    }
  };

  const convertJsonToCsv = () => {
    try {
      const jsonData = JSON.parse(input);
      let dataArray: Record<string, unknown>[] = [];
      
      if (Array.isArray(jsonData)) {
        dataArray = jsonData;
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        dataArray = [jsonData as Record<string, unknown>];
      } else {
        throw new Error('JSON must be an object or array of objects');
      }

      const csv = Papa.unparse(dataArray, {
        delimiter: csvDelimiter,
        header: csvHasHeaders,
        skipEmptyLines: true
      });
      
      setOutput(csv);
      toast.success('JSON converted to CSV successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
      setOutput(`# Error: ${errorMessage}`);
      toast.error('Error converting JSON to CSV');
    }
  };

  const convertCsvToJson = () => {
    try {
      const result = Papa.parse(input, {
        delimiter: csvDelimiter,
        header: csvHasHeaders,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value) => value.trim()
      });

      if (result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }

      const jsonOutput = JSON.stringify(result.data, null, 2);
      setOutput(jsonOutput);
      toast.success('CSV converted to JSON successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid CSV format';
      setOutput(`// Error: ${errorMessage}`);
      toast.error('Error converting CSV to JSON');
    }
  };

  const convertXmlToJson = () => {
    try {
      // Simple XML to JSON conversion (basic implementation)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML format');
      }

      const xmlToObj = (node: Element): Record<string, unknown> => {
        const obj: Record<string, unknown> = {};
        
        // Handle attributes
        if (node.attributes.length > 0) {
          obj['@attributes'] = {};
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            obj['@attributes'][attr.name] = attr.value;
          }
        }
        
        // Handle child nodes
        if (node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            const childName = child.tagName;
            
            if (obj[childName]) {
        if (!Array.isArray(obj[childName])) {
          obj[childName] = [obj[childName]];
        }
        (obj[childName] as unknown[]).push(xmlToObj(child));
      } else {
        obj[childName] = xmlToObj(child);
      }
          }
        } else if (node.textContent?.trim()) {
          return { text: node.textContent?.trim() || '' };
        }
        
        return obj;
      };

      const result = xmlToObj(xmlDoc.documentElement);
      const jsonOutput = JSON.stringify({ [xmlDoc.documentElement.tagName]: result }, null, 2);
      setOutput(jsonOutput);
      toast.success('XML converted to JSON successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid XML format';
      setOutput(`// Error: ${errorMessage}`);
      toast.error('Error converting XML to JSON');
    }
  };

  const encodeBase64 = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      toast.success('Text encoded to Base64 successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error encoding to Base64';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error encoding to Base64');
    }
  };

  const decodeBase64 = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      toast.success('Base64 decoded to text successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid Base64 format';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error decoding Base64');
    }
  };

  const encodeUrl = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      toast.success('Text URL encoded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error URL encoding';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error URL encoding');
    }
  };

  const decodeUrl = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      toast.success('URL decoded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid URL encoding';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error URL decoding');
    }
  };

  const convertJsonToXml = () => {
    try {
      const jsonData = JSON.parse(input);
      
      const jsonToXml = (obj: any, rootName = 'root'): string => {
        if (typeof obj !== 'object' || obj === null) {
          return `<${rootName}>${obj}</${rootName}>`;
        }
        
        if (Array.isArray(obj)) {
          return obj.map((item, index) => jsonToXml(item, `item${index}`)).join('\n');
        }
        
        let xml = `<${rootName}>`;
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'object' && value !== null) {
            xml += `\n  ${jsonToXml(value, key).split('\n').join('\n  ')}`;
          } else {
            xml += `\n  <${key}>${value}</${key}>`;
          }
        }
        xml += `\n</${rootName}>`;
        return xml;
      };
      
      const xmlOutput = `<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(jsonData)}`;
      setOutput(xmlOutput);
      toast.success('JSON converted to XML successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
      setOutput(`<!-- Error: ${errorMessage} -->`);
      toast.error('Error converting JSON to XML');
    }
  };

  const convertCsvToXml = () => {
    try {
      const result = Papa.parse(input, {
        delimiter: csvDelimiter,
        header: csvHasHeaders,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value) => value.trim()
      });

      if (result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n';
      
      (result.data as Record<string, string>[]).forEach((row, index) => {
        xml += `  <record id="${index + 1}">\n`;
        Object.entries(row).forEach(([key, value]) => {
          const cleanKey = key.replace(/[^a-zA-Z0-9]/g, '_');
          xml += `    <${cleanKey}>${value}</${cleanKey}>\n`;
        });
        xml += '  </record>\n';
      });
      
      xml += '</data>';
      setOutput(xml);
      toast.success('CSV converted to XML successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid CSV format';
      setOutput(`<!-- Error: ${errorMessage} -->`);
      toast.error('Error converting CSV to XML');
    }
  };

  const convertEpochToDate = () => {
    try {
      let timestamp = parseInt(input.trim());
      
      if (epochFormat === 'milliseconds') {
        timestamp = timestamp;
      } else {
        timestamp = timestamp * 1000;
      }
      
      const date = new Date(timestamp);
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid timestamp');
      }
      
      const output = {
        'ISO 8601': date.toISOString(),
        'UTC': date.toUTCString(),
        'Local': date.toString(),
        'Date Only': date.toDateString(),
        'Time Only': date.toTimeString(),
        'Timestamp (ms)': date.getTime(),
        'Timestamp (s)': Math.floor(date.getTime() / 1000)
      };
      
      setOutput(JSON.stringify(output, null, 2));
      toast.success('Epoch timestamp converted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid timestamp';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error converting timestamp');
    }
  };

  const convertDateToEpoch = () => {
    try {
      const date = new Date(input.trim());
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      
      const timestampMs = date.getTime();
      const timestampS = Math.floor(timestampMs / 1000);
      
      const output = {
        'Timestamp (seconds)': timestampS,
        'Timestamp (milliseconds)': timestampMs,
        'ISO 8601': date.toISOString(),
        'UTC': date.toUTCString()
      };
      
      setOutput(JSON.stringify(output, null, 2));
      toast.success('Date converted to epoch timestamp successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid date format';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error converting date');
    }
  };

  const generateXsd = () => {
    try {
      const jsonData = JSON.parse(input);
      
      const generateXsdFromJson = (obj: any, elementName = 'root'): string => {
        if (typeof obj !== 'object' || obj === null) {
          const type = typeof obj === 'number' ? 'xs:decimal' : 'xs:string';
          return `  <xs:element name="${elementName}" type="${type}"/>`;
        }
        
        if (Array.isArray(obj)) {
          if (obj.length > 0) {
            return generateXsdFromJson(obj[0], elementName);
          }
          return `  <xs:element name="${elementName}" type="xs:string"/>`;
        }
        
        let xsd = `  <xs:element name="${elementName}">\n    <xs:complexType>\n      <xs:sequence>\n`;
        
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            xsd += generateXsdFromJson(value, key).split('\n').map(line => '    ' + line).join('\n') + '\n';
          } else {
            const type = typeof value === 'number' ? 'xs:decimal' : 'xs:string';
            xsd += `        <xs:element name="${key}" type="${type}"/>\n`;
          }
        });
        
        xsd += '      </xs:sequence>\n    </xs:complexType>\n  </xs:element>';
        return xsd;
      };
      
      const xsdOutput = `<?xml version="1.0" encoding="UTF-8"?>\n<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">\n${generateXsdFromJson(jsonData)}\n</xs:schema>`;
      setOutput(xsdOutput);
      toast.success('XSD schema generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
      setOutput(`<!-- Error: ${errorMessage} -->`);
      toast.error('Error generating XSD schema');
    }
  };

  const transformXslt = () => {
    try {
      if (!xsltStylesheet.trim()) {
        throw new Error('XSLT stylesheet is required');
      }
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');
      const xsltDoc = parser.parseFromString(xsltStylesheet, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML format');
      }
      
      if (xsltDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XSLT stylesheet');
      }
      
      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsltDoc);
      const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
      
      const serializer = new XMLSerializer();
      const result = serializer.serializeToString(resultDoc);
      
      setOutput(result);
      toast.success('XSLT transformation completed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'XSLT transformation failed';
      setOutput(`<!-- Error: ${errorMessage} -->`);
      toast.error('Error in XSLT transformation');
    }
  };

  const handleConvert = () => {
    switch (activeTool) {
      case 'json-yaml':
        convertJsonToYaml();
        break;
      case 'yaml-json':
        convertYamlToJson();
        break;
      case 'json-csv':
        convertJsonToCsv();
        break;
      case 'csv-json':
        convertCsvToJson();
        break;
      case 'xml-json':
        convertXmlToJson();
        break;
      case 'json-xml':
        convertJsonToXml();
        break;
      case 'csv-xml':
        convertCsvToXml();
        break;
      case 'text-base64':
        encodeBase64();
        break;
      case 'base64-text':
        decodeBase64();
        break;
      case 'url-encode':
        encodeUrl();
        break;
      case 'url-decode':
        decodeUrl();
        break;
      case 'epoch-date':
        convertEpochToDate();
        break;
      case 'date-epoch':
        convertDateToEpoch();
        break;
      case 'xsd-generate':
        generateXsd();
        break;
      case 'xslt-transform':
        transformXslt();
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
    
    if (activeTool.includes('json')) {
      extension = 'json';
      mimeType = 'application/json';
    } else if (activeTool.includes('yaml')) {
      extension = 'yaml';
      mimeType = 'text/yaml';
    } else if (activeTool.includes('csv')) {
      extension = 'csv';
      mimeType = 'text/csv';
    } else if (activeTool.includes('xml')) {
      extension = 'xml';
      mimeType = 'text/xml';
    }

    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${extension}`;
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
    { id: 'json-yaml' as ConverterTool, name: 'JSON to YAML', icon: ArrowRightLeft },
    { id: 'yaml-json' as ConverterTool, name: 'YAML to JSON', icon: ArrowRightLeft },
    { id: 'json-csv' as ConverterTool, name: 'JSON to CSV', icon: Database },
    { id: 'csv-json' as ConverterTool, name: 'CSV to JSON', icon: Database },
    { id: 'xml-json' as ConverterTool, name: 'XML to JSON', icon: FileText },
    { id: 'json-xml' as ConverterTool, name: 'JSON to XML', icon: FileText },
    { id: 'csv-xml' as ConverterTool, name: 'CSV to XML', icon: FileText },
    { id: 'text-base64' as ConverterTool, name: 'Text to Base64', icon: ArrowRightLeft },
    { id: 'base64-text' as ConverterTool, name: 'Base64 to Text', icon: ArrowRightLeft },
    { id: 'url-encode' as ConverterTool, name: 'URL Encode', icon: ArrowRightLeft },
    { id: 'url-decode' as ConverterTool, name: 'URL Decode', icon: ArrowRightLeft },
    { id: 'epoch-date' as ConverterTool, name: 'Epoch to Date', icon: Clock },
    { id: 'date-epoch' as ConverterTool, name: 'Date to Epoch', icon: Clock },
    { id: 'xsd-generate' as ConverterTool, name: 'XSD Generator', icon: Code },
    { id: 'xslt-transform' as ConverterTool, name: 'XSLT Transform', icon: Settings },
  ];

  const getPlaceholder = () => {
    switch (activeTool) {
      case 'json-yaml':
      case 'json-csv':
      case 'json-xml':
      case 'xsd-generate':
        return 'Paste your JSON data here...';
      case 'yaml-json':
        return 'Paste your YAML data here...';
      case 'csv-json':
      case 'csv-xml':
        return 'Paste your CSV data here...';
      case 'xml-json':
      case 'xslt-transform':
        return 'Paste your XML data here...';
      case 'text-base64':
      case 'url-encode':
        return 'Paste your text here...';
      case 'base64-text':
        return 'Paste your Base64 encoded text here...';
      case 'url-decode':
        return 'Paste your URL encoded text here...';
      case 'epoch-date':
        return 'Enter epoch timestamp (e.g., 1640995200)...';
      case 'date-epoch':
        return 'Enter date (e.g., 2022-01-01 or Jan 1, 2022)...';
      default:
        return 'Paste your data here...';
    }
  };

  const getOutputPlaceholder = () => {
    switch (activeTool) {
      case 'json-yaml':
        return 'YAML output will appear here...';
      case 'yaml-json':
      case 'csv-json':
      case 'xml-json':
      case 'epoch-date':
      case 'date-epoch':
        return 'JSON output will appear here...';
      case 'json-csv':
        return 'CSV output will appear here...';
      case 'json-xml':
      case 'csv-xml':
      case 'xsd-generate':
      case 'xslt-transform':
        return 'XML output will appear here...';
      case 'text-base64':
        return 'Base64 encoded text will appear here...';
      case 'base64-text':
      case 'url-decode':
        return 'Decoded text will appear here...';
      case 'url-encode':
        return 'URL encoded text will appear here...';
      default:
        return 'Converted data will appear here...';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">Data Converters</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert between different data formats: JSON, YAML, CSV, XML, Base64, and URL encoding
            </p>
          </div>

          {/* Tool Selector */}
          <div className="bg-white border-2 border-black rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
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

            {/* CSV Options */}
            {(activeTool === 'json-csv' || activeTool === 'csv-json' || activeTool === 'csv-xml') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CSV Delimiter
                  </label>
                  <select
                    value={csvDelimiter}
                    onChange={(e) => setCsvDelimiter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\t">Tab</option>
                    <option value="|">Pipe (|)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headers
                  </label>
                  <select
                    value={csvHasHeaders ? 'true' : 'false'}
                    onChange={(e) => setCsvHasHeaders(e.target.value === 'true')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="true">First row contains headers</option>
                    <option value="false">No headers</option>
                  </select>
                </div>
              </div>
            )}

            {/* Epoch Options */}
            {(activeTool === 'epoch-date') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timestamp Format
                  </label>
                  <select
                    value={epochFormat}
                    onChange={(e) => setEpochFormat(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="seconds">Seconds (Unix timestamp)</option>
                    <option value="milliseconds">Milliseconds (JavaScript timestamp)</option>
                  </select>
                </div>
              </div>
            )}

            {/* XSLT Options */}
            {activeTool === 'xslt-transform' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  XSLT Stylesheet
                </label>
                <textarea
                  value={xsltStylesheet}
                  onChange={(e) => setXsltStylesheet(e.target.value)}
                  placeholder="Paste your XSLT stylesheet here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
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
                        accept=".json,.yaml,.yml,.csv,.xml,.txt"
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
                  onClick={handleConvert}
                  className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                  Convert
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

export default Converters;