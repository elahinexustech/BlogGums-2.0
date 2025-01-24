import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import Cookies from 'js-cookie'
import './editor.css';

// Import environment variables
const SERVER = import.meta.env.VITE_SERVER;
const PORT = import.meta.env.VITE_PORT;
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/bloggums/backend/v1';

const MDEditor = ({ value, onChange }) => {
    const [imageReferences, setImageReferences] = useState([]);
    const [showImageDropdown, setShowImageDropdown] = useState(false);

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

    // Fetch image references from the backend
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`${BASE_URL}/blogs/get/media`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get(ACCESS_TOKEN)}`
                    }
                });
                const data = await response.json();
                setImageReferences(data.data);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    const handleImageClick = (imageUrl) => {
        insertMarkdown(`![Alt Text](${imageUrl})`);
        setShowImageDropdown(false); // Hide dropdown after selection
    };

    return (
        <div className="editor flex ai-start direction-col obj-trans">
            <div className="header">
                <div className="toolbar flex">
                    <button className="transparent" type="button" onClick={() => insertMarkdown('**  **')}>
                        <i className="bi bi-type-bold"></i> {/* Bold Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('*  *')}>
                        <i className="bi bi-type-italic"></i> {/* Italic Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('~~  ~~')}>
                        <i className="bi bi-type-strikethrough"></i> {/* Strikethrough Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('# ')}>
                        <i className="bi bi-type-h1"></i> {/* H1 Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('## ')}>
                        <i className="bi bi-type-h2"></i> {/* H2 Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('### ')}>
                        <i className="bi bi-type-h3"></i> {/* H3 Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('#### ')}>
                        <i className="bi bi-type-h4"></i> {/* H4 Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('##### ')}>
                        <i className="bi bi-type-h5"></i> {/* H5 Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('###### ')}>
                        <i className="bi bi-type-h6"></i> {/* H6 Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('- ')}>
                        <i className="bi bi-list-ul"></i> {/* Unordered List Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('1. ')}>
                        <i className="bi bi-list-ol"></i> {/* Ordered List Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('[Link Text](URL)')}>
                        <i className="bi bi-link-45deg"></i> {/* Link Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('``')}>
                        <i className="bi bi-code-slash"></i> {/* Inline Code Icon */}
                    </button>
                    <button className="transparent" type="button" onClick={() => insertMarkdown('```\n  \n```')}>
                        <i className="bi bi-file-earmark-code"></i> {/* Code Block Icon */}
                    </button>
                    {/* Image Dropdown Toggle Button */}
                    <button className="transparent image-dropdown-btn" type="button"onClick={() => setShowImageDropdown(!showImageDropdown)}>


                        <i className="bi bi-image"></i> {/* Image Button */}
                        {showImageDropdown && (
                            <div className="image-dropdown">
                                <ul>
                                    {imageReferences.length > 0 ? (
                                        imageReferences.map((image, index) => (
                                            <li key={index} onClick={() => handleImageClick(image.url)}>
                                                <img src={image.url} alt="Image reference" className="image-thumbnail" />
                                                <span>{image.name}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No images available</li>
                                    )}
                                </ul>
                            </div>
                        )}
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
            </div>
        </div>
    );
};

export default MDEditor;
