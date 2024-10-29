import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeDocument from 'rehype-document';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import {visit} from 'unist-util-visit';

// Function to convert Markdown to HTML
const convertMarkdownToHTML = async (markdown) => {
    try {
        const processor = unified()
            .use(remarkParse) // Parse Markdown
            .use(remarkRehype) // Convert to HTML
            .use(rehypeDocument, { title: 'Markdown Document' }) // Set document title
            .use(rehypeSlug) // Enable heading slugs
            .use(rehypeAutolinkHeadings, {
                behavior: 'wrap', // Wrap the heading with a link
                properties: {
                    className: ['heading-anchor'], // Optional class for styling
                },
            })
            .use(rehypeFormat) // Format the HTML
            .use(rehypeStringify); // Convert back to HTML string

        const file = await processor.process(markdown);
        return String(file); // Return processed HTML as string
    } catch (error) {
        console.error('Error processing markdown:', error);
        return '';
    }
};

// Function to extract headings from Markdown
export const extractHeadingsFromMarkdown = async (markdown) => {
    const processor = unified().use(remarkParse);
    const ast = processor.parse(markdown);
    const headings = [];

    visit(ast, 'heading', (node) => {
        const headingText = node.children[0].value; // Get the text of the heading
        const headingId = headingText.toLowerCase().replace(/[\s]+/g, '-').replace(/[^\w\-]+/g, ''); // Generate a slug from the heading text

        const heading = {
            id: headingId, // Unique ID based on the heading text
            text: headingText, // Get the text of the heading
            level: node.depth // Get the level of the heading (1, 2, 3, etc.)
        };
        headings.push(heading);
    });

    return headings;
};

export default convertMarkdownToHTML;
