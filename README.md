# Handwritten Digit Recognition

This project is a Flask-based web application that demonstrates a handwritten digit recognition model trained on the [MNIST dataset](https://www.kaggle.com/datasets/hotk/mnist-dataset). The application allows users to draw digits on an [HTML canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). The input is processed as a 28x28 grayscale image, converted into an intensity-based array, and passed to the model for prediction. The recognized digit is displayed in real-time.

## Features

- [x] **Interactive Drawing Canvas**: Users can draw on the web page.
- [x] **MNIST-trained Model**: The model is trained on the MNIST dataset, a standard dataset for handwritten digit recognition.
- [x] **Single Digit numbers**: Can predict single digit numbers.
- [ ] **All numbers**: Enable the model to recognize and interpret multi-digit numbers (e.g., 123)..
- [ ] **Calculate arithmetic operations**: Users can draw for example 2+2 and the model will output 4.

## How It Works

1. **Draw a Digit**: Use your mouse or touch input to draw a digit on the canvas.
2. **Process Input**: The canvas input is resized to 28x28 pixels and converted into a grayscale intensity-based array.
3. **Predict the Digit**: The processed data is sent to the Flask backend, where it is passed to an ONNX model for prediction.
4. **Display the Result**: The predicted digit is displayed on the web page.

## Deployment

This application is deployed on [PythonAnywhere](https://www.pythonanywhere.com/). Note that the hosted site will be **disabled on 19 March 2025**.

## Screenshots

![Drawing Canvas](ss.jpeg)
_Example of the drawing canvas and predicted result._

## Limitations (as of current version)

- The model may occasionally misclassify digits, especially for poorly drawn inputs.
- It is trained on the MNIST dataset, which might not cover all real-world variations in handwriting styles.
- IT can recognise only single digit numbers.
