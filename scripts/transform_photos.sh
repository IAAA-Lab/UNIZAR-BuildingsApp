#!/bin/bash

# This scripts allows to transform the photos given by the UTC (e.g.: "CSF.1010.SS.080(3) [640x480].jpg") to the needed
# format for our system and insert the information into the database.

HOST=155.210.14.31
BASE_DIR=/var/www/html/photos;
DIR_PHOTOS_ORIG=$BASE_DIR/fotos_reducidas; #Path where the photos to transfer are located
DIR_PHOTOS_DEST=$BASE_DIR;  #Path where photos must be storaged


ls -f $DIR_PHOTOS_ORIG/* | while read -r file; do
	img_file=${file##*/};
	img_name=`echo $img_file | cut -f 1 -d "("`;
	img_date=$(($(date +%s%N)/1000000));
	img_final_name=$img_name"_"$img_date".jpg";

	curl --request POST --verbose --url http://$HOST:8080/mapa/photos/insert/ --header 'cache-control: no-cache'  --header 'content-type: application/json' --data $img_final_name

	cp "$DIR_PHOTOS_ORIG/$img_file" $img_final_name;
done