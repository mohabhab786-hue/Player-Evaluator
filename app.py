from flask import Flask, render_template, request
import json
import os

app = Flask(__name__)

DATA_FILE = "evaluations.json"


def load_evaluations():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    return []


def save_evaluation(data):
    evaluations = load_evaluations()
    evaluations.append(data)

    with open(DATA_FILE, "w") as file:
        json.dump(evaluations, file, indent=4)


@app.route("/", methods=["GET", "POST"])
def home():
    result = None
    error = None

    if request.method == "POST":
        try:
            # Player Info
            name = request.form["name"].strip()
            age = int(request.form["age"])
            role = request.form["role"]

            # Validation
            if name == "":
                raise ValueError("Player name cannot be empty")

            if age <= 0:
                raise ValueError("Age must be greater than 0")

            if role == "":
                raise ValueError("Please select a role")

            # Scout Scores
            scores = {
                "Game Awareness": int(request.form["game_awareness"]),
                "Decision Making": int(request.form["decision_making"]),
                "Pressure Handling": int(request.form["pressure_handling"]),
                "Adaptability": int(request.form["adaptability"]),
                "Competitiveness": int(request.form["competitiveness"]),
                "Coachability": int(request.form["coachability"]),
                "Leadership": int(request.form["leadership"]),
                "Role Clarity": int(request.form["role_clarity"])
            }

            # Score Validation
            for score in scores.values():
                if score < 1 or score > 10:
                    raise ValueError(
                        "All scout scores must be between 1 and 10"
                    )

            # Scout Rating Calculation
            average = sum(scores.values()) / len(scores)
            sr = round(average * 10, 2)

            # Classification + Recommendation
            if sr >= 90:
                classification = "Elite"
                recommendation = (
                    "Player demonstrates exceptional scouting "
                    "indicators and should be prioritized for "
                    "advanced opportunities."
                )

            elif sr >= 80:
                classification = "High Potential"
                recommendation = (
                    "Player shows strong potential with minor "
                    "areas for development."
                )

            elif sr >= 70:
                classification = "Strong Prospect"
                recommendation = (
                    "Player is a strong prospect with room "
                    "for improvement."
                )

            elif sr >= 60:
                classification = "Developing"
                recommendation = (
                    "Player requires structured development "
                    "and monitoring."
                )

            else:
                classification = "Needs Improvement"
                recommendation = (
                    "Player needs significant improvement "
                    "before progressing further."
                )

            # Final Result
            result = {
                "name": name,
                "age": age,
                "role": role,
                "scores": scores,
                "sr": sr,
                "classification": classification,
                "recommendation": recommendation
            }

            # Save evaluation locally
            save_evaluation(result)

        except ValueError as e:
            error = str(e)

    evaluations = load_evaluations()

    return render_template(
        "index.html",
        result=result,
        error=error,
        evaluations=evaluations
    )


if __name__ == "__main__":
    app.run(debug=True)