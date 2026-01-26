import sys
import os
import pytest

# Add backend folder to Python path
sys.path.append(r"C:\Users\gouth\OneDrive\Desktop\RepoLens\backend")

from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client
