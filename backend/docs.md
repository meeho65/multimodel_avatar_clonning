# 📄 API Documentation

---

## 1. User Registration

### `POST /signup`
Register a new user and upload at least 12 photos (required for fine-tuning).

- **Request (Form Data)**:
  - `username`: string (required)
  - `email`: string (required)
  - `password`: string (required)
  - `photos`: List of image files (at least 12)

- **Response**:
  - `200 OK`: Signup successful, returns user info.
  - `400 Bad Request`: If less than 12 photos uploaded.
  - `500 Internal Server Error`: If signup fails.

---

## 2. User Login

### `POST /login`
Login with username and password to get access token.

- **Request (Form Data)**:
  - `username`: string (required)
  - `password`: string (required)

- **Response**:
  - `200 OK`: Login successful, returns access token.
  - `401 Unauthorized`: Invalid credentials.
  - `500 Internal Server Error`: If login fails.

---

# Protected Endpoints (Authentication Required)

---

## 3. Avatar Generation

### `POST /avatar_gen`
Generate a personalized avatar based on a prompt.

- **Request (Form Data)**:
  - `gender`: string
  - `Background`: string
  - `art_style`: string
  - `accessories`: string
  - `dressing`: string
  - `expression_description`: string
  - `facial_details`: string

- **Response**:
  - `200 OK`: Returns avatar image URL.
  - `400 Bad Request`: If model is not fine-tuned.
  - `500 Internal Server Error`: If avatar generation fails.

---

## 4. Video Generation

### `POST /video_gen`
Generate a video using an avatar and user-provided audio.

- **Request (Form Data)**:
  - `avatar_name`: string (required) — name of the avatar
  - `audio`: audio file (required)
  - `text`: string (optional) — text to enhance TTS (text-to-speech) output

- **Response**:
  - `200 OK`: Video generated, returns video URL.
  - `400 Bad Request`: If model is not fine-tuned or audio cloning fails.
  - `500 Internal Server Error`: If video generation fails.

---

## 5. List User Avatars (Names Only)

### `GET /get_avatars`
Get a list of all generated avatar names for the user.

- **Response**:
  - `200 OK`: List of avatar names.
  - `400 Bad Request`: If model is not fine-tuned.
  - `500 Internal Server Error`: If avatar list retrieval fails.

---

## 6. List User Avatars (Names with Images)

### `GET /get_avatars_with_images`
Get a list of avatar names along with their image URLs.

- **Response**:
  - `200 OK`: Dictionary of `{ avatar_name: avatar_url }`.
  - `400 Bad Request`: If model is not fine-tuned.
  - `500 Internal Server Error`: If avatar retrieval fails.

---

## 7. List Videos for a Specific Avatar

### `GET /get_videos`
Get all videos related to a particular avatar.

- **Request Parameters**:
  - `avatar_name`: string (required) — name of the avatar

- **Response**:
  - `200 OK`: Dictionary of `{ video_name: video_url }`.
  - `400 Bad Request`: If model is not fine-tuned.
  - `500 Internal Server Error`: If video retrieval fails.

---

# 🔒 Authorization

All protected endpoints require **Bearer Authentication**.  
Pass the token received during login in the request headers:

```
Authorization: Bearer <access_token>
```

---

# ❗ Error Responses
| Status Code | Meaning |
|:---|:---|
| 400 | Bad Request |
| 401 | Unauthorized |
| 500 | Internal Server Error |

---

Would you also like me to generate a **Swagger/OpenAPI** compatible `.yaml` or `.json` file for these APIs too? 🚀  
It would make it super easy to auto-generate docs or integrate with Postman/SwaggerUI.