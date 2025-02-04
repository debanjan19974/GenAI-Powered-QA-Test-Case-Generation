import unittest
from unittest.mock import patch
from read import extract_text_from_docx, invoke_bedrock_model  # Replace 'your_module' with the actual module name

class TestCaseGeneration(unittest.TestCase):
    
    # Test extract_text_from_docx function
    def test_extract_text_from_docx_valid(self):
        # Assuming a valid file path
        file_path = "C:\\Atomation\\GenAI-Powered-QA-Test-Case-Generation\\Client Requirement Document.docx"
        document_text = extract_text_from_docx(file_path)
        self.assertTrue(len(document_text) > 0, "Text should not be empty")

    def test_extract_text_from_docx_invalid_file(self):
        # Test invalid file path
        with self.assertRaises(FileNotFoundError):
            extract_text_from_docx("invalid_file_path.docx")
    
    def test_extract_text_from_empty_docx(self):
        # Assuming an empty document
        file_path = "empty_doc.docx"  # Mock an empty doc
        document_text = extract_text_from_docx(file_path)
        self.assertEqual(document_text, "", "Text should be empty for an empty document")

    # Test invoke_bedrock_model function
    @patch('boto3.client')
    def test_invoke_bedrock_model(self, mock_boto_client):
        mock_client = mock_boto_client.return_value
        mock_client.invoke_model.return_value = {
            'body': json.dumps({"outputText": "Mocked response"})
        }

        prompt = "Test prompt"
        response = invoke_bedrock_model(prompt)
        self.assertIn("Mocked response", response['body'], "Response should contain 'Mocked response'")

if __name__ == '__main__': 
    unittest.main()