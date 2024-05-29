# Endpoints

## Upload File

### URL
`/upload`

### Method
`POST`

### Description
Upload a CSV or Excel file containing lead data and save the data to the database.

### Request Body
- `file` (required): The CSV or Excel file to be uploaded.

### Responses
- `200 OK`: The uploaded data is successfully saved to the database.
  - Content:
    ```json
    [
      {
        "name": "John Doe",
        "mobileNo": "1234567890",
        "email": "john@example.com",
        "propertyType": "Apartment",
        "leadSource": "Website"
      },
      ...
    ]
    ```

- `400 Bad Request`: No file was uploaded or the file format is invalid.
  - Content:
    ```json
    {
      "error": "No file uploaded"
    }
    ```
    or
    ```json
    {
      "error": "Invalid file format. Only CSV and Excel files are supported."
    }
    ```

# Models

## Lead
- `name` (string, required): The name of the lead.
- `mobileNo` (string, required, unique): The mobile number of the lead.
- `email` (string, required, unique, lowercase): The email address of the lead.
- `propertyType` (string, enum): The type of property associated with the lead. Possible values are "Apartment", "House", "Land", or "Commercial".
- `leadSource` (string, enum): The source of the lead. Possible values are "Website", "Referral", "Advertisement", or "Other".
- `createdAt` (date, default: current date): The date when the lead was created.