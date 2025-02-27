document.getElementById('loadingIndicator').classList.add('loading');

// parsing
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
    // api
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
          console.error('err:', error);
          return null;
        }
      }

      generateContent(results[0])
        .then(content => {
          if (content) {
            console.log('Ответ:', content);
            document.getElementById('loadingIndicator').remove();
            const extractedTextDiv = document.getElementById('extractedText');
            extractedTextDiv.textContent = content;
            extractedTextDiv.style.opacity = 1;
          }
        });
    } else {
      document.getElementById('loadingIndicator').textContent = 'Произошла ошибка';
    }
  });
});


