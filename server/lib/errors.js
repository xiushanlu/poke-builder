export function sendError(res, status, code, message) {
    return res.status(status).send({"error": {"code": code, "message": message}});
}