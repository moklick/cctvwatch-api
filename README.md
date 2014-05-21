# cctvwatch-api

An API to provide positions of CCTV cameras.

### Installation
```
$ npm install
```

### Create database and add user
```
$ mongo
> use cctvDb
> db.addUser('cctvAdmin', 'cctvw4tch');
```

### Start server
```
$ npm start
```

### Start the production server
```
$ npm run production
$ npm run stop-server
$ npm run restart-server
```


## API

### Get all CCTV cams

```GET``` **cctv/** 

Returns all CCTV cams as JSON. An object looks like:

```
{
    "_id": "5328ecc72c2b6354bc30358b",
    "location": [
      52.51606,
      13.4023
    ]
  }
```

### Get all CCTV cameras within a certain bounding box

```GET``` **cctv/within** 

Returns all CCTV cameras within the given bounding box as JSON like the method above.

Parameters:

*   bottomleft, type: String **(required)**
*   topright, type: String **(required)**

Example:

```
http://localhost:1337/cctv/within?bottomleft=52.511650,13.389573&topright=52.521887,13.416353
```

### Update a CCTV camera

```UPDATE``` **cctv/update/:id** 

Updates the CCTV camera with the given id.

Parameters:

*   id, type: String **(required)**


### Store a new CCTV cam

```PUT``` **cctv/create**

Stores a new camera object.

Parameters:
*   location, type: String **(required)**
*   model, type: String
*   owner, type: String
*   angle, type: Integer

Example:

```
http://localhost:1337/cctv/create?location=52.711650,13.889573
```


### Requirements

*   nodejs
*   npm
*   mongodb (version >= 2.4)
