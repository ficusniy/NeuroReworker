# данный код выполняется на стороне сервера, но т.к. я сторонник открытого ПО, то прилагаю его тоже.


from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import logging

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)

genai.configure(api_key="api_key")
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route('/generate', methods=['POST'])
def generate_content():
    app.logger.debug("есть запрос")
    data = request.json
    input_text = data.get('input_text')

    if not input_text:
        app.logger.error("ошибка")
        return jsonify({'ошибка'}), 400

    try:
        app.logger.debug(f"генерация: {input_text}")

        response = model.generate_content(f"Я спарсил сайт, сделай краткий пересказ его текста примерно на 300 слов, игнорируя части сайта, не являющиеся самой статьей: {input_text}")

        app.logger.debug(f"получилось: {response.text}")
        return jsonify({'generated_text': response.text})
    except Exception as e:
        app.logger.error(f"ошибка: {str(e)}")
        return jsonify({'ошибка': str(e)}), 500

if __name__ == '__main__':
    app.run(port=2233)
