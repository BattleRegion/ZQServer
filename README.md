## ZQServer quick start
1. Clone this repo.
2. Install **MySQL server** & **Redis server**.
3. Install dependency:

	```
	cd ZQServer
	npm install
	```

4. Put your configuration files into *conf*:
	- conf/common.json
	
	```
	{
		"server_port":9999,
		"env":"local",
		"package_md5_key":"b9c72f4b3cd80b92558c788a8568ab6dec8f4bda414ebe99b3e582b17ff2a02ea0fea0a1d6d097e842d0f89b1e255ea556b1372d3279074dfc9cfeb5730391e8"
	}
	```
	
	- conf/mysql.json
	```
	{
	  "local": {
	    "connectionLimit"  : 10,
	    "host"             : "127.0.0.1",
	    "port"             : "3306",
	    "user"             : "",
	    "password"         : "",
	    "database"         : "zq"
	  }
	}
	```
	
	- conf/redis.json
	```
	{
		"local":{
			"host":"127.0.0.1",
			"port":6379
		}
	}
	```

5. Prepare some initial data in to database:

	```
	mysql -h 127.0.0.1 -u root -p zq < zq.sql
	```

6. Start server:

	```
	node app.js
	```