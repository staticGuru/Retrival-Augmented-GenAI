from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
import os
from fastapi.middleware.cors import CORSMiddleware
import openai

import logging
from dotenv import find_dotenv, load_dotenv
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores.pgvector import PGVector
from langchain.chat_models import ChatOpenAI

from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain.prompts import (
    PromptTemplate,
    SystemMessagePromptTemplate,
)


ROLE_CLASS_MAP = {"assistant": AIMessage, "user": HumanMessage, "system": SystemMessage}

load_dotenv(find_dotenv())
openai.api_key = os.getenv("OPENAI_API_KEY")
CONNECTION_STRING = "postgresql+psycopg2://admin:admin@postgres:5432/microvectordb"
COLLECTION_NAME = "microvectordb"

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

class Message(BaseModel):
    role: str
    content: str


class Conversation(BaseModel):
    conversation: List[Message]


embeddings = OpenAIEmbeddings()
chat = ChatOpenAI(temperature=0)

store = PGVector(
    collection_name=COLLECTION_NAME,
    connection_string=CONNECTION_STRING,
    embedding_function=embeddings,
)
retriever = store.as_retriever()

prompt_template = """As a frequently asked question Bot for my question query, you have the following information about our uploaded documents:

{context}

Please provide the most suitable response for the users question.
Answer:"""

prompt = PromptTemplate(template=prompt_template, input_variables=["context"])
system_message_prompt = SystemMessagePromptTemplate(prompt=prompt)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
