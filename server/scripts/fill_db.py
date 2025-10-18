import json
from dotenv import load_dotenv
import os
import sqlite3

load_dotenv()


class Task_type:
    def __init__(self, id: int, name: str, description: str, topic: str, correct_code: str, messed_code: str):
        self.id = id
        self.name = name
        self.description = description
        self.topic = topic
        self.correct_code = correct_code
        self.messed_code = messed_code

class Input:
    def __init__(self, id: int, input: str, input_type: str, input_output_id:int):
        self.id = id
        self.input = input
        self.input_type = input_type
        self.input_output_id = input_output_id

def get_json_data():
    file_path = os.getenv("JSON_FILE_PATH")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            tasks = json.load(f)
            return tasks
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"Error reading JSON: {e}")
        return []


def get_task_data_query(info: Task_type):
    sql_query = """INSERT INTO tasks (id, name, description, topic, correct_code, messed_code)
                   VALUES (?, ?, ?, ?, ?, ?)"""
    return sql_query, (info.id, info.name, info.description, info.topic, info.correct_code, info.messed_code)

def get_input_data_query(info: Input):
    sql_query = """INSERT INTO tasks (id, input, input_type, input_output_id)
                   VALUES (?, ?, ?, ?)"""

    return sql_query, (info.id, info.input, info.input_type, info.input_output_id)

def add_data_to_db(table: str):
    print("Establishing database connection")
    try:
        path = os.getenv('DATABASE_PATH')
        conn = sqlite3.connect('/home/blux/PycharmProjects/refactoai/server/scripts/tasks.db')
        cursor = conn.cursor()

        print("Getting JSON data")
        tasks = get_json_data()

        if not tasks:
            print("No tasks to add")
            return
        if table == 'tasks':
            print("Adding tasks")
            for task_data in tasks:
                task = Task_type(
                    task_data['id'],
                    task_data['name'],
                    task_data['description'],
                    task_data['topic'],
                    task_data['correct_code'],
                    task_data['messed_code']
                )
                query, params = get_task_data_query(task)
                cursor.execute(query, params)

            conn.commit()
            print("All items added successfully")

    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        conn.close()
        print("Database connection closed")



if __name__ == "__main__":
    add_data_to_db('tasks')
