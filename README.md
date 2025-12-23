<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Management System - Documentation</title>
    <style>
        :root {
            --color-primary: #1e40af; /* Tailwind blue-700 */
            --color-secondary: #f97316; /* Tailwind orange-600 */
            --color-text: #1f2937; /* Tailwind gray-800 */
            --color-bg: #ffffff;
            --color-code-bg: #1f2937; /* Tailwind gray-800 */
            --color-code-text: #f3f4f6; /* Tailwind gray-100 */
            --color-border: #e5e7eb; /* Tailwind gray-200 */
            --color-copy-bg: #374151; /* Tailwind gray-700 */
            --color-copy-hover: #4b5563; /* Tailwind gray-600 */
            --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            --font-mono: SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace;
        }

        body {
            font-family: var(--font-main);
            color: var(--color-text);
            background-color: var(--color-bg);
            line-height: 1.6;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
        }

        .container {
            width: 100%;
            max-width: 960px;
            padding: 40px 24px;
        }

        /* --- Header & Title --- */
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid var(--color-border);
            padding-bottom: 20px;
        }

        h1 {
            font-size: 2.5rem;
            color: var(--color-primary);
            margin-bottom: 0.5rem;
            font-weight: 800;
        }

        h1 .emoji {
            font-size: 3rem;
            margin-right: 10px;
            vertical-align: middle;
        }

        .subtitle {
            font-size: 1.15rem;
            color: #4b5563; /* Tailwind gray-600 */
            margin-top: 0;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        /* --- Badges --- */
        .badges {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 40px;
        }

        .badges img {
            margin: 5px;
            height: 24px;
            vertical-align: middle;
        }

        /* --- Headings --- */
        h2 {
            font-size: 1.875rem;
            color: var(--color-text);
            border-bottom: 1px solid var(--color-border);
            padding-bottom: 0.3em;
            margin-top: 3.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }

        h3 {
            font-size: 1.5rem;
            color: var(--color-primary);
            margin-top: 2.5rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
        }

        /* --- Content & Typography --- */
        p, ul, ol {
            margin-bottom: 1.25rem;
        }

        a {
            color: var(--color-primary);
            text-decoration: none;
            transition: color 0.2s;
        }

        a:hover {
            color: var(--color-secondary);
            text-decoration: underline;
        }
        
        strong {
            font-weight: 600;
        }

        /* --- Code Block Styling (with Copy Button) --- */
        .code-container {
            position: relative;
            margin-top: 1rem;
            margin-bottom: 1.5rem;
        }

        .code-block {
            background-color: var(--color-code-bg);
            color: var(--color-code-text);
            padding: 1rem;
            padding-top: 2.5rem; /* Space for the copy button */
            border-radius: 6px;
            overflow-x: auto;
            font-family: var(--font-mono);
            font-size: 0.875rem;
            position: relative;
        }
        
        .code-block code {
            all: unset; /* Remove default code styling inside pre */
            font-size: 0.875rem;
            line-height: 1.4;
            display: block;
        }

        .copy-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: var(--color-copy-bg);
            color: var(--color-code-text);
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            font-family: var(--font-main);
            transition: background-color 0.2s, opacity 0.2s;
            opacity: 0.8;
            user-select: none;
        }

        .copy-button:hover {
            background-color: var(--color-copy-hover);
            opacity: 1;
        }
        
        /* Inline Code */
        :not(.code-block) > code {
            background-color: #f1f5f9; /* Tailwind gray-100 */
            color: #b91c1c; /* Tailwind red-700 */
            padding: 0.2em 0.4em;
            border-radius: 4px;
            font-family: var(--font-mono);
            font-size: 0.85em;
        }

        /* --- Architecture Diagram (Specific Pre) --- */
        .architecture-diagram {
            white-space: pre;
            background-color: #f1f5f9; /* Light grey block */
            color: var(--color-text);
            border: 1px solid var(--color-border);
            padding: 1rem;
            border-radius: 6px;
            font-family: var(--font-mono);
            font-size: 0.95rem;
        }
        
        /* --- Footer Quote --- */
        .quote {
            text-align: center;
            margin-top: 40px;
            font-style: italic;
            color: #6b7280; /* Tailwind gray-500 */
            font-size: 0.95rem;
        }
    </style>
    <script>
        function copyCode(button) {
            const codeBlock = button.previousElementSibling;
            const codeToCopy = codeBlock.textContent || codeBlock.innerText;

            navigator.clipboard.writeText(codeToCopy).then(() => {
                const originalText = button.textContent;
                button.textContent = "Copied!";
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Could not copy text: ', err);
                alert('Failed to copy code. Please copy manually.');
            });
        }

        // Initialize on DOMContentLoaded to attach listeners to all buttons
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.copy-button').forEach(button => {
                button.addEventListener('click', () => copyCode(button));
            });
        });
    </script>
</head>
<body>
    <div class="container">

        <!-- ========================= -->
        <!--  Employee Management System  -->
        <!-- ========================= -->

        <header class="header">
            <h1 id="employee-management-system"><span class="emoji">🧑‍💼</span> Employee Management System</h1>

            <p class="subtitle">
                <b>A production-ready full-stack Employee Management System</b><br>
                Built with a <b>Rust server-side backend</b> and a modern React frontend.
            </p>

            <p class="badges">
                <img src="https://img.shields.io/badge/Backend-Rust-orange?style=flat-square" alt="Backend: Rust" />
                <img src="https://img.shi
