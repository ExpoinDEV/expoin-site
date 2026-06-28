import React from 'react';
import { unicornHtml } from '../../lib/constants';

export default function UnicornBackground() {
  return (
    <div 
      className="top-0 left-0 w-full h-screen fixed pointer-events-none z-0" 
      style={{ 
        maskImage: 'linear-gradient(transparent, black 0%, black 80%, transparent)',
        WebkitMaskImage: 'linear-gradient(transparent, black 0%, black 80%, transparent)' 
      }}
    >
      <iframe 
        srcDoc={unicornHtml} 
        style={{ width: '100vw', height: '100vh', border: 'none', position: 'absolute', left: 0, top: 0 }}
        title="Unicorn Background"
      />
    </div>
  );
}
