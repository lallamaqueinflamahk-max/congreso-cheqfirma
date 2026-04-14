from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "proyecto": "Congreso Cheqfirma",
        "mensaje": "Si ves esto, el deploy fue exitoso"
    }

@app.get("/test")
def test():
    return {"message": "Ruta de prueba funcionando"}

