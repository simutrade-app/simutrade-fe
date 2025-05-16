import React from 'react';
import ReactMarkdown from 'react-markdown';

// Define custom types for component props
interface CodeProps {
  node?: any;
  inline?: boolean;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

/**
 * Renders markdown content with proper styling without using className
 * This avoids the error: "Unexpected `className` prop"
 */
export const renderMarkdown = (content: string) => {
  return (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      <ReactMarkdown
        components={{
          // Style components directly with style prop instead of className
          p: ({ node, ...props }: any) => (
            <p style={{ margin: '0.5em 0' }} {...props} />
          ),
          h1: ({ node, ...props }: any) => (
            <h1
              style={{
                margin: '0.5em 0',
                fontWeight: 'bold',
                fontSize: '1.5em',
              }}
              {...props}
            />
          ),
          h2: ({ node, ...props }: any) => (
            <h2
              style={{
                margin: '0.5em 0',
                fontWeight: 'bold',
                fontSize: '1.3em',
              }}
              {...props}
            />
          ),
          h3: ({ node, ...props }: any) => (
            <h3
              style={{
                margin: '0.5em 0',
                fontWeight: 'bold',
                fontSize: '1.2em',
              }}
              {...props}
            />
          ),
          ul: ({ node, ...props }: any) => (
            <ul
              style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}
              {...props}
            />
          ),
          ol: ({ node, ...props }: any) => (
            <ol
              style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}
              {...props}
            />
          ),
          li: ({ node, ...props }: any) => (
            <li style={{ margin: '0.2em 0' }} {...props} />
          ),
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                style={{
                  background: '#f5f5f5',
                  padding: '0.2em 0.4em',
                  borderRadius: '3px',
                }}
                {...props}
              />
            ) : (
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '1em',
                  borderRadius: '5px',
                  overflowX: 'auto',
                }}
              >
                <code {...props} />
              </pre>
            ),
          pre: ({ node, ...props }: any) => (
            <pre style={{ margin: '0.5em 0' }} {...props} />
          ),
          a: ({ node, ...props }: any) => (
            <a
              style={{ color: '#1890ff', textDecoration: 'none' }}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
