# Image to Video API Documentation

## 3-4【Image to Video】Create Task

### Protocol
- **Protocol:** HTTPS
- **Request URL:** `/v1/videos/image2video`
- **Request Method:** POST
- **Request Format:** `application/json`
- **Response Format:** `application/json`

### Request Header
| Field          | Value                 | Description                                        |
|---------------|----------------------|--------------------------------------------------|
| Content-Type  | application/json      | Data Exchange Format                             |
| Authorization | Authentication token | Refer to API authentication                     |

### Request Body
- The original `model` field has been renamed to `model_name`. However, using `model` will still work as a default behavior.

#### Example Request
```sh
curl --location --request POST 'https://api.klingai.com/v1/videos/image2video' \
--header 'Authorization: Bearer xxx' \
--header 'Content-Type: application/json' \
--data-raw '{
    "model_name": "kling-v1",
    "mode": "pro",
    "duration": "5",
    "image": "https://example.com/image.jpg",
    "prompt": "The astronaut stood up and walked away",
    "cfg_scale": 0.5,
    "static_mask": "https://example.com/static_mask.png",
    "dynamic_masks": [
      {
        "mask": "https://example.com/dynamic_mask_1.png",
        "trajectories": [
          {"x":279,"y":219},{"x":417,"y":65}
        ]
      }
    ]
}'
```

### Request Parameters
| Field          | Type   | Required | Default  | Description |
|---------------|--------|----------|----------|-------------|
| model_name    | string | Optional | kling-v1 | Model Name. Enum: kling-v1, kling-v1-5, kling-v1-6 |
| image        | string | Required | Null     | Reference Image (Base64 or URL). Max size: 10MB. Min resolution: 300x300px |
| image_tail   | string | Optional | Null     | End frame control image (Base64 or URL). |
| prompt      | string | Optional | None     | Positive text prompt (max 2500 chars). |
| negative_prompt | string | Optional | Null  | Negative text prompt (max 2500 chars). |
| cfg_scale    | float  | Optional | 0.5      | Flexibility in video generation. Range: [0,1] |
| mode         | string | Optional | std      | Video generation mode. Enum: std, pro |
| static_mask  | string | Optional | Null     | Static brush mask image (Base64 or URL). Must match input image aspect ratio. |
| dynamic_masks | array | Optional | Null     | List of dynamic masks and their motion trajectories (max 6 groups). |
| duration     | string | Optional | 5        | Video length in seconds. Enum: 5,10 |
| callback_url | string | Optional | None     | Callback URL for task status updates. |
| external_task_id | string | Optional | None | Custom task ID. |

### Response Body
```json
{
  "code": 0,
  "message": "string",
  "request_id": "string",
  "data": {
    "task_id": "string",
    "task_status": "string",
    "task_info": {
      "external_task_id": "string"
    },
    "created_at": 1722769557708,
    "updated_at": 1722769557708
  }
}
```

---

## 3-5【Image to Video】Query Task（Single）

### Protocol
- **Protocol:** HTTPS
- **Request URL:** `/v1/videos/image2video/{id}`
- **Request Method:** GET
- **Request Format:** `application/json`
- **Response Format:** `application/json`

### Request Header
| Field          | Value                 | Description |
|---------------|----------------------|-------------|
| Content-Type  | application/json      | Data Exchange Format |
| Authorization | Authentication token | Refer to API authentication |

### Request Path Parameters
| Field             | Type   | Required | Default | Description |
|------------------|--------|----------|---------|-------------|
| task_id          | string | Optional | None    | Task ID for Image-to-Video query. |
| external_task_id | string | Optional | None    | Custom task ID for Image-to-Video query. |

### Response Body
```json
{
  "code": 0,
  "message": "string",
  "request_id": "string",
  "data": {
    "task_id": "string",
    "task_status": "string",
    "task_status_msg": "string",
    "task_info": {
      "external_task_id": "string"
    },
    "created_at": 1722769557708,
    "updated_at": 1722769557708,
    "task_result": {
      "videos": [
        {
          "id": "string",
          "url": "string",
          "duration": "string"
        }
      ]
    }
  }
}
```

---

## Callback Protocol
When you set the `callback_url` while creating a task, the server will notify you of status changes. The response follows this format:
```json
{
  "task_id": "string",
  "task_status": "string",
  "task_status_msg": "string",
  "created_at": 1722769557708,
  "updated_at": 1722769557708,
  "task_info": {
    "external_task_id": "string"
  },
  "task_result": {
    "videos": [
      {
        "id": "string",
        "url": "string",
        "duration": "string"
      }
    ]
  }
}
```

## Account Information Inquiry
### Query Resource Package List
**Request URL:** `/account/costs`

**Request Method:** GET

**Query Parameters:**
| Field         | Type  | Required | Description |
|--------------|------|----------|-------------|
| start_time   | int  | Yes      | Start time (Unix timestamp in ms) |
| end_time     | int  | Yes      | End time (Unix timestamp in ms) |
| resource_pack_name | string | No | Specific package name |

### Example Response
```json
{
  "code": 0,
  "message": "string",
  "request_id": "string",
  "data": {
    "resource_pack_subscribe_infos": [
      {
        "resource_pack_name": "Video Generation - 10,000 entries",
        "remaining_quantity": 118.0,
        "status": "online"
      }
    ]
  }
}
```