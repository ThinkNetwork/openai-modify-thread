window.function = async function(api_key, thread_id, metadata) {
    // Validate API Key
    if (!api_key.value) {
        return "Error: OpenAI API Key is required.";
    }

    // Validate Thread ID
    if (!thread_id.value) {
        return "Error: Thread ID is required.";
    }

    // Validate Metadata
    let metadataValue;
    if (metadata.value) {
        try {
            metadataValue = JSON.parse(metadata.value);
        } catch (e) {
            return "Error: Invalid JSON format for metadata.";
        }
    } else {
        return "Error: Metadata is required.";
    }

    // Construct request payload
    const payload = {
        metadata: metadataValue
    };

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
