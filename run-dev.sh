#!/bin/bash
cd /home/z/my-project
trap 'echo "[$(date)] Got signal, exiting wrapper"; exit 0' TERM INT
while true; do
  echo "[$(date)] Starting dev server..."
  bun run dev 2>&1 &
  CHILD=$!
  wait $CHILD
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE. Restarting in 2s..."
  sleep 2
done
