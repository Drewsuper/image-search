from fastapi import FastAPI
from app.router.search_router import router
import os

# 创建 FastAPI 应用实例
app = FastAPI()

# 挂载路由
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    try:
        # 读取主机和端口
        from app import config
        host = config.get('server', {}).get('host', '127.0.0.1')
        port = config.get('server', {}).get('port', 8000)
    except (ImportError, KeyError, AttributeError) as e:
        host = '127.0.0.1'
        port = 8000
        print(f"配置加载失败，使用默认值 {host}:{port}，错误: {e}")

    # 确保 videos 和 targets 目录存在
    os.makedirs("videos", exist_ok=True)
    os.makedirs("targets", exist_ok=True)

    uvicorn.run(app, host=host, port=port)