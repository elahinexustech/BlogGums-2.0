import React, { useEffect, useState } from 'react';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeFormat from 'rehype-format';
import { unified } from 'unified';
import { transformerCopyButton } from '@rehype-pretty/transformers';

import './MarkdownViewer.css'; // Import your CSS file for styling


// Import environment variables
const CODE_THEME = import.meta.env.VITE_CODE_THEME;

const MarkdownViewer = ({ markdownText }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const [Theme, setTheme] = useState(localStorage.getItem(CODE_THEME));
    
    useEffect(() => {
        const fetchHTML = async () => {
            try {
                const processedContent = await unified()
                    .use(remarkParse)          // Parse Markdown
                    .use(remarkRehype)         // Convert to HTML
                    .use(rehypePrettyCode, {
                        theme: Theme,    // Specify theme
                        keepBackground: true,  // Ensure background is kept if theme has one
                        transformers: [
                            transformerCopyButton({
                                visibility: 'always',
                                feedbackDuration: 3000,
                            }),
                        ],
                    })
                    .use(rehypeFormat)         // Optional: Formats the HTML nicely
                    .use(rehypeStringify)      // Convert to string for rendering
                    .process(markdownText);

                setHtmlContent(processedContent.toString());
            } catch (error) {
                console.error("Error processing markdown:", error);
            }
        };

        fetchHTML();
    }, [markdownText, Theme]);

    return (
        <div
            className="markdown-viewer"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default MarkdownViewer;
