#====================================================
# This script updates the 'uzapp' mobile app and admin webapp.
#
# It must be executed as 'root' user (sudo)
#
# Script usage: ./deploy.sh [-h] -b BRANCH [-t]
#
# Where arguments are:
#       -h: show help
#       -b BRANCH: select repo branch
#	-t: development deploy (default to production deploy)
#
# BASE_DIR var will point to the root path of the GIT repo of the app
#
# Once deployed:
#	- the map app will be running at: http://155.210.14.31:8080/mapa/www/
#	- the admin app will be running at: http://155.210.14.31:8080/admin
#	- the mobile app will be available to download at: http://155.210.14.31/uz-map.apk
#
# On development enviroment:
#	- the map app will be running at: http://155.210.14.31:8080/mapa_test/www/
#       - the admin app will be running at: http://155.210.14.31:8080/admin_test
#       - the mobile app will be available to download at: http://155.210.14.31/uz-map-test.apk
#
#====================================================



##############################################
#INSTALLATIONS && DEPENDENCIES
##############################################

# TOMCAT SERVER
# APACHE SERVER
# GIT

#GRADLE
#sudo add-apt-repository ppa:cwchien/gradle
#sudo apt-get update
#sudo apt-get install gradle-ppa

#NPM, BOWER, CORDOVA && IONIC FRAMEWORK
#sudo apt-get install npm
#sudo npm install -g bower
#sudo npm intall -g cordova ionic gulp

#ANDROID SDK
#wget https://dl.google.com/android/android-sdk_r24.4.1-linux.tgz
#tar -xvf android-sdk_r24.2-linux.tgz
#cd android-sdk-linux/tools
#./android update sdk --no-ui
#echo "export PATH=${PATH}:$HOME/sdk/android-sdk-linux/platform-tools:$HOME/sdk/android-sdk-linux/tools:$HOME/sdk/android-sdk-linux/build-tools/24.0.2/" >> /root/.bashrc
#source /root/.bashrc
#apt-get install libc6:i386 libstdc++6:i386 zlib1g:i386



##############################################
#   DEFINITIONS
#############################################

#FUNCTIONS DEFINITIONS
function show_help {
	 echo "";echo "";
         echo "Script usage: ./deploy.sh [-h] -b BRANCH [-t]"
         echo "";
         echo "Where options are:"
         echo "    -h: show help"
         echo "    -b BRANCH: select repo branch"
	 echo "    -t: test deploy (default to production deploy)"
         echo ""; echo "";
	 exit 0;
}

#VAR DEFINITIONS
export JAVA_HOME=/usr/lib/jvm/java-8-oracle
BASE_DIR=/home/dgarcia/UNIZAR-BuildingsApp
BRANCH="develop"
TEST=false
USER=$(whoami)
ORIG_DIR=$(pwd)


###############################################
# SCRIPT VALIDATIONS
##############################################

#CHECK IF USER IS ROOT
if [ "$USER" == "root" ]
then
	echo ""; echo "";
        echo "You are ROOT";
else
	echo ""; echo "";
        echo "You are NOT ROOT user, please execute script as ROOT";
        exit 0;
fi

#CHECK NUMBER OF ARGUMENTS
if [ $# -lt 1 ]
then
	echo "";echo "";
	echo "ERROR: At least -b BRANCH option is mandatory"
	show_help
fi

#CHECK ARGUMENTS/OPTIONS
while getopts "htb:" opt; do
	case "$opt" in
	h|\?)
		show_help
		exit 0
		;;
	b)
		BRANCH=$OPTARG
		;;
	t)
		TEST=true
		;;
	esac	
done

#################################################
#   RUN SCRIPT
################################################

#SERVER PHOTOS BACKUP
mv /var/lib/tomcat7/webapps/mapa/www/images/photos $HOME/photos_bck

echo "";echo "";
echo "#############################################################"
echo "RUNNING DEPLOY SCRIPT..."
echo "#############################################################"
echo "";echo "";

#UPDATE REPOSITORY
echo "#############################################################"
echo "UPDATING REPOSITORY FROM origin/$BRANCH";
echo "#############################################################"
echo "";echo "";

cd $BASE_DIR
git checkout .
git fetch --all
git checkout $BRANCH
git clean -fd
git reset --hard origin/$BRANCH
git pull origin $BRANCH

# REPLACE DEV VARS TO PRODUCTION VARS
if [ "$TEST" = true ]
then
	sed -i 's/localhost:8080/155.210.14.31:8080\/mapa_test/g' $BASE_DIR/src/main/webapp/www/js/constants.js
	sed -i 's/localhost:8080/155.210.14.31:8080\/mapa_test/g' $BASE_DIR/src/main/webapp/www/js/constants.js
	sed -i 's/PROD_API_URL/http:\/\/155.210.14.31:8080\/mapa_test/g'  $BASE_DIR/admin/dist/js/config.js
else
	sed -i 's/localhost:8080/155.210.14.31:8080\/mapa/g' $BASE_DIR/src/main/webapp/www/js/constants.js	
	sed -i 's/localhost:8080/155.210.14.31:8080\/mapa/g' $BASE_DIR/src/main/webapp/www/js/constants.js
	sed -i 's/PROD_API_URL/http:\/\/155.210.14.31:8080\/mapa/g'  $BASE_DIR/admin/dist/js/config.js
