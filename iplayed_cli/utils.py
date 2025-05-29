import json


def read_json(file_path: str):
    """Read a JSON file and return its content."""
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def write_json(file_path: str, data):
    """Write data to a JSON file."""
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
