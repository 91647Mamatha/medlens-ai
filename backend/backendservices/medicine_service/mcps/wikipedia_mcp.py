import sys
import wikipediaapi
from fastmcp import FastMCP

# Initialize an official FastMCP server engine natively in Python
mcp = FastMCP("MedLens-Wikipedia-Core")

# Standardize user agent to comply with Wikipedia API policy
wiki = wikipediaapi.Wikipedia(language="en", user_agent="MedLensAI/1.0")

@mcp.tool()
def fetch_medicine_info(medicine_name: str) -> str:
    """
    Queries Wikipedia to retrieve a clinical summary for a specified 
    medical drug name or chemical compound.
    """
    # Attempt Primary Page Match
    page = wiki.page(medicine_name)
    if page.exists():
        return page.summary[:3000]

    # Fallback contextual match variant
    page = wiki.page(f"{medicine_name} medication")
    if page.exists():
        return page.summary[:3000]

    return f"Error: Context profile for '{medicine_name}' not found."

if __name__ == "__main__":
    # Launch via standard command-line pipe transport
    mcp.run(transport="stdio")