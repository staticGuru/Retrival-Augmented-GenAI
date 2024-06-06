from dotenv import find_dotenv, load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import PGVector
from langchain_community.document_loaders import DirectoryLoader, TextLoader

load_dotenv(find_dotenv())

embeddings = OpenAIEmbeddings()

loader = DirectoryLoader(
    "./CUSTOM_DATA", glob="**/*.txt", loader_cls=TextLoader, show_progress=True
)
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

CONNECTION_STRING = "postgresql+psycopg2://admin:admin@127.0.0.1:5433/microvectordb"
COLLECTION_NAME = "microvectordb"

PGVector.from_documents(
    docs,
    embeddings,
    collection_name=COLLECTION_NAME,
    connection_string=CONNECTION_STRING,
)