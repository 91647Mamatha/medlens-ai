import os
import json
import sys
import urllib3
from dotenv import load_dotenv
from fastmcp import Client
from database import get_medicine_by_name, save_medicine

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def call_groq_agent_loop(messages, tools=None):
    """Sends one request to Groq, optionally with tool definitions attached."""
    http = urllib3.PoolManager()
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "max_tokens": 1200
    }
    if tools:
        payload["tools"] = tools

    response = http.request(
        "POST",
        GROQ_URL,
        body=json.dumps(payload),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GROQ_API_KEY}"
        }
    )
    return json.loads(response.data.decode("utf-8"))


async def run_wikipedia_mcp_client_engine(medicine_name: str):
    """
    Spawns the local MCP server (wikipedia_mcp.py) as a subprocess,
    lets Groq decide when to call its fetch_medicine_info tool,
    and returns a structured medicine info dict.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    server_script_path = os.path.join(current_dir, "mcps", "wikipedia_mcp.py")

    client = Client({
    "mcpServers": {
        "wikipedia": {
            "command": sys.executable,
            "args": [server_script_path]
        }
    }
})

    async with client:
        discovered_tools = await client.list_tools()

        groq_mapped_tools = [
            {
                "type": "function",
                "function": {
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": tool.input_schema if hasattr(tool, 'input_schema') else tool.inputSchema
                }
            }
            for tool in discovered_tools
        ]

        messages = [
            {
                "role": "system",
                "content": (
                    "You are a clinical pharmacist assistant.\n"
                    f"1. Call the tool 'fetch_medicine_info' for '{medicine_name}' to gather data.\n"
                    "2. Then return ONLY raw JSON matching this exact schema:\n"
                    "{\n"
                    f'  "medicine_name": "{medicine_name}",\n'
                    '  "category": "therapeutic drug class",\n'
                    '  "uses": "primary medical uses",\n'
                    '  "side_effects": "common side effects",\n'
                    '  "interactions": "drug interactions",\n'
                    '  "warnings": "important warnings"\n'
                    "}\n"
                    "No markdown, no backticks, raw JSON only."
                )
            },
            {"role": "user", "content": f"Look up: {medicine_name}"}
        ]

        raw_wiki_summary_text = ""
        ai_message = None

        while True:
            response_payload = call_groq_agent_loop(messages, tools=groq_mapped_tools)
            ai_message = response_payload["choices"][0]["message"]
            messages.append(ai_message)

            if ai_message.get("tool_calls"):
                tool_call = ai_message["tool_calls"][0]
                target_tool_name = tool_call["function"]["name"]
                target_tool_args = json.loads(tool_call["function"]["arguments"])

                mcp_execution_output = await client.call_tool(target_tool_name, target_tool_args)
                extracted_text_block = str(mcp_execution_output)

                if len(extracted_text_block) > 50:
                    raw_wiki_summary_text = extracted_text_block[:3500]

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call["id"],
                    "name": target_tool_name,
                    "content": extracted_text_block
                })
            else:
                break

        try:
            clean_string = ai_message["content"].strip()
            if "```" in clean_string:
                clean_string = clean_string.split("```")[1].replace("json", "")

            parsed_json_data = json.loads(clean_string)

            save_medicine(
                parsed_json_data.get("medicine_name", medicine_name),
                parsed_json_data.get("category", "Unclassified"),
                parsed_json_data.get("uses", "Not available."),
                parsed_json_data.get("side_effects", "Not available."),
                parsed_json_data.get("interactions", "Not available."),
                parsed_json_data.get("warnings", "Consult your doctor."),
                raw_wiki_summary_text
            )

            parsed_json_data["disclaimer"] = "⚠️ This information is for educational purposes only. Always consult your doctor."
            parsed_json_data["source"] = "Wikipedia MCP"
            return parsed_json_data

        except Exception:
            return {
                "medicine_name": medicine_name,
                "category": "General Medication",
                "uses": ai_message["content"] if ai_message else "Not available.",
                "side_effects": "Not available.",
                "interactions": "Not available.",
                "warnings": "Consult your doctor.",
                "disclaimer": "⚠️ Always consult your doctor.",
                "source": "Wikipedia MCP (Fallback Mode)"
            }


async def lookup_medicine(medicine_name: str):
    """
    Main entry point for the medicine lookup flow:
    Local SQLite cache first, Wikipedia MCP on cache miss.
    """
    cleaned_name = medicine_name.strip()

    local_data = get_medicine_by_name(cleaned_name)
    if local_data:
        return {
            "medicine_name": local_data["medicine_name"],
            "category": local_data["category"],
            "uses": local_data["uses"],
            "side_effects": local_data["side_effects"],
            "interactions": local_data["interactions"],
            "warnings": local_data["warnings"],
            "disclaimer": "⚠️ This information is for educational purposes only. Always consult your doctor.",
            "source": "Local Database"
        }

    return await run_wikipedia_mcp_client_engine(cleaned_name)