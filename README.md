# PipeLing

An integration between two web services, [Pipedrive](https://www.pipedrive.com/) and [Bling](https://www.bling.com.br/) using [MongoDBAtlas](https://www.mongodb.com/).

## Installation

Use the package manager [node](https://nodejs.org/en/) to install the dependencies.

```bash
npm i
```

### Usage

Use the start script to start the server.

```bash
npm run start
```

## Models

There are two models in the application, the `Day` model and the `Deal` model.

### Deal

A Deal stores all the information from a PipeDrive deal that is necessary for the creation of an order in Bling.
``` json
{
  "_id": "61e6e4395d3196581600ee54",
  "id": 6,
  "value": 900,
  "date": "2022-01-18T00:00:00.000Z",
  "status": "sent",
  "__v": 0
}
```

### Day

A Day aggregates all the deals that were made on that date. All the created Deals creates or updates an existing day in order to register the total value of that date.
``` json
{
  "_id": "61e6e433a0952c33d59bfe28",
  "date": "2022-01-17T00:00:00.000Z",
  "__v": 0,
  "value": 1076
},
```



## REST API - Deals

### Get all deals

`GET /deals`

Returns all the Deals that are stored in the database

``` json
    HTTP/1.1 200 OK
    [
      {
        "_id": "61e6e4395d3196581600ee54",
        "id": 6,
        "value": 900,
        "date": "2022-01-18T00:00:00.000Z",
        "status": "sent",
        "__v": 0
      },
      ...
    ]
```

### Get a deal by its ID

`GET /deal/:id`

Returns a unique Deal with that ID if it exists.

``` json
    HTTP/1.1 200 OK
    [
      {
        "_id": "61e6e4395d3196581600ee54",
        "id": 6,
        "value": 900,
        "date": "2022-01-18T00:00:00.000Z",
        "status": "sent",
        "__v": 0
      }
    ]
```

### Create a deal

`POST /deal`

This route accepts two body formats, one for simple insertion and other for the PipeDrive webhook integration.

- Simple body format:

`body: {
    "id": 15,
    "value": 100,
    "update_time": "01/18/2022",
    "person_name": "Iago",
    "status": "won"
}`

- [PipeDrive](https://www.pipedrive.com/) webhook body format:

`{
 ... "current": { ... "id": 15, "value": 100, "update_time": "01/18/2022", "person_name": "Iago", "status": "won" ... } ... 
}`

All the Deals created with this route will generate an order creation request to [Bling](https://www.bling.com.br/) and will update its status to `sent` or `not_sent`according to the result.

All the Deals created with this route will create or update an existing day with its value.

Returns the created Deal, with two additional values that defines if the deal was inserted into the database and if the deal was send to [Bling](https://www.bling.com.br/)

``` json
    HTTP/1.1 201 OK
    {
      "deal": {
        "_id": "61e9545d7aa0c5f7902d81e2",
        "id": 15,
        "person_name": "Iago",
        "value": 100,
        "date": "2022-01-18T00:00:00.000Z",
        "status": "sent",
        "__v": 0
      },
      "inserted": true,
      "sent": true
    }
```

#### Integrating with PipeDrive

You can set a [PipeDrive](https://www.pipedrive.com/) event based webhook to make every won Deal be automatically stored in the database and sent to [Bling](https://www.bling.com.br/) API.

Set the `event action` to `updated` and the `event object` to `deal`.

At the `endpoint URL`, insert this "Create a deal route".


## REST API - Deals verification

### Verify PipeDrive

`GET /deals/verify/pipedrive`

Get all the won Deals in [PipeDrive](https://www.pipedrive.com/) using its API.

Each deal will be inserted in the database if it is not already inserted.

If the deal was not in the database or has the `not_sent` status, an order creation request will be sent to [Bling](https://www.bling.com.br/). 

Returns the results of the routine and all the Deals that were received from [Pipedrive](https://www.pipedrive.com/).

``` json
    HTTP/1.1 200 OK
    {
      "result": {
        "read": 7,
        "registered": 0,
        "sent": 0
      },
      "data": [
        {
          "deal": {
            "_id": "61e6e4ebdebace6e82488e67",
            "id": 1,
            "value": 10,
            "date": "2022-01-17T00:00:00.000Z",
            "status": "sent",
            "__v": 0
          },
          "inserted": false,
          "sent": false
        },
        ...
      ]
    }
```

### Verify MongoDBAtlas

`GET /deals/verify/mongo`

Get all the deals from MongoDBAtlas that are `not_sent` and attempt to create an order in [Bling](https://www.bling.com.br/).

Returns the results of the routine and all the Deals that were found in the [MongoDBAtlas](https://www.mongodb.com/).

``` json
    HTTP/1.1 200 OK
    {
      "result": {
        "read": 7,
        "registered": 0,
        "sent": 0
      },
      "data": [
        {
          "deal": {
            "_id": "61e6e4ebdebace6e82488e67",
            "id": 1,
            "value": 10,
            "date": "2022-01-17T00:00:00.000Z",
            "status": "sent",
            "__v": 0
          },
          "inserted": false,
          "sent": false
        },
        ...
      ]
    }
```

## REST API - Days

### Get all days

`GET /days`

Returns all the Days that are stored in the database

``` json
    HTTP/1.1 200 OK
    [
      {
        "_id": "61e6e433a0952c33d59bfe28",
        "date": "2022-01-17T00:00:00.000Z",
        "__v": 0,
        "value": 1076
      },
      ...
    ]
```

### Get a day by its Date

`GET /day/:date`

Returns a unique Day with that Date if it exists.

``` json
    HTTP/1.1 200 OK
    [
      {
        "_id": "61e6e433a0952c33d59bfe28",
        "date": "2022-01-17T00:00:00.000Z",
        "__v": 0,
        "value": 1076
      },
      ...
    ]
```

