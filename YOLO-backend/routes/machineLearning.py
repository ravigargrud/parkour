from fastapi import APIRouter

router = APIRouter(
    prefix="/ml",
    tags=["ML"]
)

@router.get("/")
def predict():
    return "Hello"