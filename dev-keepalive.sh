#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting..." >> dev.log
  npx next dev -p 3000 >> dev.log 2>&1
  CODE=$?
  echo "[$(date)] Exited with $CODE. Restarting in 2s..." >> dev.log
  sleep 2
done
