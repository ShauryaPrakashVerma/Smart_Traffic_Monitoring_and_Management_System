import os
import dotenv

from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///crm.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False