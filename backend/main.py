from fastapi import FastAPI
from app import config, register_router

if __name__ == "__main__":
    import uvicorn
    try:
        host = config['server']['host']
        port = config['server']['port']
    except Exception as e:
        host = '127.0.0.1'
        port = 80
        print(e)
    uvicorn.run(, host = host, port = port)