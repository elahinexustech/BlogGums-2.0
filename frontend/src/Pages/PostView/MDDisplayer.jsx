import React, { useEffect, useState } from 'react';
import convertMarkdownToHTML from './convertor';


import './MarkdownViewer.css'; // Import your CSS file for styling

const MarkdownViewer = ({ markdownText }) => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const fetchHTML = async () => {
            const html = await convertMarkdownToHTML(markdownText);
            setHtmlContent(html);
        };
        
        fetchHTML();
    }, [markdownText]);

    return (
        <div
            className="markdown-viewer"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default MarkdownViewer;
