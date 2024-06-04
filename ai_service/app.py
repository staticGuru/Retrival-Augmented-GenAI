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



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
