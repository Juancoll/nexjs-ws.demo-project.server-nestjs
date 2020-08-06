set dest=c:\mongodb

:: Move to destination folder
c:
cd %dest%

:: Stop Service
net stop MongoDB

:: Uninstall MongoDB as a windows service
mongod --config  c:\mongodb\mongod.cfg --remove

:: wait 
TIMEOUT /T 3

:: Remove folder
cd..
rmdir /Q /S %dest%
