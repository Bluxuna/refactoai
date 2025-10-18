

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from prompts import MAIN_PROMPT
from dotenv import load_dotenv
import os
import subprocess
import tempfile
import sys
load_dotenv()





class CodeChecker:
    """
    A class to perform static analysis on Python code strings.
    """

    @staticmethod
    def check_code_with_pylint(code_string: str) -> str:
        """
        Runs Pylint on a given string of Python code and returns the report.

        Args:
            code_string: A string containing the Python code to check.

        Returns:
            A string containing the Pylint report, or an error message.
        """
        # Pylint cannot run on an empty file, so handle empty input
        if not code_string.strip():
            return "Error: Empty code string provided. Pylint cannot check empty code."

        temp_file_path = None
        try:
            # Create a temporary .py file to store the code
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
                temp_file.write(code_string)
                temp_file_path = temp_file.name

            # Run Pylint as a subprocess and capture its output
            result = subprocess.run(
                ['pylint', temp_file_path],
                capture_output=True,
                text=True,
                timeout=20
            )
            # The Pylint report is sent to stdout
            return result.stdout.strip()

        except FileNotFoundError:
            return "Error: 'pylint' command not found. Is Pylint installed and in your PATH?"
        except (subprocess.TimeoutExpired, OSError) as e:
            return f"An error occurred while running Pylint: {str(e)}"
        finally:
            # Ensure the temporary file is always deleted
            if temp_file_path and os.path.exists(temp_file_path):
                try:
                    os.unlink(temp_file_path)
                except OSError:
                    pass


class Assistant_agent:
    """
    AI Code Review Assistant powered by LangChain + Groq.
    Uses MAIN_PROMPT as the system instruction to analyze and guide user code improvements.
    """
    # MAIN_PROMPT = """
    # You are an AI Code Review Tutor for a programming learning platform.
    # Your role is to help users understand and apply clean code principles and design patterns.
    # Your output(response) must be  only in json format like that :
    #     { 'answer' : "your response",
    #         'hints': ['your generated hints in list']
    #     }
    # # Context Variables:
    # - problem: {}
    # - pylint_report: {}
    # - reference_solution: {}
    # - user_code: {}
    #
    # # Your Objectives:
    # 1. Analyze the user's code quality based on:
    #    - The learning goal described in problem
    #    - The pylint report findings
    #    - The structure and practices seen in reference_solution
    #
    # 2. Identify specific issues or poor practices in {user_code} related to:
    #    - Code readability and maintainability
    #    - Naming conventions and structure
    #    - Pythonic idioms and best practices
    #    - Use of design patterns, where applicable
    #
    # 3. Provide **educational hints**, not solutions.
    #    - Explain *why* a certain pattern or approach might be better.
    #    - Suggest *what to focus on* next to improve code quality.
    #    - Avoid giving exact corrected code or line-by-line fixes.
    #
    # # Tone and Style:
    # - Supportive, didactic, and encouraging
    # - Use clear and concise explanations suitable for learners
    # - Reference pylint findings naturally when giving hints
    #
    # # Important:
    # - NEVER provide the complete corrected code.
    # - ALWAYS provide conceptual or strategic guidance for improvement.
    # - ALways provide small but informative responce in this json format
    #     { 'answer' : "your response",
    #         'hints': ['your generated hints in list']
    #     }
    # - Do not overwrite your response, be exact and give clear hints.
    #
    # """
    MAIN_PROMPT= """You are an AI Code Review Tutor. Your sole purpose is to provide structured, educational feedback on code quality, focusing on clean code and design patterns.

**Output Format Constraint:**
You MUST return a single, valid JSON object and nothing else. Do not include any preceding or trailing text, markdown, or commentary.
Your JSON format must strictly adhere to the following schema:
```json
{
    "answer": "A short, encouraging summary of the main area for improvement (max 2 sentences).",
    "hints": [
        "A conceptual or strategic suggestion for improvement (e.g., 'Review the State design pattern for managing object behavior changes.').",
        "Another conceptual or strategic suggestion, often referencing a Pylint finding or a best practice (e.g., 'Pylint found low complexity; focus on breaking down large functions for readability.').",
        "A final brief, non-solution-based piece of guidance."
    ]
}"""

    def __init__(self, model_name: str = "llama-3.3-70b-versatile", temperature: float = 0.4):
        # Load API key and base prompt
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if not self.groq_api_key:
            raise ValueError("Missing GROQ_API_KEY. Please add it to your .env file.")

        self.model_name = model_name
        self.temperature = temperature
        self.prompt_template = MAIN_PROMPT

        # Initialize the Groq LLM
        self.llm = ChatGroq(
            groq_api_key=self.groq_api_key,
            model_name=self.model_name,
            temperature=self.temperature,
        )

    def run(self, problem: str, pylint_report: str, reference_solution: str, user_code: str) -> str:
        context = {
            "problem": problem,
            "pylint code report": pylint_report,
            "correct pre-generated-code": reference_solution,
            "user generated code": user_code
        }
        prompt = """
        You are an AI Code Review Tutor. Your purpose is to provide short, educational feedback on code quality, focusing on clean code, Pythonic practices, and design patterns.

        **Context Variables for Analysis:**
        - problem: {problem}
        - code clean score : {pylint_report}
        - reference_solution: {reference_solution}
        - user_code: {user_code}

        **Output Format Constraint:**
        You MUST return a single, valid JSON object and nothing else. Do not include any text, markdown, or commentary outside of the JSON structure.
        YOU MUST be more informative to explain given hints in more theoretical way (like if hint contains some technique explain this technique too)
        YOU MUST show or give information in which part of code must needs given hints( explain parts)
        The JSON must strictly adhere to this schema:
        ```
        {
            "answer": "A short, supportive summary of the primary area for improvement (max 2 sentences).",
            "hints": [
                "A conceptual and strategic suggestion based on code principles or design patterns.",
                "A hint addressing a Pylint finding, structure, or naming convention.",
                "A final piece of guidance focused on Pythonic idioms or overall maintainability."
            ]
        }"""
        response = self.llm.invoke(prompt)
        return response.content



# --- Example usage ---
if __name__ == "__main__":


    # Use the mock for the example
    sys_prompt = MAIN_PROMPT


    agent = Assistant_agent()
    problem = """
    Adapt a Fahrenheit-only sensor to a Celsius interface.
    """
    user_code = """
class FahrenheitSensor:
    def read_f(self) -> float:
        return 77.0

class CelsiusReader:
    def read_c(self) -> float: ...

class FahrenheitToCelsiusAdapter(CelsiusReader):
    def __init__(self, sensor: FahrenheitSensor):
        self.sensor = sensor
    def read_c(self) -> float:
        f = self.sensor.read_f()
        return (f - 32) * 5.0/9.0

def main():
    sensor = FahrenheitSensor()
    adapter = FahrenheitToCelsiusAdapter(sensor)
    print(adapter.read_c())
    """

    correct_code = user_code  # Using the same for simplicity in this example

    # Check if CodeChecker is available before running
    try:
        pylent_result = CodeChecker.check_code_with_pylint(user_code)
    except NameError:
        print("Warning: Could not run CodeChecker, using mock result.")
        pylent_result = "Pylint check skipped: 'CodeChecker' not found in environment."
    agent = Assistant_agent()
    response = agent.run(problem, pylent_result, correct_code, user_code)

    print("\n--- Agent Response ---")
    print(response)