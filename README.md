# RedHat Satellite Dashboard

Hello,

if anyone still using the Satellite 5.x from RedHat, this might be interesting Dashboard I've created with Jam.py 'magic' framework (https://github.com/jam-py/jam-py), in like one hour (and I'm not a developer).

How does it work?
=================

Please visit Heroku App:

https://redhatsatellite.herokuapp.com

To get you going with Jam.py 4.x, please visit https://goo.gl/j81uDW for short 13 slides presentation. Basically, only Satellite db login info, a bit of c/p and a few imported tables are needed for this app:

![Example jam.py Satellite Login details](https://user-images.githubusercontent.com/9026100/31700470-2f225d8a-b3fc-11e7-8085-285e51164a88.png  "Example jam.py Satellite Login details")

How was this Demo published on Heroku?
------------------------------------
The Satellite App you see on Heroku is just the Jam.py Project with two files added: requirements.txt and Procfile.

Then the Heroku account was open, jampy App created, Git repo linked and deployed. In 10 seconds it magically appeared as a live Web site. 

My second Jam.py App lives here: http://jampy-aliases.herokuapp.com

My third Jam.py App lives here: https://sambashares.herokuapp.com

The same principles apply.


What does a report look like?
=============================

Imagine hundreds or thousands of RHEL Servers connecting to Satellite. This Dash will show live data, and it is extensible to any graphs you can imagine in fastest time possible. **No need to learn SQL, bootstrap, Django or hibernate to name a few.**


![rhn_black_raster-0](https://user-images.githubusercontent.com/9026100/35200887-76c7f3b2-ff50-11e7-8cd0-a536d1a971b7.png)
![rhn_black_raster-1](https://user-images.githubusercontent.com/9026100/35200888-7ae84ffa-ff50-11e7-9527-c1f1432954c2.png)

On above, the Jam.py shuffled the System Groups name for Internet publishing (ie. when we do not want to show everything).


It is reveling a lot of information not instantly seen on the Satellite 5.x Overview Tab. For example, we see how dispersed the RAM allocation is on our VmWare infrastructure.

Also, not easy to spot how many running kernels are in production, etc. It is also possible to query any information from the database tables within the application. For example, there is one workstation with 96 cores! But which one is it, the Manager would ask? Simple, open Satellite tab, Rhncpu table and see it there, or Search for any info.

Supported software
==================

Red Hat Satellite 5.x, 6.x coming soon.

Installation
============

For this app, there is no need to install anything, providing there is a psycopg2 Python lib on your system. 
Just download the latest file, unpack and run from unzipped folder with:

python server.py

The App will run at http://localhost:8080

Open the App Builder, Set the connection details on Project/Database, and restart the app. If there are more Satellites in your Org, open Task/Server Module [F9], and uncomment from below:
```
### to connect to real Satellites #2, #3..., providing 1st Satellite is set on Project/Database
#import psycopg2 
```
Profit.


Requirements
============

http://jam-py.com/docs/intro/install/install_python.html

http://jam-py.com/docs/intro/install/package_installation.html

For Satellite with Oracle, the cx_Oracle Python library is needed. 

Enjoy!
