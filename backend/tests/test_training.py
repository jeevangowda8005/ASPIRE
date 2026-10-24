from app.ml import train_model


def test_load_dataset_falls_back_to_repository_root_csv(monkeypatch, tmp_path):
    monkeypatch.setattr(train_model, "DATA_PATH", str(tmp_path / "missing.csv"))

    dataset, source = train_model.load_dataset()

    assert source == "real (Kaggle: rxnach/student-stress-factors)"
    assert len(dataset) == 1100
