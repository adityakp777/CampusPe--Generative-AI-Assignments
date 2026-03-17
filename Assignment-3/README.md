# AI API Integration
### Generative AI Assignment | CampusPe | Mentor: Jacob Dennis

A Python project that integrates multiple Generative AI APIs to query different AI providers using user prompts. All programs are implemented in Jupyter Notebook (.ipynb) format for clean, readable output with inline responses.

## Project Structure
```
ai-api-integration/
├── groq_example.ipynb
├── huggingface_example.ipynb
├── cohere_example.ipynb
├── ollama_example.ipynb
├── multi_api_query.ipynb
├── requirements.txt
├── README.md
└── screenshots/
    ├── groq_output.png
    ├── huggingface_output.png
    ├── cohere_output.png
    ├── ollama_output.png
    └── multi_api_output.png
```

## Why Jupyter Notebook (.ipynb)?
All programs are written in `.ipynb` format instead of `.py` files because:
- Code and output are visible together in the same file
- Responses from each API are saved inline as cell outputs
- Clean, structured, and easy to read for review
- GitHub renders `.ipynb` files beautifully without needing to run the code

## AI Providers Used

| Provider | Model Used | Type | Speed |
|---|---|---|---|
| Groq | llama-3.3-70b-versatile | Cloud API | ⚡ Fastest |
| HuggingFace | meta-llama/Llama-3.1-8B-Instruct:cerebras | Cloud API | 🔵 Fast |
| Cohere | command-r-08-2024 | Cloud API | 🟡 Medium |
| Ollama | llama3.2 | Local (on device) | 🐢 Slow |

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ai-api-integration
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set Environment Variables
On Mac — add to ~/.zshrc:
```bash
export GROQ_API_KEY="your-groq-key"
export HUGGINGFACE_API_KEY="your-huggingface-key"
export COHERE_API_KEY="your-cohere-key"
```
Then run:
```bash
source ~/.zshrc
```
> Ollama does not require an API key — it runs fully locally on your device.

## How to Obtain API Keys

| Provider | Link |
|---|---|
| Groq | https://console.groq.com/ |
| HuggingFace | https://huggingface.co/settings/tokens |
| Cohere | https://dashboard.cohere.com/ |
| Ollama | No key needed — download from https://ollama.ai/ |

## How to Run

1. Open Jupyter Notebook
2. Open the respective `.ipynb` file for each provider
3. Run all cells (Cell → Run All)
4. Enter your prompt when asked
5. Response appears inline below the cell

## Multi-API Program (Bonus)
`multi_api_query.ipynb` queries **all 4 providers at once** with a single prompt.
- No need to select a provider
- All responses displayed one after another
- Long responses are automatically trimmed with `... (too long)`

## Privacy Note
- **Ollama** runs 100% locally — your prompts never leave your device
- All other providers are cloud-based — prompts are sent to their servers
- API keys are stored in environment variables — never hardcoded in any file

## Dependencies
```
groq
cohere
requests
huggingface_hub
```

## Important Notes
- All API keys are stored securely in environment variables via ~/.zshrc
- Free tier rate limits apply for all cloud providers
- Groq is the fastest provider (uses custom LPU chips)
- Ollama is the slowest as it runs on your local CPU
