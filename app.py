from flask import Flask, render_template

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    return render_template("homepage.html")

if __name__ == "__main__":
    # Debug mode for development; remove in production
    app.run(debug=True)