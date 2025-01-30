window.function = async function(api_key, thread_id, metadata, tool_resources) {
    // Validate API Key
    if (!api_key.value) {
        return "Error: OpenAI API Key is required.";
    }

    // Validate Thread ID
    if (!thread_id.value) {
        return "Error: Thread ID is required.";
    }

    // Parse metadata if provided
    let metadataValue = undefined;
    if (metadata.value) {
        try {
            metadataValue = JSON.parse(metadata.value);
        } catch (e) {
            return "Error: Invalid JSON format for metadata.";
        }
    }

    // Parse tool resources if provided
    let toolResourcesValue = undefined;
    if (tool_resources.value) {
        try {
            toolResourcesValue = JSON.parse(tool_resources.value);
        } catch (e) {
            return "Error: Invalid JSON format for tool resources.";
        }
    }

    // Construct request payload (only include fields if they have valid values)
    const payload = {};
    if (metadataValue) payload.metadata = metadataValue;
    if (toolResourcesValue) payload.tool_resources = toolResourcesValue;

    if (Object.keys(payload).length === 0) {
        return "Error: At least one of metadata or tool_resources must be provided.";
    }

    // API endpoint URL
    const apiUrl = `https://api.openai.com/v1/threads/${thread_id.value}`;

    // Make API request
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key.value}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return `Error ${response.status}: ${errorData.error?.message || "Unknown error"}`;
        }

        // Parse and return the response
        const responseData = await response.json();
        return JSON.stringify(responseData, null, 2);

    } catch (error) {
        return `Error: Request failed - ${error.message}`;
    }
};
