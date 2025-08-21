from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import logging
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Set API key
groq_api_key = os.getenv("GROQ_API_KEY")

# Global variables
vectorstore = None
conversation_chain = None
TEMP_DIR = "temp"

# Ensure temp directory exists
os.makedirs(TEMP_DIR, exist_ok=True)

# Configure logging
logging.basicConfig(level=logging.INFO)


# Extract text from PDFs
def get_pdf_text(pdf_files: List[UploadFile]):
    text = ""
    for pdf in pdf_files:
        pdf_path = os.path.join(TEMP_DIR, pdf.filename)
        
        try:
            with open(pdf_path, "wb") as buffer:
                shutil.copyfileobj(pdf.file, buffer)

            # Read PDF
            pdf_reader = PdfReader(pdf_path)
            for page in pdf_reader.pages:
                text += page.extract_text() or ""
            
            # Remove file after processing
            os.remove(pdf_path)
        
        except Exception as e:
            logging.error(f"Error processing {pdf.filename}: {e}")
            raise HTTPException(status_code=500, detail=f"Error reading PDF: {pdf.filename}")
    
    return text


# Split text into smaller chunks
def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n", chunk_size=1000, chunk_overlap=200, length_function=len
    )
    return text_splitter.split_text(text)


# Create FAISS vector store
def get_vectorstore(text_chunks):
    global vectorstore
    try:
        embeddings = HuggingFaceEmbeddings()
        vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
        vectorstore.save_local("./vector_store/faiss_index")
        return vectorstore
    except Exception as e:
        logging.error(f"Error creating vectorstore: {e}")
        raise HTTPException(status_code=500, detail="Vectorstore creation failed")


# Initialize conversation chain
def get_conversation_chain():
    global conversation_chain
    if vectorstore is None:
        raise HTTPException(status_code=400, detail="Vectorstore is not initialized. Process documents first.")
    
    try:
        llm = ChatGroq(model="llama3-8b-8192", api_key=GROQ_API_KEY)
        memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
        conversation_chain = ConversationalRetrievalChain.from_llm(
            llm=llm, retriever=vectorstore.as_retriever(), memory=memory
        )
        return conversation_chain
    except Exception as e:
        logging.error(f"Error creating conversation chain: {e}")
        raise HTTPException(status_code=500, detail="Conversation chain initialization failed")


# API to process uploaded PDF documents
@app.post("/process-docs/")
async def process_documents(file: UploadFile = File(...)):  # Expect a single file
    global vectorstore, conversation_chain
    
    raw_text = get_pdf_text([file])  # Wrap in a list to keep function compatibility
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Uploaded files contain no readable text.")

    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)
    conversation_chain = get_conversation_chain()

    return {"message": "Documents processed successfully! You can now ask questions."}


class QuestionRequest(BaseModel):
    question: str

# API to ask a question after processing documents

@app.post("/ask/")
async def ask_question(request: QuestionRequest):
    if conversation_chain is None:
        raise HTTPException(status_code=400, detail="Please upload and process documents first.")

    try:
        response = conversation_chain.invoke({'question': request.question})
        return {"response": response['chat_history'][-1].content}
    except Exception as e:
        logging.error(f"Error processing question: {e}")
        raise HTTPException(status_code=500, detail="Error processing the question")