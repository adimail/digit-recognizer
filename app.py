from flask import Flask, render_template, request, jsonify
import numpy as np
import onnxruntime as ort
from PIL import Image
import io
import base64

app = Flask(__name__)

# Load the ONNX model
onnx_model_path = "./mnist_model.onnx"
ort_session = ort.InferenceSession(onnx_model_path)


def preprocess_image(image_data):
    img_data = base64.b64decode(image_data.split(",")[1])
    img = Image.open(io.BytesIO(img_data)).convert("L")

    img = img.resize((28, 28))  # Resize to 28x28 pixels
    img = np.array(img).astype(np.float32) / 255.0  # Normalize to [0, 1]
    img = img.reshape(1, 28, 28)  # Reshape to (1, 28, 28)

    return img


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        image_data = request.form["image"]
        input_data = preprocess_image(image_data)
        input_name = ort_session.get_inputs()[0].name
        outputs = ort_session.run(None, {input_name: input_data})
        predicted_class = np.argmax(outputs[0], axis=1)[0]

        return jsonify({"prediction": str(predicted_class)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)