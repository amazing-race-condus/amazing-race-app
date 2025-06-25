#!/bin/bash

# Ensures that the script can be run from any directory.
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

# ngrok forwarding runs by default. Use -w flag to skip this step.
if [[ $1 != "-w" ]]; then
    ngrok http 3000 > /dev/null &

    sleep 1

    # Get the forwarding URL and update the relevant environment variable.
    FORWARDING_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | grep -o '"public_url":"https[^"]*' | cut -d'"' -f4)

    if [ -z "$FORWARDING_URL" ]; then
        echo "Failed to extract the forwarding URL."
        echo "Make sure your authentication token is set."
        killall ngrok
        exit 1
    fi

    if grep -q  "EXPO_PUBLIC_BACKEND_URL=" ./frontend/.env; then
        sed -i "s|EXPO_PUBLIC_BACKEND_URL=.*|EXPO_PUBLIC_BACKEND_URL=$FORWARDING_URL/api|" ./frontend/.env
    else
        echo "EXPO_PUBLIC_BACKEND_URL=$FORWARDING_URL/api" >> ./frontend/.env
    fi

    if grep -q  "EXPO_PUBLIC_SOCKET_URL_MOBILE=" ./frontend/.env; then
        sed -i "s|EXPO_PUBLIC_SOCKET_URL_MOBILE=.*|EXPO_PUBLIC_SOCKET_URL_MOBILE=$FORWARDING_URL|" ./frontend/.env
    else
        echo "EXPO_PUBLIC_SOCKET_URL_MOBILE=$FORWARDING_URL" >> ./frontend/.env
    fi

fi

# Start backend
x-terminal-emulator -e "cd ./backend; npm run dev"
BACKEND_PID=$!

# Start frontend
( cd ./frontend ; npx expo start --tunnel ) &
FRONTEND_PID=$!

# Shutdown procedure
function cleanup()
{
    kill $FRONTEND_PID
    kill $BACKEND_PID
}

trap cleanup EXIT

while true
do
    sleep 1
done
