# Fancy Todo List API Documentation

#### by Adam Rafiandri, forked from [Majestic Fox 2019](https://github.com/majestic-fox-2019/fancy-to-do "Majestic Fox 2019")

This is my first project on Phase 2.
This simple Todo API gives what you need if you're only looking for some data to store your tasks.

**LET'S JUMP INTO IT!!**

---

These are the routes/endpoints this API has:

| HTTP Method | Route           | Overview                                         |
| ----------- | --------------- | ------------------------------------------------ |
| **POST**    | _/register_     | Posts data to register.                          |
| **POST**    | _/login_        | Posts data to log in via email and password.     |
| **POST**    | _/login/google_ | Posts data to log in via Google account.         |
| **GET**     | _/todos_        | Shows all tasks in form of **Array of Objects**. |
| **POST**    | _/todos_        | Create a new task.                               |
| **GET**     | _/todos/:id_    | Shows specified task.                            |
| **PUT**     | _/todos/:id_    | Updates specified task.                          |
| **DELETE**  | _/todos/:id_    | Deletes specified task.                          |

<br><br>

---

## **POST** _/login_

This generates a token to later be used for authentication.

### Properties Breakdown

- Email (String)
- Password (String)

<br>

#### Request Header

```javascript
{
  "Content-Type": "application/json"
}
```

#### Request Body

```javascript
{
  "email": "your email",
  "password": "your password"
}
```

#### Response

```javascript
{
  "email": "your email",
  "message": "Please login to continue!"
}
```

<br>

## **POST** _/login_

This generates a token to later be used for authentication.

### Properties Breakdown

- Email (String)
- Password (String)

<br>

#### Request Header

```javascript
{
  "Content-Type": "application/json"
}
```

#### Request Body

```javascript
{
  "email": "your email",
  "password": "your password"
}
```

#### Response

```javascript
{
  "token": "generated token"
}
```

<br>

## **POST** _/login/google_

This also generates a token to later be used for authentication.

### Properties Breakdown

- Google Token (String)

<br>

#### Request Header

```javascript
{
  "Content-Type": "application/json"
}
```

#### Request Body

```javascript
{
  "google_token": "your google token"
}
```

#### Response

```javascript
{
  "token": "generated token"
}
```

<br>

## **GET** _/todos_

#### Request Header

```javascript
{
  "Content-Type": "application/json"
}
```

#### Response

```javascript
[
  {
    "id": 9,
    "title": "Make docs",
    "description": "Finish making docs",
    "status": false,
    "due_date": "2020-02-23T00:00:00.000Z",
    "createdAt": "2020-02-03T12:40:15.030Z",
    "updatedAt": "2020-02-03T12:40:15.030Z"
  },
  {
    "id": 10,
    "title": "Learn Vue",
    "description": "Learn hello world using Vue",
    "status": false,
    "due_date": "2020-03-01T00:00:00.000Z",
    "createdAt": "2020-02-03T12:42:30.860Z",
    "updatedAt": "2020-02-03T12:42:30.860Z"
  },
  ...
]
```

<br>

## **POST** _/todos_

### Properties Breakdown

- Title (String)
  - Cannot be null or empty.
- Description (String)
- Status (Boolean)
- Due Date (Date)

> Created At and Update At properties are automatically updated upon PUT and POST methods.

<br>

#### Request Header

```javascript
{
  "Content-Type": "application/json"
}
```

#### Request Body

```javascript
{
  "title": "Learn Vue",
  "description": "Learn hello world using Vue",
  "status": false,
  "due_date": "2020-03-01"
}
```

#### Response

```javascript
{
    "id": 10,
    "title": "Learn Vue",
    "description": "Learn hello world using Vue",
    "status": false,
    "due_date": "2020-03-01T00:00:00.000Z",
    "updatedAt": "2020-02-03T12:42:30.860Z",
    "createdAt": "2020-02-03T12:42:30.860Z"
}
```

ID is automatically incremented and generated.

<br>

## **GET** _/todos/:id_

### Properties Breakdown

- ID (Number)
  - Gotten from client.

Example: http:localhost:3000/**10**

> **10** is the ID.

#### Request Header

```javascript
{
  "Content-Type": "application/json"
}
```

#### Response

```javascript
{
    "id": 10,
    "title": "Learn Vue",
    "description": "Learn hello world using Vue",
    "status": false,
    "due_date": "2020-03-01T00:00:00.000Z",
    "createdAt": "2020-02-03T12:42:30.860Z",
    "updatedAt": "2020-02-03T12:42:30.860Z"
}
```

<br>

## **PUT** _/todos/:id_

### Properties Breakdown

- ID (Number)
  - Gotten from client.

Example: http:localhost:3000/**10**

> **10** is the ID.

- Title (String)
  - Cannot be null or empty.
- Description (String)
- Status (Boolean)
- Due Date (Date)

#### Request Header

```javascript
{
  "Content-Type": "application/json"
}
```

#### Request Body

```javascript
{
    "title": "Learn Vue MORE!",
    "status": true
}
```

#### Response

```javascript
{
    "id": 10,
    "title": "Learn Vue MORE!",
    "description": "Learn hello world using Vue",
    "status": true,
    "due_date": "2020-03-01T00:00:00.000Z",
    "createdAt": "2020-02-03T12:42:30.860Z",
    "updatedAt": "2020-02-03T13:07:12.849Z"
}
```

> See the difference?

_The "updatedAt" property will automatically update itself._

<br>

## **DELETE** _/todos/:id_

### Properties Breakdown

- ID (Number)
  - Gotten from client.

Example: http:localhost:3000/**9**

> **9** is the ID.

#### Request Header

```javascript
{
  "Content-Type": "application/json"
}
```

#### Response

```javascript
{
    "id": 9,
    "title": "Make docs",
    "description": "Finish making docs",
    "status": false,
    "due_date": "2020-02-23T00:00:00.000Z",
    "createdAt": "2020-02-03T12:40:15.030Z",
    "updatedAt": "2020-02-03T12:40:15.030Z"
}
```

> This will output the specified task in object and delete it right away.
