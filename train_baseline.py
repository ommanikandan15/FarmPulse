"""Synthetic scikit-learn workflow demo. Not for real agronomic use."""
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
import numpy as np


def main():
    rng = np.random.default_rng(7)
    X = rng.normal(size=(500, 3))
    # Artificial label purely to demonstrate code flow.
    y = ((X[:, 0] < -0.6) | (X[:, 1] < -0.8)).astype(int)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=7, stratify=y
    )
    model = make_pipeline(
        StandardScaler(),
        RandomForestClassifier(n_estimators=80, random_state=7)
    )
    model.fit(X_train, y_train)
    print("SYNTHETIC DEMO ONLY — not a crop model")
    print(classification_report(y_test, model.predict(X_test)))


if __name__ == "__main__":
    main()
