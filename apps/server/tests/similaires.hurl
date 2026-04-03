# Basic similaires query
GET http://localhost:3000/similaires?firstname=Jean

HTTP 200
[Asserts]
jsonpath "$" isCollection
jsonpath "$[0].firstname" isString
jsonpath "$[0].correlation" isFloat


# With sourceSex and targetSex
GET http://localhost:3000/similaires?firstname=Camille&sourceSex=2&targetSex=1

HTTP 200
[Asserts]
jsonpath "$" isCollection


# sourceSex only
GET http://localhost:3000/similaires?firstname=Jean&sourceSex=1

HTTP 200
[Asserts]
jsonpath "$" isCollection


# Missing firstname → validation error
GET http://localhost:3000/similaires

HTTP 422
