#!/bin/bash
PROJECT_DIR=~/seismic-viz-backend/current/.env

source $HOME/.nvm/nvm.sh 							# use nvm
if [ ! -f $PROJECT_DIR ]
then
		ln -s ~/.env $PROJECT_DIR 	# symlink for dotenv
fi
npm install
pm2 startOrRestart ecosystem.json