"""Full-duplex WebSocket handler for real-time continuous behavioral telemetry streaming."""

import json
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.services.auth_service import auth_service
from app.services.ml_detector import ml_detector, DEFAULT_BASELINE_VECTOR
from app.services.risk_engine import risk_engine
from app.services.xai_explainer import xai_explainer

router = APIRouter(tags=["WebSocket"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_json(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(json.dumps(message))

manager = ConnectionManager()

@router.websocket("/ws/continuous-auth")
async def continuous_auth_ws(websocket: WebSocket, token: str = Query(None)):
    """
    WebSocket endpoint for real-time bidirectional telemetry streaming and instant risk evaluation.
    """
    # Authenticate token from query param
    user_id = "usr_demo_101"
    if token:
        payload = auth_service.decode_token(token)
        if payload and "sub" in payload:
            user_id = payload["sub"]

    await manager.connect(user_id, websocket)

    # Send initial connection ack
    await manager.send_json(user_id, {
        "type": "connection_established",
        "payload": {
            "status": "active",
            "message": "Continuous authentication telemetry channel online.",
            "userId": user_id,
        }
    })

    try:
        while True:
            raw_text = await websocket.receive_text()
            try:
                data = json.loads(raw_text)
                msg_type = data.get("type")
                payload = data.get("payload", {})

                if msg_type == "telemetry_batch":
                    features = payload.get("features", {})
                    
                    # 1. Isolation Forest Anomaly Detection
                    anomaly_score = ml_detector.evaluate_sample(user_id, features, DEFAULT_BASELINE_VECTOR)

                    # 2. Risk Engine Dynamic Smoothing
                    smoothed_risk, decision, status_msg = risk_engine.calculate_risk(user_id, anomaly_score)

                    # 3. Explainable AI Feature Attribution
                    xai_factors = xai_explainer.explain_anomaly(features, DEFAULT_BASELINE_VECTOR)

                    # 4. Broadcast live result back to frontend
                    await manager.send_json(user_id, {
                        "type": "evaluation_result",
                        "payload": {
                            "rawAnomalyScore": round(anomaly_score, 3),
                            "riskScore": smoothed_risk,
                            "decision": decision,
                            "statusMessage": status_msg,
                            "xaiExplanations": xai_factors,
                            "evaluatedAt": datetime.utcnow().isoformat(),
                            "features": features,
                        }
                    })

                elif msg_type == "ping":
                    await manager.send_json(user_id, {"type": "pong", "payload": {"timestamp": datetime.utcnow().isoformat()}})

            except Exception as e:
                await manager.send_json(user_id, {
                    "type": "error",
                    "payload": {"message": f"Error processing telemetry: {str(e)}"}
                })

    except WebSocketDisconnect:
        manager.disconnect(user_id)
