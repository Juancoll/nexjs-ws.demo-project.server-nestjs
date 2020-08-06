set src=%~dp0\mongodb
set dest=c:\mongodb

:: copy folder to c:
xcopy %src% %dest% /i /s

:: Move to destination folder
c:
cd %dest%

:: create empty folders for data and log
mkdir data
mkdir log

:: Install MongoDB as a windows Service
mongod --config %dest%\mongod.cfg --install
:: Start Service
net start MongoDB
:: Configure as a ReplicaSet
mongo.exe localhost:27017 rs-initiate.js