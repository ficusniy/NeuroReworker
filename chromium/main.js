document.getElementById('loadingIndicator').classList.add('loading');

// parsing
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];
  
  chrome.scripting.executeScript({
    target: { tabId: activeTab.id },
    func: () => {
      let bodyText = document.body.innerText;
      console.log('text:', bodyText);
      return bodyText;
    }
  }, (results) => {
    if (chrome.runtime.lastError) {
      console.error('Ошибка:', chrome.runtime.lastError);
      document.getElementById('loadingIndicator').textContent = 'Ошибка';
      return;
    }
    // api
    if (results && results[0] && results[0].result) {
      const inputText = results[0].result;

      async function generateContent(inputText) {
        const url = 'https://smallsitetext.pythonanywhere.com/generate';
        try {
          console.log('запрос отправлен');
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input_text: inputText }),
          });
          if (!response.ok) {
            throw new Error(`статус сервера ${response.status}`);
          }
          const data = await response.json();
          console.log('ответ api:', data);
          return data.generated_text;
        } catch (error) {
          console.error('Ошибка:', error);
          return null;
        }
      }

      generateContent(inputText)
        .then(content => {
          if (content) {
            console.log('Ответ:', content);
            document.getElementById('loadingIndicator').remove();
            const extractedTextDiv = document.getElementById('extractedText');
            extractedTextDiv.textContent = content;
            extractedTextDiv.style.opacity = 1;
          } else {
            document.getElementById('loadingIndicator').textContent = 'ошибка';
          }
        })
        .catch(error => {
          console.error('ошибка:', error);
          document.getElementById('loadingIndicator').textContent = 'ошибка';
        });
    } else {
      console.error('Ошибка');
      document.getElementById('loadingIndicator').textContent = 'Ошибка';
    }
  });
});