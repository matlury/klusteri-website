# AI Coding Agent Instructions for Klusteri Website

## Project Overview
This is a full-stack web application for managing a student housing association (Klusteri). It handles reservations, cleaning schedules, night watch responsibilities, defect reporting, and organization management.

**Tech Stack:**
- Backend: Django REST Framework with PostgreSQL
- Frontend: React with Vite, Material-UI, Axios
- Testing: pytest (backend), Jest + Cypress (frontend)
- Deployment: Docker Compose
- Auth: JWT tokens

## Architecture Patterns

### API Structure
- Base URL: `/api/`
- Authentication: `/api/token/` (obtain), `/api/token/refresh/`
- Resources follow REST conventions:
  - List: `GET /api/listobjects/{resource}/`
  - Create: `POST /api/{resource}/create_{resource}`
  - Update: `PUT /api/{resource}/update_{resource}/{id}/`
  - Delete: `DELETE /api/{resource}/delete_{resource}/{id}/`

### Data Models
- **User**: Custom model with roles (1-5), keys access, reservation rights
- **Organization**: Student organizations with email, homepage, color
- **Event**: Reservations with start/end, room, organizer (FK to Organization)
- **NightResponsibility**: YKV (night watch) shifts with login/logout tracking
- **DefectFault**: Maintenance issues with repair tracking
- **Cleaning**: Weekly cleaning assignments between organizations
- **CleaningSupplies**: Inventory of cleaning tools

### Frontend Organization
- Components in `src/components/` - reusable UI elements
- Pages in `src/pages/` - route-based components
- API calls centralized in `src/api/api.ts`
- State management via Context Provider (`src/context/ContextProvider.jsx`)
- Internationalization with react-i18next

## Development Workflows

### Backend Setup
```bash
cd backend
poetry install
poetry shell
python manage.py migrate
python manage.py runserver  # Development only
# For production: gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Testing
- Backend: `cd backend && poetry run pytest`
- Frontend unit: `cd frontend && npm test`
- E2E: `cd frontend && npx cypress open`
- Coverage: `poetry run coverage run --branch -m pytest && coverage report`

### Backend Testing Tips
- **Run in Docker**: If local environment setup is complex, run tests inside the container:
  ```bash
  docker exec ilotalo-new-api-1 pytest tests/test_views.py -n auto
  ```
- **Test Settings**: Pytest uses `backend/test_settings.py` (via `pytest.ini`). This enables `TESTING = True`.
- **Database**: Django's `TestCase` automatically handles database creation/tear-down and wraps tests in transactions.
- **Mocking**: Use `unittest.mock.patch` for external APIs (like reCAPTCHA) or signals.
- **iCal Testing**: Use the `icalendar` library to parse and verify `.ics` responses.
- **Model Creation**: Ensure all required fields are provided. E.g., `User.objects.create_user` requires `username`, `email`, `password`, `telegram`, and `role`.
- **Signal Testing**: When testing `AppConfig.ready()`, remember it's called once at startup. Use fresh instances or patch `sys.argv`/modules to simulate different environments.

### Docker Development
```bash
docker-compose -f docker-compose-dev.yml up --build
```

### Docker Production
```bash
docker-compose -f docker-compose-prod.yml up --build
```

## Code Conventions

### Backend
- Use Poetry for dependency management (not pip)
- Models inherit from Django's base classes
- Views extend DRF's APIView or generics
- Database: PostgreSQL in prod/dev, conditional logic in settings.py
- Scheduler: django-apscheduler for automated tasks

### Frontend
- JSX files with .jsx extension
- Axios instance configured in `src/axios.js`
- Material-UI components with Emotion styling
- Translation keys in `src/translations.json`
- Environment variables prefixed with `VITE_` for client-side access

### Common Patterns
- Error handling: Try/catch in async functions, display user-friendly messages
- Loading states: Use React state for API call status
- Form validation: Client-side with required fields, server-side in DRF serializers
- Authentication: Check JWT token presence, redirect to login on 401
- Permissions: Role-based access (1=admin, 2-5=user levels)

## Key Files to Reference

### Backend
- `backend/settings.py`: Environment-based config, database switching
- `ilotalo/models.py`: Core data models and relationships
- `ilotalo/views.py`: API endpoints implementation
- `ilotalo/urls.py`: URL routing patterns

### Frontend
- `src/api/api.ts`: Centralized API calls
- `src/App.jsx`: Main routing and navigation
- `src/context/ContextProvider.jsx`: Global state management
- `src/components/`: Reusable components (e.g., LoginForm, ReservationsView)

### Configuration
- `docker-compose-dev.yml`: Development environment (uses `Dockerfile.dev`)
- `docker-compose-prod.yml`: Production environment (uses `Dockerfile`)
- `pyproject.toml`: Backend dependencies
- `frontend/package.json`: Frontend scripts and deps

## Gotchas
- Database migrations required after model changes: `python manage.py makemigrations`
- Environment variables loaded via python-dotenv in settings.py
- CORS enabled for frontend-backend communication
- Finnish UI text, English code comments
- Test database isolation using CYPRESS env var
- Scheduler jobs defined in `scheduler/scheduler.py`

## Production

In openshift

Runs through the Dockerfiles, docker composes are not used in production.

**Production Dockerfile**: `backend/Dockerfile` - Multi-stage build with Gunicorn WSGI server, optimized for production with proper security practices and health checks.