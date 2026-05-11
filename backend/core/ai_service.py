import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

async def generate_question(prompt: str, question_type: str):
    """
    Generates a question using Gemini AI based on the provided prompt and type.
    """
    if not GEMINI_API_KEY:
        return {"error": "Gemini API key not configured"}

    try:
        # Try available models in order of preference from the user's list
        models_to_try = [
            'gemini-flash-latest',
            'gemini-2.0-flash-001',
            'gemini-pro-latest',
            'gemini-1.5-flash',
            'gemini-pro'
        ]
        model = None
        last_error = None
        
        for model_name in models_to_try:
            try:
                print(f"Attempting to initialize Gemini model: {model_name}")
                model = genai.GenerativeModel(model_name)
                # We'll try the actual generation with this model
                break
            except Exception as e:
                print(f"Failed to initialize {model_name}: {e}")
                last_error = e
                model = None
                continue
        
        if not model:
            return {"error": f"Could not initialize any Gemini model. Last error: {last_error}"}
        
        system_instruction = f"""
        You are an expert examiner. Generate a {question_type} question based on the following topic: {prompt}.
        Return ONLY a JSON object with the following structure:
        
        For MCQ:
        {{
            "content": "Question text here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "0", (index of the correct option 0-3)
            "explanation": "Brief explanation"
        }}
        
        For CODING:
        {{
            "content": "Problem description here",
            "explanation": "Logic explanation",
            "correctAnswer": "Complete solution code"
        }}
        
        For TRUE_FALSE or tf:
        {{
            "content": "Statement here",
            "correctAnswer": "true", (or "false")
            "explanation": "Brief explanation"
        }}
        
        For DESCRIPTIVE:
        {{
            "content": "Detailed question text",
            "explanation": "Key points for answer"
        }}

        For FILL_BLANKS or blanks:
        {{
            "content": "The capital of France is ______.",
            "correctAnswer": "Paris",
            "explanation": "Paris is the capital and most populous city of France."
        }}

        For MATCHING or match:
        {{
            "content": "Match the countries with their capitals.",
            "options": ["France:Paris", "Germany:Berlin", "Italy:Rome", "Spain:Madrid"],
            "explanation": "Geographical capitals of European nations."
        }}

        For ASSIGNMENT:
        {{
            "content": "Create a research paper on the impact of AI in healthcare.",
            "explanation": "Evaluation criteria: Depth of research, clarity, and citations."
        }}

        For CASE_STUDY:
        {{
            "content": "Scenario: A company is facing a data breach... Question: What are the immediate steps?",
            "explanation": "Focus on incident response protocols."
        }}
        """
        
        response = model.generate_content(system_instruction)
        text = response.text
        
        # Extract JSON if Gemini wraps it in markdown blocks
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        return json.loads(text)
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return {"error": str(e)}