fi
sed -i 's/DB_UZAPP_HOST/155.210.14.31/g' $BASE_DIR/src/main/resources/config.properties
sed -i 's/DB_UZAPP_NAME/uzapp/' $BASE_DIR/src/main/resources/config.properties
sed -i 's/DB_UZAPP_USER/prueba/' $BASE_DIR/src/main/resources/config.properties
sed -i 's/DB_UZAPP_PASSWORD/XXXXX/' $BASE_DIR/src/main/resources/config.properties
sed -i 's/DB_UZAPP_SUPERUSER_PASSWORD/XXXXX/' $BASE_DIR/src/main/resources/config.properties
sed -i 's/DB_UZAPP_SUPERUSER/postgres/' $BASE_DIR/src/main/resources/config.properties
sed -i 's/DB_SIGEUZ_HOST/155.210.21.36/' $BASE_DIR/src/main/resources/config.properties
sed -i 's/DB_SIGEUZ_NAME/sigeuz/' $BASE_DIR/src/main/resources/config.properties
sed -i 's/DB_SIGEUZ_USER/postgres/' $BASE_DIR/src/main/resources/config.properties
sed -i 's/DB_SIGEUZ_PASSWORD/XXXXX/' $BASE_DIR/src/main/resources/config.properties

#INSTALL DEPENDENCIES ON MOBILE APP
echo ""; echo "";
echo "#############################################################"
echo "INSTALLING DEPENDENCIES ON MOVILE APP: $BASE_DIR/src/main/webapp/"
echo "#############################################################"
echo ""; echo "";
cd $BASE_DIR/src/main/webapp/
bower --allow-root install
npm install

#SETUP IONIC APP
echo ""; echo "";
echo "#############################################################"
echo "SETTING UP IONIC APP..."
echo "#############################################################"
echo ""; echo "";
ionic setup sass

#BUILD APK
echo ""; echo "";
echo "#############################################################"
echo "BUILDING APK..."
echo "#############################################################"
echo ""; echo "";

ionic platform rm android
ionic platform add android
ionic platform android
ionic plugin add cordova-plugin-file-transfer cordova-plugin-camera cordova-plugin-imagepicker cordova-plugin-whitelist ionic-plugin-keyboard cordova-plugin-android-permissions@0.10.0
ionic build android

if [ "$TEST" = true ]
then
	mv /home/dgarcia/UNIZAR-BuildingsApp/src/main/webapp/platforms/android/build/outputs/apk/android-debug.apk /var/www/html/uz-map-test.apk
	chmod 0777 /var/www/html/uz-map-test.apk
else
	mv /home/dgarcia/UNIZAR-BuildingsApp/src/main/webapp/platforms/android/build/outputs/apk/android-debug.apk /var/www/html/uz-map.apk
	chmod 0777 /var/www/html/uz-map.apk
fi

#INSTALL DEPENDENCIES ON ADMIN APP
echo ""; echo "";
echo "#############################################################"
echo "INSTALLING DEPENDENCIES ON ADMIN APP: $BASE_DIR/admin"
echo "#############################################################"
echo ""; echo "";
cd $BASE_DIR/admin
bower --allow-root install

#BUILD JAVA SERVER PROJECT
echo ""; echo "";
echo "#############################################################"
echo "BUILDING SERVER SIDE WITH GRADLE..."
echo "#############################################################"
echo ""; echo "";

cd $BASE_DIR
if [ "$TEST" = true ]
then
	sed -i 's/mapa\.war/mapa_test\.war/g' $BASE_DIR/build.gradle
	gradle war
	cp warFiles/mapa_test.war /var/lib/tomcat7/webapps/
else
	gradle war
	cp warFiles/mapa.war /var/lib/tomcat7/webapps/
fi

#UPDATE ADMIN WEB APP ON TOMCAPT
echo ""; echo "";
echo "#############################################################"
echo "UPDATING ADMIN WEB APP (rsync to Tomcat) ..."
echo "#############################################################"
echo ""; echo "";
if [ "$TEST" = true ]
then
	rsync -avr --delete $BASE_DIR/admin/ /var/lib/tomcat7/webapps/admin_test/
	curl --user utcwebadmin:jfhackisa912 http://155.210.14.31:8080/manager/text/reload?path=/admin_test
else
	rsync -avr --delete $BASE_DIR/admin/ /var/lib/tomcat7/webapps/admin/
	curl --user utcwebadmin:jfhackisa912 http://155.210.14.31:8080/manager/text/reload?path=/admin
fi

#CLEAN REPO
cd $BASE_DIR
git checkout .
git clean -fd
git reset --hard origin/$BRANCH
cd ..

#########################################################
# FINISH
########################################################

echo ""; echo "";
echo "#############################################################"
echo "SCRIPT FINISHED"
echo "#############################################################"
echo ""; echo "";

cd $ORIG_DIR;

#CHECK TOMCAT RELOAD LOG
tail -f /var/log/tomcat7/catalina.out

#RESTORE PHOTOS TO SERVER
#sleep 10s
#mv $HOME/photos_bck /var/lib/tomcat7/webapps/mapa/www/images/photos
#chown -R tomcat7:tomcat7 /var/lib/tomcat7/webapps/mapa/www/images/photos

