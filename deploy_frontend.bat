@echo off
cd client
RD /S /Q dist
call npm run build
call firebase deploy
cd ..
