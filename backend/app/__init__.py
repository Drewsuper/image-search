import yaml
from .router import RouterManager

try:
    with open("config.yaml", 'r') as yml:
        config = yaml.safe_load(yml)
except Exception as e:
    config = {}

def register_router(app):
    router_manager = RouterManager()
    # router_manager.add_router(router=chat_route)
    for router in router_manager.get_all_route():
        app.include_router(router)