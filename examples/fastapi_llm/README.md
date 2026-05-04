# FastAPI Quikchat Starter

This project is an example of integrating the [QuikChatJS](https://github.com/deftio/quikchat) widget with a Python FastAPI webbackend. The application includes endpoints for handling both completions and streaming completions from an API like OpenAI's GPT, as well as a chat widget that can be embedded in other applications.

## Project Structure

```text
/examples/FastApi-Quikchat-Starter
|--- app.py                      # Main FastAPI application
|--- static/
|   |-- index.html              # Main chat page
|   |-- widget.html             # Embeddable chat widget page
|   |-- quikchat.css            # QuikChatJS CSS
|   |-- quikchat.umd.min.js     # QuikChatJS JavaScript
|-- .env                        # Environment variables
|-- README.md                   # This documentation
|-- requirements.txt            # Python dependencies
```

## Setup

### Prerequisites

- Python 3.10+
- [pip](https://pip.pypa.io/en/stable/)

### Installation


1. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:

   Create a `.env` file in the root of the project with the following content:

   ```plaintext
   OPENAI_BASE_URL=https://api.openai.com/v1
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   Replace `your_openai_api_key_here` with your actual OpenAI API key.

### Running the Application

To start the FastAPI server, run:

```bash
python main.py
```

The server will start on `http://127.0.0.1:8000`.

Then go to your browser and open up http://127.0.0.1:8000.


### Endpoints

- **`/`**: Serves the main chat page.
- **`/widget`**: Serves quikchat as an embeddable chat widget page.
- **`/api/completion`**: POST endpoint for fetching a completion response.
- **`/api/completion-history`**: POST endpoint for fetching a completion response using full message history.
- **`/api/streaming-completion`**: POST endpoint for streaming a completion response.
- **`/api/streaming-completion-history`**: POST endpoint for streaming a completion response with full message history.

### Example Usage

- **Main Chat Interface**: Access the main chat interface by navigating to `http://127.0.0.1:8000/` in your browser.
  
- **Embeddable Widget**: Access the embeddable widget by navigating to `http://127.0.0.1:8000/widget`.

### Development

While the server is running, any changes you make to the `main.py` or static files will be automatically reloaded.

### Notes

- The example is designed to demonstrate how to integrate the QuikChatJS widget with FastAPI and an LLM API. Customize the code as needed for your specific use case.
- Also this folder is designed to be stand-alone.  One should be able to copy it and run it locally.  To achieve this quikchat.umd.min.js and quikchat.min.css are served from a locally copy inside the static folder in this directory.
