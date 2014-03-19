# cctvwatch-api

An API to provide positions of CCTV cameras.

### Installation
```
npm install
```

### Start server
```
sails lift
```

### Import test dataset
```
mongoimport --db cctvDb --collection cctv --type json --file testdata/cctvs.json --jsonArray
```

The dataset contains the locations of the CCTV cams in Berlin. Source [http://www.openstreetmap.org/](OpenStreetMap).

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

### Get all CCTV cams in a certain bounding box

```GET``` **cctv/within** 

Returns all CCTV cams within the given bounding box as JSON like the method above.

Parameters:

*   bottomleft, type: String **(required)**
*   topright, type: String **(required)**

Example:

```
http://localhost:1337/cctv/within?bottomleft=52.511650,13.389573&topright=52.521887,13.416353
```

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
