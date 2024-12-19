from flask import Flask, render_template, request, jsonify
import numpy as np
import onnxruntime as ort
from PIL import Image
import io
import base64

app = Flask(__name__)

onnx_model_path = "./mnist_model.onnx"
ort_session = ort.InferenceSession(onnx_model_path)


# This function takes a base64-encoded image, decodes and processes it into
# a format suitable for input into a machine learning model.
# The image is converted to grayscale, resized to 28x28 pixels, normalized,
# and reshaped to match the input format expected by models like those
# trained on the MNIST dataset.


def preprocess_image(image_data):
    try:
        img_data = base64.b64decode(image_data.split(",")[1])
        img = Image.open(io.BytesIO(img_data)).convert("L")
        img = img.resize((28, 28))
        img_array = np.array(img).astype(np.float32)
        img_array = 255 - img_array
        img_array = img_array / 255.0
        img_array = img_array.reshape(1, 28, 28)
        return img_array
    except Exception as e:
        print(f"Preprocessing error: {e}")
        raise


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
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
