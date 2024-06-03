# Endpoints

## Add User

### URL
`/addUser`

### Method
`POST`

### Description
Add a new user to the database.

### Request Body
- `name` (string, required): The name of the user.
- `mobileNo` (string, required): The mobile number of the user.
- `email` (string, required): The email address of the user.
- `employeeId` (string): The employee code of the user.
- `isActive` (boolean, default: true): Indicates whether the user is active or not.

### Responses
- `201 Created`: The user is successfully added to the database.
  - Content:
    ```json
    {
      "_id": "user_id",
      "name": "John Doe",
      "mobileNo": "1234567890",
      "email": "john@example.com",
      "employeeId": "EMP001",
      "isActive": true
    }
    ```

- `500 Internal Server Error`: Failed to add the user.
  - Content:
    ```json
    {
      "error": "Failed to add user"
    }
    ```

## Get Users

### URL
`/getUsers`

### Method
`GET`

### Description
Get all users from the database.

### Responses
- `200 OK`: Returns an array of users.
  - Content:
    ```json
    [
      {
        "_id": "user_id_1",
        "name": "John Doe",
        "mobileNo": "1234567890",
        "email": "john@example.com",
        "employeeId": "EMP001",
        "isActive": true
      },
      {
        "_id": "user_id_2",
        "name": "Jane Smith",
        "mobileNo": "9876543210",
        "email": "jane@example.com",
        "employeeId": "EMP002",
        "isActive": false
      },
      ...
    ]
    ```

- `500 Internal Server Error`: Failed to get users.
  - Content:
    ```json
    {
      "error": "Failed to get users"
    }
    ```

# Models

## User
- `name` (string, required): The name of the user.
- `mobileNo` (string, required, unique): The mobile number of the user.
- `email` (string, required, unique, lowercase): The email address of the user.
- `employeeId` (string, unique): The employee code of the user.
- `isActive` (boolean, default: true): Indicates whether the user is active or not.