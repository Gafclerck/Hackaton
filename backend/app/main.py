from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message" : "Binvenue ! Oui le serveur est bien lancé !"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="localhost", port=8000, reload=True)
