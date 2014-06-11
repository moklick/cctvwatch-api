# cctvwatch-api

An API to provide positions of CCTV cameras.

## Installation
```
$ npm install
```

### Create database and add user
```
$ mongo
> use cctvDb
> db.addUser('cctvAdmin', 'cctvw4tch');
```

### Configure
Edit the settings in the ```.sailsrc``` file.
Pay particular attention to the following settings:
- mongodb **user**, **pass**, db **name**, **port**
- OAuth **hostname**, github **id**, github **secret** and other OAuth providers config
- sessions secret

>This is how an example of **development-friendly** ```local-config.json``` will looks like:
```
{
  "config": {
    "adapter": {
      "port": 27017,
      "user": "cctv",
      "password": "w4tch"
    },
    "auth": {
      "enabled": false
    }
  }
}
```
Just write it into the project root folder.

### Start server
In the project folder run:
```
$ npm start
```

### Deployment
We use [pod](https://github.com/yyx990803/pod) to deploy our application.
The main steps are:
```sh
git remote add deploy cctv@antares.uberspace.de:~/repos/api.git
```
To deploy the app:
```sh
git push deploy master
```


## API

### Get all CCTV cams

```GET``` **api/v1/cctv/** 

Returns all CCTV cams as JSON. An object looks like:

```
{
  "lat": 52.505742,
  "lng": 13.374043,
  "type": "indoor",
  "operator": "Volksbank",
  "osmID": 380497982,
  "fixme": null,
  "createdAt": "2014-06-02T23:45:57.316Z",
  "updatedAt": "2014-06-02T23:45:57.328Z",
  "id": "538d0cb58fecb45e3819b193"
}
```

### Get all CCTV cameras within a certain bounding box

```GET``` **api/v1/cctv/within** 

Returns all CCTV cameras within the given bounding box as JSON like the method above.

Parameters:

*   north: 'float' **(required)**
*   south: 'float' **(required)**
*   west: 'float' **(required)**
*   east: 'float' **(required)**

Example:

```
http://localhost:1337/api/v1/cctv/within?north=52.511650&west=13.389573&south=52.521887&east=13.416353
```

### Get all CCTV cameras near a certain point

```GET``` **api/v1/cctv/near** 

Returns all CCTV cameras nearby.

Parameters:

*   lat: 'float' **(required)**
*   lng: 'float' **(required)**
*   maxDistance: 'integer' // in meters


Example:

```
http://localhost:1337/api/v1/cctv/near?lat=52.511650&lng=13.389573
```

### Update a CCTV camera (login required)

```UPDATE``` **api/v1/cctv/update/:id** 

Updates the CCTV camera with the given id.

Parameters:

*   id: 'String' **(required)**


### Store a new CCTV cam (login required)

```PUT``` **api/v1/cctv/create**

Stores a new camera object.

Parameters:
*   name: String
*   description: String
*   lat: float **(required)**
*   lng: float **(required)**
*   type: String [indoor, outdoor, webcam]
*   model: String
*   note:  String
*   operator: String
*   angle: Integer
*   url: URL
*   category: String
*   fixme: Boolean
*   osmID: Integer
*   location: array **automatically created** [lat, lng]


Example:

```
http://localhost:1337/api/v1/cctv/create?lat=52.711650&lng=13.889573
```

## Authentification process
  TODO

## Requirements

*   nodejs
*   npm
*   mongodb (version >= 2.4)
