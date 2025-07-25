import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from '@/pages/Home';
import JsonTools from '@/pages/JsonTools';
import XmlHtmlTools from '@/pages/XmlHtmlTools';
import CodeTools from '@/pages/CodeTools';
import Converters from '@/pages/Converters';
import EncodersCrypto from '@/pages/EncodersCrypto';
import Utilities from '@/pages/Utilities';
import Validators from '@/pages/Validators';
import Formatters from '@/pages/Formatters';
import StringEscaper from '@/pages/StringEscaper';
import WebResources from '@/pages/WebResources';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/json-tools" element={<JsonTools />} />
          <Route path="/xml-html-tools" element={<XmlHtmlTools />} />
          <Route path="/code-tools" element={<CodeTools />} />
          <Route path="/converters" element={<Converters />} />
          <Route path="/encoders-crypto" element={<EncodersCrypto />} />
          <Route path="/utilities" element={<Utilities />} />
          <Route path="/validators" element={<Validators />} />
          <Route path="/formatters" element={<Formatters />} />
          <Route path="/string-escaper" element={<StringEscaper />} />
          <Route path="/web-resources" element={<WebResources />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
