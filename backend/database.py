from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

URL_DATABASE = ''

engine = create_engine()
sessionlocal =sessionmaker(autoflush=False,autocommit=False,bind=engine)
base =declarative_base()