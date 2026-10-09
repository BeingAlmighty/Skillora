# Skillora Career Navigator

Full-stack career guidance application with AI-powered resume analysis and personalized career recommendations.

## 🚀 Tech Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS v4
- Framer Motion
- React Router
- Lucide Icons

**Backend:**
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- Pydantic

## 📦 Project Structure

```
prototype/
├── src/                    # Frontend React code
│   ├── components/        # React components
│   ├── api/              # API client
│   ├── context/          # React contexts
│   └── lib/              # Utilities
├── backend/               # Backend API
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Config & security
│   │   ├── db/           # Database models
│   │   └── schemas/      # Pydantic schemas
│   └── api/              # Vercel serverless entry
├── public/               # Static assets
└── dist/                 # Build output
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL (or use SQLite for development)

### Frontend Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Update `.env`:**
```env
VITE_API_URL=http://localhost:8000/api/v1
```

4. **Start development server:**
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

### Backend Setup

1. **Navigate to backend:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file:**
```bash
cp .env.example .env
```

5. **Update `.env`:**
```env
DATABASE_URL=sqlite:///./skillora.db
SECRET_KEY=your-secret-key-here-min-32-chars
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

6. **Start backend server:**
```bash
# From backend directory
python -m app.main

# Or use uvicorn directly
uvicorn app.main:app --reload --port 8000
```

Backend will run at: `http://localhost:8000`
API Docs: `http://localhost:8000/api/v1/docs`

## 🌐 Deployment (Vercel)

### Quick Deploy

**See the complete step-by-step guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Summary

1. **Deploy Backend:**
   - Create new Vercel project
   - Set Root Directory to `backend`
   - Add environment variables
   - Deploy

2. **Deploy Frontend:**
   - Create new Vercel project
   - Keep Root Directory as `./`
   - Add `VITE_API_URL` with backend URL
   - Deploy

3. **Update CORS:**
   - Add frontend URL to backend `CORS_ORIGINS`
   - Redeploy both

## 📝 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Backend (`backend/.env`)
```env
PROJECT_NAME=Skillora Career Navigator API
API_V1_STR=/api/v1
SECRET_KEY=your-super-secret-key
DATABASE_URL=postgresql://user:pass@host:5432/db
CORS_ORIGINS=http://localhost:5173
```

## 🔧 Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
python -m app.main              # Start server
uvicorn app.main:app --reload   # Start with auto-reload
```

## 🎯 Features

- ✅ User authentication (register/login)
- ✅ AI-powered chat interface
- ✅ Resume analysis and parsing
- ✅ Skill gap analysis
- ✅ Career recommendations
- ✅ ROI calculations
- ✅ Interactive dashboards
- ✅ Responsive design

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI:** `http://localhost:8000/api/v1/docs`
- **ReDoc:** `http://localhost:8000/api/v1/redoc`

## 🐛 Troubleshooting

### Frontend Issues

**Vite error `__vite__injectQuery`:**
```bash
# Clear cache and reinstall
rm -rf node_modules .vite
npm install
```

**API calls failing:**
- Check `VITE_API_URL` in `.env`
- Ensure backend is running
- Check CORS settings

### Backend Issues

**Database connection error:**
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- For dev, use SQLite: `DATABASE_URL=sqlite:///./skillora.db`

**Import errors:**
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [API Documentation](http://localhost:8000/api/v1/docs)

## 💡 Support

For issues and questions:
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Open an issue on GitHub

---

**Built with ❤️ for Skillora Career Navigator**

