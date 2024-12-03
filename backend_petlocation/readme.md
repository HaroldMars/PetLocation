# SAMPLE USAGE

DELETE ALL
http://localhost/deleteall

SAVE/UPDATE DATA
http://localhost/save?pinName=pet%201&lat=10.266549854974041&long=123.84517313906716

GET ALL
http://localhost/getlocations


BACKEND ENV

DB_CONN=mongodb+srv://\<username>:\<password>@\<cluster>.mongodb.net/PETLOCATION_DB_PUBLIC

FRONTEND ENV
VITE_API_URL=http://localhost