from dotenv import find_dotenv, load_dotenv
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import PGVector
from langchain_community.document_loaders import DirectoryLoader, TextLoader

load_dotenv(find_dotenv())