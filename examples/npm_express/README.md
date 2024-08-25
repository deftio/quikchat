# ExpressJS / Nodejs Quikchat Starter

This project is an example of integrating the [QuikChatJS](https://github.com/deftio/quikchat) widget with a nodejs web backend. The application includes endpoints for handling both completions and streaming completions from an API like OpenAI's GPT, as well as a chat widget that can be embedded in other applications.

While expressjs is used for the example here, the same code and routes can be used with other nodejs based servers such as bun and deno.

## Project Structure

```text
project-root/
|
|-- static/
|   |-- index.html
|   |-- widget.html
|   |-- quikchat.min.css
|   |-- quikchat.umd.min.js
|
|-- .env
|-- package.json
|-- package-lock.json
|-- server.js
|-- README.md
```

### Files and Directories

- **`static/`**: Contains static assets like HTML, CSS, JavaScript, and images.
  - **`index.html`**: Main HTML file for the chat page.
  - **`widget.html`**: HTML file for the embeddable chat widget.
  - **`quikchat.min.css`**: quikchat css file
  - **`quikchat.umd.min.js`**: quikchat js file
- **`.env`**: Environment variables file. Store sensitive information like API keys here.
- **`package.json`**: Contains project metadata and dependencies.
- **`package-lock.json`**: Locks the versions of dependencies.
- **`server.js`**: Main server file. Defines the Express.js application.
- **`README.md`**: This file, providing an overview of the project.

## Prerequisites

- **Node.js** (v14.x or later)
- **npm** (v6.x or later)
- **An OpenAI API Key** (stored in the `.env` file)

## Getting Started

1. **Clone the QuikChatJS Repository**

   Clone the `quikchatjs` repository and navigate to this example project within the `examples` folder.

   ```bash
   git clone https://github.com/yourusername/quikchatjs.git
   cd quikchatjs/examples/express-chat-widget
   ```

2. **Install Dependencies**

   Use npm to install the required dependencies.

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root of this directory and add your OpenAI API credentials:

   ```plaintext
   OPENAI_BASE_URL=https://api.openai.com/v1
   OPENAI_API_KEY=your-api-key
   ```

4. **Run the Server**

   Start the Express.js server:

   ```bash
   node server.js
   ```

5. **Access the Application**

   Open your browser and go to `http://localhost:8000` to view the chat widget.

## API Endpoints

- **`GET /`**: Serves the main chat page.
- **`GET /widget`**: Serves the embeddable chat widget.
- **`POST /api/completion`**: Receives a message and returns a completion response from the OpenAI API.
- **`POST /api/completion-history`**: Receives a history of messages and returns a completion response considering the conversation context.
- **`POST /api/streaming-completion`**: Streams a completion response in real-time.
- **`POST /api/streaming-completion-history`**: Streams a completion response in real-time considering the conversation context.
