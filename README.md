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
Copy the config-sections that you will edit from ```package.json``` to ```local-config.json``` in order to overwrite the global config with your local settings.
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

### Start the production server
In the project folder run:
```
$ npm run production 
$ npm run stop-server
$ npm run restart-server    # with 0ms downtime!!!
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

### Update a CCTV camera (login required)

```UPDATE``` **cctv/update/:id** 

Updates the CCTV camera with the given id.

Parameters:

*   id, type: String **(required)**


### Store a new CCTV cam (login required)

```PUT``` **cctv/create**

Stores a new camera object.

Parameters:
*   name: String
*   description: String
*   location, type: String **(required)** // format: [latitude,longitude]
*   type: String
*   model: String
*   note:  String
*   operator: String
*   angle: Integer
*   url: URL
*   category: String
*   fixme: Boolean
*   osmID: Integer

Example:

```
http://localhost:1337/cctv/create?location=52.711650,13.889573
```


### Requirements

*   nodejs
*   npm
*   mongodb (version >= 2.4)
