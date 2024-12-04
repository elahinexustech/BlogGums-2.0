// src/MDEditor.js
import React from 'react';
import { marked } from 'marked';
import './editor.css';

const MDEditor = ({ value, onChange }) => {
    const handleChange = (event) => {
        onChange(event.target.value);
    };

    const getMarkdown = () => {
        return { __html: marked(value) }; // Use value directly
    };

    const insertMarkdown = (syntax) => {
        const textarea = document.getElementById('markdown-input');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const cursorPosition = syntax.indexOf(' ') > -1 ? syntax.indexOf(' ') : syntax.length;
        const newMarkdown =
            value.substring(0, start) + syntax + value.substring(end);

        onChange(newMarkdown); // Update via onChange

        textarea.focus();
        textarea.setSelectionRange(start + cursorPosition, start + cursorPosition);
    };

    return (
        <div className="editor flex ai-start direction-col obj-trans">
            <div className="header">
                <div className="toolbar flex">
                    <button className='transparent' type="button" onClick={() => insertMarkdown('**  **')}>
                        <i className="bi bi-type-bold"></i> {/* Bold Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('*  *')}>
                        <i className="bi bi-type-italic"></i> {/* Italic Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('~~  ~~')}>
                        <i className="bi bi-type-strikethrough"></i> {/* Strikethrough Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('# ')}>
                        <i className="bi bi-type-h1"></i> {/* H1 Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('## ')}>
                        <i className="bi bi-type-h2"></i> {/* H2 Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('### ')}>
                        <i className="bi bi-type-h3"></i> {/* H3 Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('#### ')}>
                        <i className="bi bi-type-h4"></i> {/* H4 Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('##### ')}>
                        <i className="bi bi-type-h5"></i> {/* H5 Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('###### ')}>
                        <i className="bi bi-type-h6"></i> {/* H6 Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('- ')}>
                        <i className="bi bi-list-ul"></i> {/* Unordered List Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('1. ')}>
                        <i className="bi bi-list-ol"></i> {/* Ordered List Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('[Link Text](URL)')}>
                        <i className="bi bi-link-45deg"></i> {/* Link Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('![Alt Text](Image URL)')}>
                        <i className="bi bi-image"></i> {/* Image Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('``')}>
                        <i className="bi bi-code-slash"></i> {/* Inline Code Icon */}
                    </button>
                    <button className='transparent' type="button" onClick={() => insertMarkdown('```\n  \n```')}>
                        <i className="bi bi-file-earmark-code"></i> {/* Code Block Icon */}
                    </button>
                </div>
            </div>

            <div className="body flex jc-start">
                <textarea
                    id="markdown-input"
                    value={value}
                    onChange={handleChange}
                    placeholder="Type your markdown here..."
                />
                {/* <div className="preview">
                    <div
                        className="preview-content"
                        dangerouslySetInnerHTML={getMarkdown()}
                    />
                </div> */}
            </div>
        </div>
    );
};

export default MDEditor;
