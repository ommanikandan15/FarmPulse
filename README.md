# ML starter (demonstration only)

`train_baseline.py` creates synthetic data and trains a small scikit-learn model to demonstrate a model-training workflow. This is **not a crop-stress model** and must not be used for farming decisions.

A production ML pipeline needs:
1. Expert-labelled, consented, representative field data.
2. Clear target definitions and documented collection protocols.
3. Train/validation/test splits that avoid leakage across farms and seasons.
4. Baselines, calibration, per-region/crop-stage evaluation, error analysis, and drift monitoring.
5. Explainability (for example SHAP for compatible tree models) plus review by agronomists.
6. Model versioning, model cards, reproducible training, and rollback.

SHAP explanations describe model behaviour; they do not prove the prediction is correct.
