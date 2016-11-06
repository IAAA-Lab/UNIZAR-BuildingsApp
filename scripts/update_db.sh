#!/bin/bash

#====================================================
# This script updates the 'uzapp' database with the data from
# the 'sigeuz' database.
#
# Before the update is made, the script makes backups of both databases.
#
# How the script must be run:
#	Script usage: ./update_db.sh ohost odb ouser opwd dhost ddb duser dpwd tables
#        
#	Where arguments are:
#         	origin database host
#         	odb: origin database
#         	ouser: origin database user to connect
#         	opwd: origin database password to connect
#         	dhost: destiny database host
#         	ddb: destiny database
#         	duser: destiny database user to connect
#         	dpwd: destiny database password to connect
#         	tables: tables to update ("all" for update all the tables)
#
#
# In order to allow the script to be executed from the web administrator page, it must be
# located in the following path: '/tmp/scripts/database/' with user and group 'tomcat7:tomcat7'
#
#====================================================


# FUNCTION TO SHOW HELP ABOUT HOW TU USE SCRIPT
function show_help {
         echo "";echo "";
         echo "Script usage: ./update_db.sh ohost odb ouser opwd dhost ddb duser dpwd tables"
         echo "";
         echo "Where options are:"
         echo "    ohost: origin database host"
         echo "    odb: origin database"
         echo "    ouser: origin database user to connect"
         echo "    opwd: origin database password to connect"
         echo "    dhost: destiny database host"
         echo "    ddb: destiny database"
         echo "    duser: destiny database user to connect"
         echo "    dpwd: destiny database password to connect"
         echo "    tables: tables to update (\"all\" for update all the tables)"
         echo ""; echo "";
         exit 0;
}

BASE_DIR="/tmp/scripts/database/"

#REDIRECT OUTPUT TO LOGFILE
DATE=$(date +"%d%b%Y_%H%M%S")
LOGFILE=$BASE_DIR"logs/log_"$DATE".txt"
exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>>$LOGFILE 2>&1


#INITIAL LOG
echo "";echo "";
echo "============================================"
echo "UPDATE DATABASE: $(date)"
echo "============================================"


