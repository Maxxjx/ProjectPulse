'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import ReactQuill dynamically with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-40 bg-[#1F2937] border border-gray-600 rounded-md animate-pulse"></div>,
});

import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  height?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something...',
  readOnly = false,
  height = '200px',
}: RichTextEditorProps) {
  // This state ensures the component doesn't try to render Quill on the server
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'code'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'code',
  ];

  if (!mounted) {
    return <div className="h-40 bg-[#1F2937] border border-gray-600 rounded-md"></div>;
  }

  return (
    <div>
      <style jsx global>{`
        .quill {
          background-color: #1F2937;
          border-radius: 0.375rem;
          border: 1px solid #4B5563;
        }
        .ql-toolbar {
          border-bottom: 1px solid #4B5563 !important;
          background-color: #111827;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          height: ${height};
        }
        .ql-editor {
          min-height: ${height};
          color: #ededed;
        }
        .ql-editor.ql-blank::before {
          color: #9CA3AF;
        }
        .ql-snow .ql-stroke {
          stroke: #9CA3AF;
        }
        .ql-snow .ql-fill, .ql-snow .ql-stroke.ql-fill {
          fill: #9CA3AF;
        }
        .ql-snow .ql-picker {
          color: #9CA3AF;
        }
        .ql-snow .ql-picker-options {
          background-color: #1F2937;
        }
        .ql-snow .ql-tooltip {
          background-color: #1F2937;
          color: #ededed;
          border-color: #4B5563;
        }
        .ql-snow .ql-tooltip input[type=text] {
          background-color: #111827;
          color: #ededed;
          border-color: #4B5563;
        }
      `}</style>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        theme="snow"
      />
    </div>
  );
} 