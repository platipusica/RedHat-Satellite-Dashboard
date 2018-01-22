# RedHat Satellite Dashboard

Hello,

if anyone still using the Satellite 5.x from RedHat, this might be interesting Dashboard I've created with Jam.py framework (https://github.com/jam-py/jam-py):

![Example jam.py Satellite Login details](https://user-images.githubusercontent.com/9026100/31700470-2f225d8a-b3fc-11e7-8085-285e51164a88.png  "Example jam.py Satellite Login details")

![rhn_black_raster-0](https://user-images.githubusercontent.com/9026100/35200887-76c7f3b2-ff50-11e7-8cd0-a536d1a971b7.png)
![rhn_black_raster-1](https://user-images.githubusercontent.com/9026100/35200888-7ae84ffa-ff50-11e7-9527-c1f1432954c2.png)

On above, the Jam.py shuffled the System Groups name for Internet publishing (ie. when we do not want to show everything).


It is reveling a lot of information not instantly seen on the Satellite 5.x Overview Tab. For example, we see how dispersed the RAM allocation is on our VmWare infrastructure.

Also, not easy to spot how many running kernels are in production, etc. It is also possible to query any information from the database tables within the application. For example, as seen below in the PDF, we have one workstation with 96 cores. But which one is it, the Manager would ask? Simple, open Satellite tab, Rhncpu table and see it there, or Search for any info.


Please refeer to https://github.com/jam-py/jam-py/issues/53 for the actual files and how to's. 

Example Satellite 5.x Dashboard with shuffled  System Groups for data publishing:

https://docs.google.com/viewer?url=http://dbabicwa.github.io/RedHat-Satellite-Dashboard/docs/RHN_sc.pdf

Enjoy
