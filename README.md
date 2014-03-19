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

## API

```GET``` [http://localhost:1337/cctv/](http://localhost:1337/cctv/) (**Returns all CCTV cams.**)

```GET``` [http://localhost:1337/cctv/within?bottomleft=$lat1,$lng1&topright=$lat2,$lng2](http://localhost:1337/cctv/within?bottomleft=$lat1,$lng1&topright=$lat2,$lng2) (**Returns all CCTV cams within the given bounding box**)

```PUT``` [http://localhost:1337/cctv/create](http://localhost:1337/cctv/) (**Creates new camera**)



### Requirements

*    nodejs
*	npm
