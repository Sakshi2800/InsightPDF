# import nltk
# nltk.download('punkt_tab')
import re
import networkx as nx
import spacy
import json
from pyvis.network import Network
from nltk.tokenize import sent_tokenize
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import pdfplumber
import fitz  # PyMuPDF
import logging
import requests
import pandas as pd
import PyPDF2
import docx
import os
from io import BytesIO
import uvicorn
from dotenv import load_dotenv
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Load NLP model
nlp = spacy.load("en_core_web_sm")

#Groq API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize an empty graph globally
G = nx.Graph()

def read_document(file_path):
    try:
        if file_path.endswith(".pdf"):
            return extract_text_from_pdf(file_path)
        elif file_path.endswith(".txt"):
            with open(file_path, "r", encoding="utf-8") as file:
                return file.read()
        else:
            raise ValueError("Unsupported file format. Only PDF and TXT are supported.")
    except Exception as e:
        logging.error(f"Error reading document: {e}")
        raise HTTPException(status_code=500, detail="Failed to read document")

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        if not text:
            with fitz.open(pdf_path) as doc:
                for page in doc:
                    text += page.get_text("text") + "\n"
        
        return text
    except Exception as e:
        logging.error(f"Error extracting text from PDF: {e}")
        raise HTTPException(status_code=500, detail="Failed to extract text from PDF")

def generate_relationships(text):
    try:
        prompt_template = PromptTemplate.from_template(
            "Extract key entities and their relationships from the following text:\n\n{text}\n\nOutput as structured relationships."
        )

        llm = ChatGroq(model_name="llama3-70b-8192", groq_api_key=GROQ_API_KEY)

        formatted_prompt = prompt_template.format(text=text)
        response = llm.invoke(formatted_prompt)
        structured_text = response.content
        
        return structured_text
    except Exception as e:
        logging.error(f"Error generating relationships: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate relationships")

def extract_entities_relationships(text):
    try:
        sentences = sent_tokenize(text)
        entity_graph = nx.Graph()

        for sentence in sentences:
            doc = nlp(sentence)
            entities = [ent.text for ent in doc.ents]

            for i in range(len(entities) - 1):
                entity_graph.add_edge(entities[i], entities[i + 1], label=sentence)

        return entity_graph
    except Exception as e:
        logging.error(f"Error extracting entities and relationships: {e}")
        raise HTTPException(status_code=500, detail="Failed to extract entities and relationships")

def visualize_graph_interactive(G, filename="graph.html"):
    try:
        net = Network(height="600px", width="100%", bgcolor="#222222", font_color="white", notebook=True)

        for node in G.nodes():
            net.add_node(node, label=node, title=node, color="lightblue")

        for edge in G.edges(data=True):
            net.add_edge(edge[0], edge[1], title=edge[2].get("label", ""), color="gray")

        net.show(filename)
        return filename
    except Exception as e:
        logging.error(f"Error visualizing graph: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate graph visualization")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global G
    try:
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        text = read_document(file_path)
        relationships_text = generate_relationships(text)
        G = extract_entities_relationships(relationships_text)
        
        return {"message": "File uploaded and processed successfully."}
    except Exception as e:
        logging.error(f"Error in file upload processing: {e}")
        raise HTTPException(status_code=500, detail="File processing failed")

@app.get("/graph")
async def get_graph():
    global G
    try:
        if G.number_of_nodes() == 0:
            raise HTTPException(status_code=404, detail="Graph is empty. Upload a file first.")

        graph_file = visualize_graph_interactive(G)
        return FileResponse(graph_file, media_type="text/html", filename="graph.html")
    except Exception as e:
        logging.error(f"Error retrieving graph: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve graph")

def extract_text_from_pdf(file):
    text = ""
    try:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + " "
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {e}")
    return text.strip()

# Function to extract text from a DOCX
def extract_text_from_docx(file):
    try:
        doc = docx.Document(file)
        text = " ".join([para.text for para in doc.paragraphs])
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading DOCX: {e}")

# Function to extract text from a TXT file
def extract_text_from_txt(file):
    try:
        return file.read().decode("utf-8").strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading TXT: {e}")

# Function to extract text from a CSV file
def extract_text_from_csv(file):
    try:
        df = pd.read_csv(file)
        return " ".join(df.astype(str).values.flatten()).strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading CSV: {e}")

# Function to clean and preprocess text
def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)  # Remove special characters
    return text.strip()

# Function to analyze contradictions and correlations using Groq API
def analyze_text_with_groq(text1, text2):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "system", "content": "You are an AI that detects contradictions and correlations in two given texts."},
            {"role": "user", "content": f"Analyze the following two texts and provide:\n1. Key correlations\n2. Key contradictions\n\n--- Text 1 ---\n{text1}\n\n--- Text 2 ---\n{text2}"}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        result = response.json()
        
        if response.status_code == 200 and "choices" in result:
            return result["choices"][0]["message"]["content"]
        else:
            raise HTTPException(status_code=500, detail=f"Error from Groq API: {result.get('error', 'Unexpected API response')}")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"API request failed: {str(e)}")

# Endpoint to compare two uploaded files
@app.post("/analyze/")
async def analyze_files(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    file_text_extractors = {
        "pdf": extract_text_from_pdf,
        "docx": extract_text_from_docx,
        "txt": extract_text_from_txt,
        "csv": extract_text_from_csv,
    }

    ext1 = file1.filename.split(".")[-1].lower()
    ext2 = file2.filename.split(".")[-1].lower()

    if ext1 not in file_text_extractors or ext2 not in file_text_extractors:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    text1 = clean_text(file_text_extractors[ext1](BytesIO(await file1.read())))
    text2 = clean_text(file_text_extractors[ext2](BytesIO(await file2.read())))

    if not text1 or not text2:
        raise HTTPException(status_code=400, detail="One or both files are empty or couldn't be processed")

    analysis_result = analyze_text_with_groq(text1, text2)
    return {"analysis": analysis_result}

# Store the uploaded file temporarily
UPLOAD_FOLDER = "uploadsPA"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

uploaded_file_path = None  # Store path globally


@app.post("/uploadpa/")
async def upload_file(file: UploadFile = File(...)):
    global uploaded_file_path

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    uploaded_file_path = file_path  # Store uploaded file path
    return {"message": "File uploaded successfully", "filename": file.filename}


@app.get("/json/")
async def get_json_output():
    global uploaded_file_path

    if not uploaded_file_path or not os.path.exists(uploaded_file_path):
        return {"error": "No file uploaded yet"}

    # Read CSV and select required columns
    df = pd.read_csv(uploaded_file_path)
    selected_columns = ["Date", "High", "Low"]  # Adjust column names as needed

    if not all(col in df.columns for col in selected_columns):
        return {"error": "CSV file does not contain the required columns"}

    df_selected = df[selected_columns]

    # Convert to JSON format
    json_output = df_selected.to_json(orient="records", indent=4)

    return json.loads(json_output)  # Return as JSON object