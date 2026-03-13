# JobSpy MCP Server

A Model Context Protocol (MCP) server that enables AI assistants like Claude to search for jobs across multiple job listing platforms using the [JobSpy](https://github.com/Bunsly/JobSpy) tool.

## Features

- Search for jobs across multiple platforms (Indeed, LinkedIn, Glassdoor, etc.)
- Filter by search terms, location, time frames, and more
- Get structured job data that AI models can easily process
- Format results as JSON or CSV
- Multiple transport options: stdio for Claude integration, SSE for web clients

## Prerequisites

- Node.js 16+
- Python 3.6+
- The JobSpy tool installed and available

## Installation

```bash
# Clone the repository
git clone https://github.com/borgius/jobspy-mcp-server.git
cd jobspy-mcp-server

# Install dependencies
npm install

# Make sure the JobSpy tool is properly set up
cd ../jobSpy
pip install -r requirements.txt
chmod +x run.sh
```

## Configuration

The server will automatically try to locate the JobSpy script in standard locations:
- `../jobSpy/run.sh` (relative to the server directory)
- `./run.sh` (in the current directory)
- `/app/run.sh` (for Docker environments)

### Environment Variables

You can configure the server using the following environment variables:

| Environment Variable    | Description                              | Default     |
|-------------------------|------------------------------------------|-------------|
| `JOBSPY_DOCKER_IMAGE`   | Docker image to use for JobSpy           | `jobspy`    |
| `JOBSPY_ACCESS_TOKEN`   | Access token for JobSpy API (if required)| none        |
| `PORT`                  | Port for the MCP server                  | `9423`      |
| `HOST`                  | Host for HTTP server                     | '0.0.0.0'   |
| `ENABLE_SSE`            | Enable Server-Sent Events transport      | 0        |

## Setting Up Configuration

You can set these configuration values in multiple ways:

### 1. Using environment variables directly

```bash
export JOBSPY_DOCKER_IMAGE=jobspy
export JOBSPY_HOST='0.0.0.0'
export JOBSPY_PORT=9423
export ENABLE_SSE=1
```

### 2. Using a .env file

Create a `.env` file in the root directory with your configuration:

```
JOBSPY_DOCKER_IMAGE=jobspy
JOBSPY_HOST='0.0.0.0'
JOBSPY_PORT=9423
ENABLE_SSE=1
```

## Usage

### Starting the server

```bash
npm start
```

### Connecting with Claude Desktop

Add the following to your Claude Desktop config file (typically at `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "jobspy": {
      "command": "node",
      "args": ["/path/to/jobspy-mcp-server/src/index.js"],
      "env": {
        "ENABLE_SSE": 0
      }
    }
  }
}
```

### Using with Web Clients (SSE Transport)

The server exposes HTTP endpoints that allow web applications to interact with the JobSpy MCP server:

- **Connect for updates**: `GET /mcp/connect`
  - Establishes a Server-Sent Events (SSE) connection for real-time updates
  - Returns progress updates and job search results

- **Send requests**: `POST /mcp/request`
  - Accepts tool invocation requests in MCP format
  - Returns tool responses

Example JavaScript client for browser:

```javascript
// Connect to SSE endpoint
const eventSource = new EventSource('http://localhost:9423/mcp/connect');

// Listen for updates
eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received update:', data);
  
  // Handle progress updates
  if (data.type === 'progress') {
    updateProgressBar(data.progress);
  }
};

// Send a search request
async function searchJobs() {
  const response = await fetch('http://localhost:9423/mcp/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tool: 'search_jobs',
      params: {
        search_term: 'software engineer',
        location: 'San Francisco, CA',
        site_names: 'indeed,linkedin'
      }
    })
  });
  
  return await response.json();
}
```

### API Usage

The server exposes the following endpoints:

#### Search Jobs

```
GET /search
```

Query parameters:
- `site_names`: Comma-separated list of job sites to search
- `search_term`: Term to search for
- `location`: Job location
- And other JobSpy parameters as needed

### Available Tools

#### search_jobs

Searches for jobs across various job listing websites.

**Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| site_names | string | Comma-separated list of job sites to search (indeed,linkedin,zip_recruiter,glassdoor,google,bayt,naukri) | "indeed" |
| search_term | string | Search term for jobs | "software engineer" |
| location | string | Location for job search | "San Francisco, CA" |
| google_search_term | string | Google specific search term | null |
| results_wanted | integer | Number of results wanted | 20 |
| hours_old | integer | How many hours old the jobs can be | 72 |
| country_indeed | string | Country for Indeed search | "USA" |
| linkedin_fetch_description | boolean | Whether to fetch LinkedIn job descriptions (slower) | false |
| format | string | Output format (json or csv) | "json" |
| output | string | Output filename without extension | "jobs" |

**Example usage with Claude:**

```
I need to find senior software engineer jobs in Boston posted in the last 24 hours on both LinkedIn and Indeed.
```

## Docker Support

A Dockerfile is provided to containerize the MCP server:

```bash
# Build the Docker image
docker build -t jobspy-mcp-server .

# Run the container
docker run -p 9423:9423 jobspy-mcp-server
```

## Development

### Running in development mode

```bash
npm run dev
```

### Running tests

```bash
npm test
```

```bash
curl -X POST "http://localhost:9423/api" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "search_jobs",
    "params": {
      "search_term": "software engineer",
      "location": "San Francisco, CA",
      "site_names": "indeed,linkedin",
      "results_wanted": 10,
      "format": "json"
    }
  }'
```  

## License

MIT
