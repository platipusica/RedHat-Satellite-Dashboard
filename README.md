# RedHat Satellite Dashboard

Hello,

if anyone still using the Satellite 5.x from RedHat, this might be interesting Dashboard I've created with Jam.py framework (https://github.com/jam-py/jam-py). 

It is reveling a lot of things not instantly seen on the Satellite Overview Tab. For example, we see how dispersed the RAM allocation is on our VmWare infrastructure.

Also, not easy to spot how many running kernels are in production, etc. It is possible to query any information from the database tables within the application. For example, as seen below in the PDF, we have one workstation with 96 cores. But which one is it, the Manager would ask? Simple, open Satellite tab, Rhncpu table and see it there.


Please refeer to https://github.com/jam-py/jam-py/issues/53 for the actual files and how to's. 

Example Satellite 5.x Dashboard with shuffled  System Groups for data publishing:

https://docs.google.com/viewer?url=http://dbabicwa.github.io/RedHat-Satellite-Dashboard/docs/RHN_sc.pdf

Enjoy
