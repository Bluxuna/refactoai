import subprocess
import tempfile
import os
import sys


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


class ScriptRunner:
    """
    A class to securely run Python code strings in a separate process.
    """

    @staticmethod
    def run_python_code(code_string, args=None, inputs=None):
        # Validate inputs
        if not code_string.strip():
            return "Error: Empty code string provided"
        args = [str(arg) for arg in args or []]  # Convert args to strings, default to empty list
        inputs = inputs or []  # Default to empty list for inputs

        temp_file_path = None
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
                temp_file.write(code_string)
                temp_file_path = temp_file.name

            # Prepare input for stdin (join inputs with newlines)
            stdin_input = "\n".join(str(i) for i in inputs) + "\n" if inputs else None

            # Run the temporary script with arguments and capture output
            result = subprocess.run(
                [sys.executable, temp_file_path] + args,
                input=stdin_input,
                capture_output=True,
                text=True,
                check=True,
                timeout=10  # Prevent infinite loops
            )
            return result.stdout.strip()

        except subprocess.CalledProcessError as e:
            return f"Error: {e.stderr.strip()}"
        except (subprocess.TimeoutExpired, OSError, PermissionError) as e:
            return f"Error: {str(e)}"
        finally:
            # Always clean up the temporary file
            if temp_file_path and os.path.exists(temp_file_path):
                try:
                    os.unlink(temp_file_path)
                except OSError:
                    pass  # Ignore cleanup errors


# Example usage
if __name__ == "__main__":

    # Example code with some obvious Pylint issues
    code_to_check = """
def calculate_sum(value_a, value_b):
    result = value_a + value_b
    return result

class MathOperations:
    def __init__(self, start_value):
        self.start_value = start_value

    def add(self, i):
        self.start_value = calculate_sum(self.start_value, i)
        return self.start_value

if __name__ == '__main__':check
    X = calculate_sum(10, 5)
    ops = MathOperations(X)
    Y = ops.add(5)
    print(Y)
"""
    # Get the Pylint report
    pylint_report = CodeChecker.check_code_with_pylint(code_to_check)
    print("Pylint Report:\n", pylint_report)

