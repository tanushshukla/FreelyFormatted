import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Copy, Download, Upload, Shield, Hash, Key, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';
import QRCode from 'qrcode';

type CryptoTool = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'base64-encode' | 'base64-decode' | 'url-encode' | 'url-decode' | 'html-encode' | 'html-decode' | 'aes-encrypt' | 'aes-decrypt' | 'qr-generate' | 'jwt-decode';

const EncodersCrypto: React.FC = () => {
  const [activeTool, setActiveTool] = useState<CryptoTool>('md5');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [qrSize, setQrSize] = useState(256);
  const [qrErrorLevel, setQrErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const generateMD5 = () => {
    try {
      const hash = CryptoJS.MD5(input).toString();
      setOutput(hash);
      toast.success('MD5 hash generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generating MD5 hash';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error generating MD5 hash');
    }
  };

  const generateSHA1 = () => {
    try {
      const hash = CryptoJS.SHA1(input).toString();
      setOutput(hash);
      toast.success('SHA1 hash generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generating SHA1 hash';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error generating SHA1 hash');
    }
  };

  const generateSHA256 = () => {
    try {
      const hash = CryptoJS.SHA256(input).toString();
      setOutput(hash);
      toast.success('SHA256 hash generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generating SHA256 hash';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error generating SHA256 hash');
    }
  };

  const generateSHA512 = () => {
    try {
      const hash = CryptoJS.SHA512(input).toString();
      setOutput(hash);
      toast.success('SHA512 hash generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generating SHA512 hash';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error generating SHA512 hash');
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
      toast.success('Base64 decoded successfully!');
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

  const encodeHtml = () => {
    try {
      const encoded = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      setOutput(encoded);
      toast.success('HTML encoded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error HTML encoding';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error HTML encoding');
    }
  };

  const decodeHtml = () => {
    try {
      const decoded = input
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      setOutput(decoded);
      toast.success('HTML decoded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error HTML decoding';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error HTML decoding');
    }
  };

  const encryptAES = () => {
    try {
      if (!secretKey) {
        throw new Error('Secret key is required for encryption');
      }
      const encrypted = CryptoJS.AES.encrypt(input, secretKey).toString();
      setOutput(encrypted);
      toast.success('Text encrypted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error encrypting text';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error encrypting text');
    }
  };

  const decryptAES = () => {
    try {
      if (!secretKey) {
        throw new Error('Secret key is required for decryption');
      }
      const decrypted = CryptoJS.AES.decrypt(input, secretKey).toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        throw new Error('Invalid encrypted text or wrong key');
      }
      setOutput(decrypted);
      toast.success('Text decrypted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error decrypting text';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error decrypting text');
    }
  };

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(input, {
        width: qrSize,
        errorCorrectionLevel: qrErrorLevel,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setOutput(qrDataUrl);
      toast.success('QR Code generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generating QR Code';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error generating QR Code');
    }
  };

  const decodeJWT = () => {
    try {
      const parts = input.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      const decoded = {
        header,
        payload,
        signature: parts[2]
      };

      setOutput(JSON.stringify(decoded, null, 2));
      toast.success('JWT decoded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JWT format';
      setOutput(`Error: ${errorMessage}`);
      toast.error('Error decoding JWT');
    }
  };

  const handleProcess = () => {
    switch (activeTool) {
      case 'md5':
        generateMD5();
        break;
      case 'sha1':
        generateSHA1();
        break;
      case 'sha256':
        generateSHA256();
        break;
      case 'sha512':
        generateSHA512();
        break;
      case 'base64-encode':
        encodeBase64();
        break;
      case 'base64-decode':
        decodeBase64();
        break;
      case 'url-encode':
        encodeUrl();
        break;
      case 'url-decode':
        decodeUrl();
        break;
      case 'html-encode':
        encodeHtml();
        break;
      case 'html-decode':
        decodeHtml();
        break;
      case 'aes-encrypt':
        encryptAES();
        break;
      case 'aes-decrypt':
        decryptAES();
        break;
      case 'qr-generate':
        generateQRCode();
        break;
      case 'jwt-decode':
        decodeJWT();
        break;
    }
  };

  const copyToClipboard = async () => {
    try {
      if (activeTool === 'qr-generate' && output.startsWith('data:image')) {
        // For QR codes, copy the original text
        await navigator.clipboard.writeText(input);
        toast.success('QR code text copied to clipboard!');
      } else {
        await navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard!');
      }
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadFile = () => {
    if (activeTool === 'qr-generate' && output.startsWith('data:image')) {
      // Download QR code as image
      const a = document.createElement('a');
      a.href = output;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('QR Code downloaded!');
    } else {
      // Download as text file
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
    }
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
    { id: 'md5' as CryptoTool, name: 'MD5 Hash', icon: Hash, category: 'Hash' },
    { id: 'sha1' as CryptoTool, name: 'SHA1 Hash', icon: Hash, category: 'Hash' },
    { id: 'sha256' as CryptoTool, name: 'SHA256 Hash', icon: Hash, category: 'Hash' },
    { id: 'sha512' as CryptoTool, name: 'SHA512 Hash', icon: Hash, category: 'Hash' },
    { id: 'base64-encode' as CryptoTool, name: 'Base64 Encode', icon: Shield, category: 'Encoding' },
    { id: 'base64-decode' as CryptoTool, name: 'Base64 Decode', icon: Shield, category: 'Encoding' },
    { id: 'url-encode' as CryptoTool, name: 'URL Encode', icon: Shield, category: 'Encoding' },
    { id: 'url-decode' as CryptoTool, name: 'URL Decode', icon: Shield, category: 'Encoding' },
    { id: 'html-encode' as CryptoTool, name: 'HTML Encode', icon: Shield, category: 'Encoding' },
    { id: 'html-decode' as CryptoTool, name: 'HTML Decode', icon: Shield, category: 'Encoding' },
    { id: 'aes-encrypt' as CryptoTool, name: 'AES Encrypt', icon: Key, category: 'Encryption' },
    { id: 'aes-decrypt' as CryptoTool, name: 'AES Decrypt', icon: Key, category: 'Encryption' },
    { id: 'qr-generate' as CryptoTool, name: 'QR Code', icon: Shield, category: 'Generate' },
    { id: 'jwt-decode' as CryptoTool, name: 'JWT Decode', icon: Shield, category: 'Decode' },
  ];

  const getPlaceholder = () => {
    switch (activeTool) {
      case 'md5':
      case 'sha1':
      case 'sha256':
      case 'sha512':
        return 'Enter text to hash...';
      case 'base64-encode':
      case 'url-encode':
      case 'html-encode':
      case 'aes-encrypt':
        return 'Enter text to encode/encrypt...';
      case 'base64-decode':
        return 'Enter Base64 encoded text...';
      case 'url-decode':
        return 'Enter URL encoded text...';
      case 'html-decode':
        return 'Enter HTML encoded text...';
      case 'aes-decrypt':
        return 'Enter encrypted text...';
      case 'qr-generate':
        return 'Enter text or URL for QR code...';
      case 'jwt-decode':
        return 'Enter JWT token...';
      default:
        return 'Enter your text here...';
    }
  };

  const requiresKey = activeTool === 'aes-encrypt' || activeTool === 'aes-decrypt';
  const isQRCode = activeTool === 'qr-generate';

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">Encoders &amp; Cryptography</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hash, encode, decode, encrypt, and generate secure data
            </p>
          </div>

          {/* Tool Selector */}
          <div className="bg-white border-2 border-black rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
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
                    <span className="text-xs opacity-75">{tool.category}</span>
                  </button>
                );
              })}
            </div>

            {/* Tool Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Secret Key for AES */}
              {requiresKey && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      placeholder="Enter secret key..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* QR Code Options */}
              {isQRCode && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      QR Code Size
                    </label>
                    <select
                      value={qrSize}
                      onChange={(e) => setQrSize(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value={128}>128x128</option>
                      <option value={256}>256x256</option>
                      <option value={512}>512x512</option>
                      <option value={1024}>1024x1024</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Error Correction
                    </label>
                    <select
                      value={qrErrorLevel}
                      onChange={(e) => setQrErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
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
                        accept=".txt,.json,.jwt"
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
                  disabled={requiresKey && !secretKey}
                  className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {activeTool === 'md5' && 'Generate MD5 Hash'}
                  {activeTool === 'sha1' && 'Generate SHA1 Hash'}
                  {activeTool === 'sha256' && 'Generate SHA256 Hash'}
                  {activeTool === 'sha512' && 'Generate SHA512 Hash'}
                  {activeTool === 'base64-encode' && 'Encode to Base64'}
                  {activeTool === 'base64-decode' && 'Decode from Base64'}
                  {activeTool === 'url-encode' && 'URL Encode'}
                  {activeTool === 'url-decode' && 'URL Decode'}
                  {activeTool === 'html-encode' && 'HTML Encode'}
                  {activeTool === 'html-decode' && 'HTML Decode'}
                  {activeTool === 'aes-encrypt' && 'Encrypt with AES'}
                  {activeTool === 'aes-decrypt' && 'Decrypt with AES'}
                  {activeTool === 'qr-generate' && 'Generate QR Code'}
                  {activeTool === 'jwt-decode' && 'Decode JWT'}
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
                {isQRCode && output.startsWith('data:image') ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={output}
                      alt="Generated QR Code"
                      className="border border-gray-300 rounded-md mb-4"
                    />
                    <p className="text-sm text-gray-600 text-center">
                      QR Code generated successfully! Right-click to save or use the download button.
                    </p>
                  </div>
                ) : (
                  <textarea
                    value={output}
                    readOnly
                    placeholder="Result will appear here..."
                    className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none"
                  />
                )}
                
                {/* Stats */}
                {output && !isQRCode && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Input length:</span>
                        <span className="ml-2 text-gray-600">{input.length} characters</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Output length:</span>
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

export default EncodersCrypto;