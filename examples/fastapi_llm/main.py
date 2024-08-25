from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
import requests
from dotenv import load_dotenv
import os
import uvicorn
import json

app = FastAPI()
load_dotenv()

# Mount the static files directory to serve CSS, JS, and other assets
app.mount("/static", StaticFiles(directory="static"), name="static")

print("OPENAI_BASE_URL:", os.getenv("OPENAI_BASE_URL"))

# Serve the chat page
@app.get("/", response_class=HTMLResponse)
async def get_chat_page():
    with open("./static/index.html", "r") as file:
        content = file.read()
    return HTMLResponse(content=content)

# Endpoint to Serve the chat in embeddable widget
@app.get("/widget", response_class=HTMLResponse)
async def get_chat_widget():
    with open("./static/widget.html", "r") as file:
        content = file.read()
    return HTMLResponse(content=content)

# Endpoint to get a completion response
@app.post("/api/completion")
async def completion(request: Request):
    body = await request.json()
    user_message = body.get("message", "")

    # Example of a simple POST request to OpenAI API
    response = requests.post(
        os.getenv("OPENAI_BASE_URL") + "/chat/completions",
        headers={
            "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-4o",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message},
            ],
            "max_tokens": 1000,
        },
    )

    # Process the response
    if response.status_code == 200:
        response_data = response.json()
        
        # Print the response for debugging
        print("API Response:", response_data)
        
        if "choices" in response_data and len(response_data["choices"]) > 0:
            # Try to extract content differently based on actual API response structure
            choice = response_data["choices"][0]
            if "text" in choice:
                completion_text = choice["text"].strip()
            elif "message" in choice and "content" in choice["message"]:
                completion_text = choice["message"]["content"].strip()
            else:
                return {"error": "Unexpected response structure from API."}
            return {"response": completion_text}
        else:
            return {"error": "No completion text found in the response"}
    else:
        # Optionally, log the response for further investigation
        print(f"Error: {response.status_code}, Response: {response.text}")
        return {"error": f"Failed to fetch completion response. Status code: {response.status_code}"}

# complete-history supports full message history

# Endpoint to get a completion response
@app.post("/api/completion-history")
async def completion_history(request: Request):
    body = await request.json()
    user_messages = body.get("history", "")
    user_messages.insert(0, {"role": "system", "content": "You are a helpful assistant."})

    # Example of a simple POST request to OpenAI API
    response = requests.post(
        os.getenv("OPENAI_BASE_URL") + "/chat/completions",
        headers={
            "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-4o",
            "messages": user_messages,
            "max_tokens": 1000,
        },
    )

    # Process the response
    if response.status_code == 200:
        response_data = response.json()
        
        # Print the response for debugging
        print("API Response:", response_data)
        
        if "choices" in response_data and len(response_data["choices"]) > 0:
            # Try to extract content differently based on actual API response structure
            choice = response_data["choices"][0]
            if "text" in choice:
                completion_text = choice["text"].strip()
            elif "message" in choice and "content" in choice["message"]:
                completion_text = choice["message"]["content"].strip()
            else:
                return {"error": "Unexpected response structure from API."}
            return {"response": completion_text}
        else:
            return {"error": "No completion text found in the response"}
    else:
        # Optionally, log the response for further investigation
        print(f"Error: {response.status_code}, Response: {response.text}")
        return {"error": f"Failed to fetch completion response. Status code: {response.status_code}"}

# Endpoint to stream a response
@app.post("/api/streaming-completion")
async def streaming_completion(request: Request):
    body = await request.json()
    user_message = body.get("message", "")

    # Example of a streaming POST request to OpenAI API
    def generate():
        response = requests.post(
            os.getenv("OPENAI_BASE_URL") + "/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-4o",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_message},
                ],
                "max_tokens": 1000,
                "stream": True,
            },
            stream=True,
        )

        # Stream the response in chunks
        for line in response.iter_lines():
            if line:
                decoded_line = line.decode("utf-8")
                # Remove the "data: " prefix
                if decoded_line.startswith("data: "):
                    decoded_line = decoded_line[len("data: "):]
                # Attempt to parse the JSON string
                try:
                    json_line = json.loads(decoded_line)
                    token = json_line["choices"][0]["delta"].get("content", "")
                    if token:
                        yield token
                except json.JSONDecodeError:
                    continue

    return StreamingResponse(generate(), media_type="text/event-stream")

# streaming-completion-history supports full message history

# Endpoint to stream a response
@app.post("/api/streaming-completion-history")
async def streaming_completion_history(request: Request):
    body = await request.json()
    user_messages = body.get("history", "")
    # add system message to user messages
    user_messages.insert(0, {"role": "system", "content": "You are a helpful assistant."})
    # Example of a streaming POST request to OpenAI API
    def generate():
        response = requests.post(
            os.getenv("OPENAI_BASE_URL") + "/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-4o",
                "messages": user_messages,
                "max_tokens": 1000,
                "stream": True,
            },
            stream=True,
        )

        # Stream the response in chunks
        for line in response.iter_lines():
            if line:
                decoded_line = line.decode("utf-8")
                # Remove the "data: " prefix
                if decoded_line.startswith("data: "):
                    decoded_line = decoded_line[len("data: "):]
                # Attempt to parse the JSON string
                try:
                    json_line = json.loads(decoded_line)
                    token = json_line["choices"][0]["delta"].get("content", "")
                    if token:
                        yield token
                except json.JSONDecodeError:
                    continue

    return StreamingResponse(generate(), media_type="text/event-stream")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info", reload=True)
