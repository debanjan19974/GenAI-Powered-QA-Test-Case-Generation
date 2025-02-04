import boto3
import json
import docx

# Load text from the Word document
def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    text = "C:\Atomation\GenAI-Powered-QA-Test-Case-Generation\Client Requirement Document.docx".join([para.text for para in doc.paragraphs])  # Join paragraphs with newline
    return text

# AWS Bedrock Client Setup
def invoke_bedrock_model(prompt, model_id="amazon.titan-embed-text-v2:0"):
    client = boto3.client(
        service_name="bedrock-runtime",
        region_name="us-east-1",  # Change to your AWS region
    )
    
    # Construct the request body
    body = json.dumps({
        "inputText": prompt,
        "dimensions": 512,
        "normalize": True
    })

    try:
        # Send the request to the model
        response = client.invoke_model(
            modelId=model_id,
            body=body.encode("utf-8"),  # Body in byte format
            contentType='application/json',  # Specify content type
            accept='*/*'  # Accept all response formats
        )
        
        # Check raw response
        print("Raw response:", response)

        # Decode the response
        response_body = json.loads(response['body'].read().decode("utf-8"))
        print("Decoded response:", response_body)
        
        # Return the outputText or an error message
        return response_body.get("outputText", "No outputText found in response")

    except Exception as e:
        print(f"Error invoking model: {str(e)}")
        return str(e)

# Construct prompt for LLM
def generate_test_cases(document_text):
    prompt = f"""
    Given the following project requirements, generate a set of test cases with test steps.

    PROJECT REQUIREMENTS:
    {document_text}

    OUTPUT FORMAT:
    [
        {{
            "Test Case ID": "TC_001",
            "Description": "Verify that the registration form loads successfully.",
            "Test Steps": [
                "Open the registration page.",
                "Check if all input fields are visible.",
                "Ensure the 'Register' button is enabled."
            ],
            "Expected Result": "The form loads correctly with all elements visible."
        }},
        ...
    ]
    """
    
    return invoke_bedrock_model(prompt)

# Main execution
if __name__ == "__main__":
    file_path = "C:\Atomation\GenAI-Powered-QA-Test-Case-Generation\Client Requirement Document.docx"  # Update if needed
    document_text = extract_text_from_docx(file_path)
    
    test_cases_json = generate_test_cases(document_text)
    print("Generated Test Cases:\n", test_cases_json)
