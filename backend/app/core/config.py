from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Skillora Career Navigator API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql+psycopg2://postgres.brmmypqwwibrsfxiykce:itachi%406388%26%26@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"
    SECRET_KEY: str = "9115e3eeaaad598145bfe4dc3808ab6b5fd3b14f4593531e9cdfc0016ee04c28"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        case_sensitive=True,
        extra="ignore"
    )

    def get_cors_origins(self) -> List[str]:
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]
        return self.BACKEND_CORS_ORIGINS

settings = Settings()
