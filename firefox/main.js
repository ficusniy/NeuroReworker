document.getElementById('loadingIndicator').classList.add('loading');

// Parsing
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  const activeTab = tabs[0];
  browser.tabs.executeScript(activeTab.id, {
    code: `
      (function() {
        let bodyText = document.body.innerText;
        return bodyText;
      })();
    `,
  }).then((results) => {
    // API call
    if (results && results[0]) {
      async function generateContent(inputText) {
        const url = 'https://smallsitetext.pythonanywhere.com//generate';
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input_text: inputText }),
          });

          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }

          const data = await response.json();
          return data.generated_text;
        } catch (error) {
          console.error('Error calling the API:', error);
          return null;
        }
      }

      generateContent(results[0])
        .then(content => {
          if (content) {
            console.log('Ответ:', content);
            document.getElementById('loadingIndicator').remove(); // Remove loading indicator
            const extractedTextDiv = document.getElementById('extractedText');
            extractedTextDiv.textContent = content;
            extractedTextDiv.style.opacity = 1; // Fade in the text
          }
        });
    } else {
      document.getElementById('loadingIndicator').textContent = 'Произошла ошибка';
    }
  });
});


