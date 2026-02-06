import time
import logging

logger = logging.getLogger(__name__)

class RequestTimeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        
        # Log all requests with their path and duration
        # You can adjust the level or only log slow requests if needed
        status_code = response.status_code
        path = request.path
        method = request.method
        
        log_message = f"{method} {path} - Status: {status_code} - Duration: {duration:.4f}s"
        
        if duration > 1.0:
            logger.warning(f"SLOW REQUEST: {log_message}")
        else:
            logger.info(log_message)
            
        return response
