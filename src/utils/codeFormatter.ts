export function formatCodeBlock(content: string): string {
  // First handle code blocks
  let formatted = content.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (_, language, code) => `
      <div class="code-block">
        <div class="code-header">
          <span class="language-label">${language || "plaintext"}</span>
          <button 
            class="copy-button" 
            onclick="(function(btn){
              navigator.clipboard.writeText(btn.parentElement.nextElementSibling.textContent)
                .then(() => {
                  btn.textContent = 'Copied!';
                  setTimeout(() => btn.textContent = 'Copy code', 2000);
                })
                .catch(() => btn.textContent = 'Failed to copy');
            })(this)"
          >
            Copy code
          </button>
        </div>
        <pre><code class="language-${
          language || "plaintext"
        }">${code.trim()}</code></pre>
      </div>
    `
  );

  // Then handle inline code with special formatting
  formatted = formatted.replace(
    /`([^`]+)`/g,
    (_, code) =>
      `<code class="inline-code">${code.replace(
        /(\d+)/g,
        '<strong class="number-highlight">$1</strong>'
      )}</code>`
  );

  return formatted;
}
