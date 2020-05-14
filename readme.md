# Twitter Hashtag Feed
## API Endpoints

### `GET` /

**Params**
- count={number} : items per page (optional, default: 20)
- page={number} : current page (optional, default: 1)

**Return**

**Status Code**: 200
```json
{
  "items": [
    {
      "tweetId": "Tweet ID",
      "date": "Tweet Date",
      "images": "Array of image URLs",
      "tweet": "The whole tweet Object",
      "votes": "Object of { type: count }"
    },
    ...
  ],
  "count": "items per page",
  "page": "current page",
  "totalCount": "total count of items"
}
```


### `GET` /tweet/:tweetId/

**Return**

**Status Code**: 200
```json
{
  "tweetId": "Tweet ID",
  "date": "Tweet Date",
  "images": "Array of image URLs",
  "tweet": "The whole tweet Object",
  "votes": "Object of { type: count }"
}
```

### `GET` /fetch/

**Return**

**Status Code**: 200
```json
{
  "added": "Array of tweets added to the DB",
  "notAdded": "Array of tweets not added to the DB (because of image recognition)"
}
```

### `POST` /vote/

Send a vote to a tweet

**Header:**

```
Content-Type: application/json
```

**Body:**  
```json
{
  "tweetId": "My Push",
  "type": "cute | cool | stylish | skip"
}
```

**Return**

**Status Code**: 200
```json
{
  "cool": 0,
  "stylish": 0,
  "cute": 0,
  "skip": 0
}
```

### Error handling

If the request fails, an error object will be returned:

**Status Code**  
3xx, 4xx, 5xx

**Body:**  
```json
{
  "code": "ERROR_CODE",
  "error": "Error description",
  "data": {
    "status": 404, // 3xx, 4xx, 5xx
    "trace": ""
  }
}
```