#CHECK SCRIPT ARGUMENTS
if [ $# -lt 9 ]
then
        echo "";echo "";
        echo "ERROR: All origin and destiny database connection arguments must be passed to the script!!!"
        show_help
fi

#VARS DEFINITION
FILE_OUTPUT=$BASEDIR"output.sql"

host_orig=$1;
db_orig=$2;
user_orig=$3;
password_orig=$4;
sql_backup_orig=$BASE_DIR$db_orig"_backup.sql"
dump_backup_orig=$BASE_DIR$db_orig"_backup.dump"
new_user="prueba";
dbname_orig="postgresql://$user_orig:$password_orig@$host_orig/$db_orig";

host_dest=$5;
db_dest=$6;
user_dest=$7;
password_dest=$8;
sql_backup_dest=$BASE_DIR$db_dest"_backup.sql"
dump_backup_dest=$BASE_DIR$db_dest"_backup.dump"
dbname_dest="postgresql://$user_dest:$password_dest@$host_dest/$db_dest";

#CHECK WHICH TABLES MUST BE UPDATED
tables=$9;
tables_parameter="";
OLD_IFS=$IFS;

if [ "$tables" == "all" ]
then
	tables_parameter="";
else
	export IFS=","
	for t in $tables; do
		tables_parameter="$tables_parameter -t \"$t\"";
	done
fi
export IFS=$OLD_IFS;

echo "";echo"";
echo "ORIGIN: "$dbname_orig;
echo "";
echo "DESTINY: "$dbname_dest;

#DESTINY DATABASE BACKUPS
echo "";echo "";
echo "================================================================";
echo "BACKUP OF $db_dest DATABASE (plain text format): $sql_backup_dest";
echo "================================================================";
echo "pg_dump --dbname=$dbname_dest -v -c --if-exists --inserts --column-inserts --attribute-inserts -n public -F p -f $sql_backup_dest"; echo "";
pg_dump --dbname=$dbname_dest -v -c --if-exists --inserts --column-inserts --attribute-inserts -n public -F p -f $sql_backup_dest

echo "";echo "";
echo "================================================================";
echo "BACKUP OF $db_dest DATABASE (custom format for pg_restore): $dump_backup_dest";
echo "================================================================";
echo "pg_dump --dbname=$dbname_dest -v -c --if-exists --inserts --column-inserts --attribute-inserts -n public -F c -f $dump_backup_dest"; echo "";
pg_dump --dbname=$dbname_dest -v -c --if-exists --inserts --column-inserts --attribute-inserts -n public -F c -f $dump_backup_dest

#ORIGIN DATABASE DUMPS
echo ""; echo "";
echo "================================================================";
echo "DUMP $db_orig DATABASE (plain text format): $sql_backup_orig";
echo "================================================================";
echo "pg_dump --dbname=$dbname_orig -v -c --if-exists --inserts --column-inserts --attribute-inserts -n public -F p -f $sql_backup_orig"; echo "";
pg_dump --dbname=$dbname_orig -v -c --if-exists --inserts --column-inserts --attribute-inserts -n public -F p -f $sql_backup_orig

echo "";echo "";
echo "================================================================";
echo "DUMP $db_orig DATABASE (custom format for pg_restore): $dump_backup_orig";
echo "================================================================";
echo "pg_dump --dbname=$dbname_orig -v -c --if-exists --inserts --column-inserts --attribute-inserts -n public -F c -f $dump_backup_orig"; echo "";
pg_dump --dbname=$dbname_orig -v -c --if-exists --inserts --column-inserts --attribute-inserts -n public -F c -f $dump_backup_orig


#UPDATE DESTINY DATABASE WHIT ORIGIN DATABASE DATA
echo ""; echo "";
echo "================================================================";
echo "UPDATE $db_dest DATABASE DATA WITH $db_orig DATABASE DATA";echo "";
echo "================================================================";
echo "pg_dump --dbname=$dbname_orig -v -c --if-exists --inserts --column-inserts --attribute-inserts -n public $tables_parameter -F p -f $FILE_OUTPUT"; echo "";
echo "psql --dbname=$dbname_dest -f $FILE_OUTPUT"; echo "";
pg_dump --dbname=$dbname_orig -v -c --if-exists --inserts --column-inserts --attribute-inserts -n public $tables_parameter -F p -f $FILE_OUTPUT
psql --dbname=$dbname_dest -f $FILE_OUTPUT


#UPDATE tables OWNER to NEW_USER
echo ""; echo "";
echo "================================================================";
echo "UPDATE $db_dest TABLES OWNER TO $new_user"
echo "================================================================";

for tbl in `psql -qAt --dbname=$dbname_dest -c "select tablename from pg_tables where schemaname = 'public';"`; 
do
	psql --dbname=$dbname_dest -c "alter table \"$tbl\" owner to \"$new_user\"";
	echo "ALTER TABLE $tbl OWNER TO $new_user";
done

#UPDATE sequences OWNER to NEW_USER
for tbl in `psql -qAt --dbname=$dbname_dest -c "select sequence_name from information_schema.sequences where sequence_schema = 'public';"`;
do
        psql --dbname=$dbname_dest -c "alter table \"$tbl\" owner to \"$new_user\"";
	echo "ALTER TABLE $tbl OWNER TO $new_user";
done

#UPDATE views OWNER to NEW_USER
for tbl in `psql -qAt --dbname=$dbname_dest -c "select table_name from information_schema.views where table_schema = 'public';"`;
do
	if [ "$tbl" == "geography_columns" ] || [ "$tbl" == "geometry_columns" ] || [ "$tbl" == "raster_columns" ] || [ "$tbl" == "raster_overviews" ]
	then
	        psql --dbname=$dbname_dest -c "alter table \"$tbl\" owner to postgres";
		echo "ALTER TABLE $tbl OWNER TO $user";
	else
	        psql --dbname=$dbname_dest -c "alter table \"$tbl\" owner to \"$new_user\"";
		echo "ALTER TABLE $tbl OWNER TO $new_user";
	fi	
done

echo "";echo "";
echo "================================================================";
echo "FINISH UPDATE";
echo "================================================================";
echo "";
echo "WARNING: if something has failed updating the $dbname_dest database and you want to restore the previous data, please execute the following command";
echo "psql -qAt --dbname=$dbname_dest -f $sql_backup_dest";
echo "";echo "";

#CLEAN LOG FILE
sed -i '/INSERT 0 1/d' $LOGFILE
