# API List

### authRouter
- POST /signup
- POST /login
- POST /logout

### profileRouter
- GET /profile/view
- PATCH /profile/edit
- GET /profile/password

### connectionRequestRouter
- POST /request/send/interseted/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

### profileRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed

