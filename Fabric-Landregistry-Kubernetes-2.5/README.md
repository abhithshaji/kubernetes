# Steps to run the project on kubernetes #
## Cluster Setup ##
I am using Google cloud platform (GCP). Create a cluster with 4 nodes , 2 CPU and 8GB RAM with ubuntu OS.

Next step is to install Google Cloud SDK & Google Cloud CLI in local terminal :

Check docs- https://cloud.google.com/sdk/docs/install-sdk

Connect to cluster from local system

***

## NFS (Network File Sharing) Server Setup ##

I am using Google cloud platform (GCP).

Create a VM instance with 2cpu 4gb or 8gb memory.

Select ubuntu machine with 50GB storage and Allow HTTP traffic and HTTPS traffic

---

**Go to vm instance.**

In SSH -> view gcloud command -> copy command and paste in the local terminal.

Access to the VM is established from the local terminal or just click on ssh button to open cloud shell in browser.

`sudo su`

`cd /`

`sudo apt update`

`sudo apt install nfs-kernel-server`

`sudo mkdir -p /mnt/nfs_share`

`sudo chown -R nobody:nogroup /mnt/nfs_share/`

Check if ownership updated : 

`ls -la /mnt/nfs_share`

Give executable permission to the directory :

`sudo chmod 777 /mnt/nfs_share/`

Check the nfs server configuration file :

`cat /etc/exports`

Configure the NFS (Network File System) server by adding an entry for the nfs_share to the /etc/exports file. This will expose the folder and * means any ip can connect to this server folder or we can specify our custom IP there if you want.

`echo "/mnt/nfs_share *(rw,sync,no_subtree_check,insecure)" | sudo tee -a /etc/exports`

Check the nfs server configuration file , the new config will be added at end:

`cat /etc/exports`

Export the file : 

`sudo exportfs -a`

Restart the nfs server :

`sudo systemctl restart nfs-kernel-server`

Now nfs server is configured and up and running.

---

**Expose Port 2049**

Now as we created the nfs server in GCP we need to expose the nfs port 2049

Go to cloud console -> go to compute engine -> vm instances -> select nfs server vm -> press 3 dot at end -> view network details -> firewall -> create firewall rule -> add rule for TCP port 2049

Refer - https://www.youtube.com/watch?v=-RjDWwTZUnc

**Note : add the rule for TCP 2049 port or better open all ports**

---

**Now we have to create a nfs client on our local machine.**

The client will be connected to the server from the host machine and this enables us to perform file operations from our loacal machine which will be reflected in our nfs server.

**On local machine**

Open a terminal :

`sudo apt install nfs-common`

Create the client directory in the local machine.

`mkdir nfs_clientshare`
 
Mount the nfs client to server by **passing external IP address of your server** : 

`sudo mount -o nolock -t nfs 34.100.184.178:/mnt/nfs_share ./nfs_clientshare`

To Check if mount was successful : 

Go to server terminal -> cd into nfs_share -> check if any files present there

Now go to local terminal -> cd into nfs_clientshare -> create a sample file there

Check in server terminal if the file is also created in nfs_share folder

---

Github repo link with kubernetes files - https://github.com/Abhith-S/kubernetes/new/main/Fabric-Landregistry-Kubernetes-2.5

Clone the repo

Open in VScode

***

## Persistent Volume (PV) , PVC and Test Pod Setup 
In the nfs server we are setting up PV and creating a PVC and a pod to test out if the nfs server is working correctly with kubernetes objects.

**Note: in pv.yaml file replace IP with your own server IP**

Deploy files : 

`kubectl apply -f 1.nfs/.`

***

## Fabric CA Setup

We are moving the files in the prerequisite folder of hlf-kubernetes folder to nfs_clientshare to get it inside the nfs server.

**From local terminal**

`sudo cp -R prerequsite/* ../nfs_clientshare/`

**In server terminal :**

`sudo su`

`cd /mnt/nfs_share`

`chmod +x scripts/ -R`

`chmod 777 organizations/ -R`

Deploy ca files :

`kubectl apply -f 2.ca/.`

***

## Generating Certificates and Artifacts
### Generate Certificates for peers and orderers:

`kubectl apply -f 3.certificates/.`

**Wait for the job to be completed**

### Creating Genesis Block and Channel Transaction : 

`kubectl apply -f 4.artifacts/.`

**Wait for the job to be completed**

***

## Creating Orderers
Deploy files : 

`kubectl apply -f 5.orderer/.`

***

## Configmap for peer
Deploy files : 

`kubectl apply -f 6.configmap/.`

***

## Peer Deployment , service and cli files
Deploy files : 

`kubectl apply -f 7.peers/.`

Check if all the objects are up and running on lensIDE or from the terminal.

***
## Channel Operations

### Creating Application  Channel

Go to lensIDE or use terminal

**Go to cli pod of peer0Sro ie, cli-peer0-sro**

Open shell

The scripts folder will be mounted from nfs server inside our pod , we use createAppChannel.sh to execute the command for channel creation.

Run the script : 

`./scripts/createAppChannel.sh`

`ls channel-artifacts/`

See if landchannel.block is present, if yes and no errors in the shell then successful.

---

### Joining Channel

To Join channel , Go to lensIDE

**Go to cli pod of peer0Sro ie, cli-peer0-sro**

Open shell

Run this command : 

`peer channel join -b ./channel-artifacts/landchannel.block`

Check if joined : 

`peer channel list`

---

**Go to cli pod of peer0Bank ie, cli-peer0-bank**

Open shell

Run this command : 

`peer channel join -b ./channel-artifacts/landhannel.block`

Check if joined : 

`peer channel list`

---

**Go to cli pod of peer0Revenue ie, cli-peer0-revenue**

Open shell

Run this command : 

`peer channel join -b ./channel-artifacts/landchannel.block`

Check if joined : 

`peer channel list`

***

## Anchor peer update
Go to lensIDE or use terminal

**Go to cli pod of peer0Sro ie, cli-peer0-sro**

Open shell

Run the script : 

`./scripts/updateAnchorPeer.sh SroMSP`

---

**Go to cli pod of peer0Bank ie, cli-peer0-bank**

Open shell

Run the script : 

`./scripts/updateAnchorPeer.sh BankMSP`

---

**Go to cli pod of peer0Revenue ie, cli-peer0-revenue**

Open shell

Run the script : 

`./scripts/updateAnchorPeer.sh RevenueMSP`

***

## Chaincode Operations 
### Packaging Chaincode
We have the chaincode already available in the peers as it's there in the nfs server.

For packaging chaincode we need 2 files , connection.json and metadata.json.

These 2 are available in chaincode/fabland/packaging/ folder.

**Go to the nfs_clientshare local folder from local terminal**

The files required for chaincode are inside it.

`cd nfs_clientshare/chaincode/fabland/packaging`

We are creating a tar file and bringing the connection.json file inside it 

`sudo tar cfz code.tar.gz connection.json`

Do ls to see code.tar.gz file created

We are packaging the code.tar.gz file with metadat.json and storing it in automobile-manufacturer.gz

`sudo tar cfz fabland-sro.tgz code.tar.gz metadata.json`

**The above is for peer0 of sro**

---

**Do same for bank**

`sudo rm code.tar.gz`

Edit the connection.json file to change address to **automobile-bank:7052** for bank : 

`sudo vim connection.json`

Save it and run : 

`sudo tar cfz code.tar.gz connection.json`

`sudo tar cfz fabland-bank.tgz code.tar.gz metadata.json`

---

**Do same for revenue**

`sudo rm code.tar.gz`

Edit the connection.json file to change address to automobile-revenue:7052 for revenue : 

`sudo vim connection.json`

Save it and run : 

`sudo tar cfz code.tar.gz connection.json`

`sudo tar cfz fabland-revenue.tgz code.tar.gz metadata.json`

***

### Install chaincode

Go to lensIDE

**Go to cli pod of peer0Sro ie, cli-peer0-sro**

Open shell

`cd /opt/gopath/src/github.com/chaincode/fabland/packaging`

`ls `

We can see chaincode there

Install chaincode : 

`peer lifecycle chaincode install fabland-sro.tgz`

Copy the package identifier and store it in a file for later use

Example - fabland:8f3330e90a76faec707dcdddc598067b64121e3b2ab767242495e2183db9a92c

---

**Go to cli pod of peer0Bank ie, cli-peer0-bank**

Open shell

`cd /opt/gopath/src/github.com/chaincode/fabland/packaging`

Install chaincode : 

`peer lifecycle chaincode install fabland-bank.tgz`

Copy the package identifier and store it in a file for later use

Example - fabland:cd8a488154bbe7fb0c2f08f7a01db7ff433bda2d1caa00bb52a10828ba39ae92

---

**Go to cli pod of peer0Revenue ie, cli-peer0-revenue**

Open shell

`cd /opt/gopath/src/github.com/chaincode/fabland/packaging`

Install chaincode : 

`peer lifecycle chaincode install fabland-revenue.tgz`

Copy the package identifier and store it in a file for later use

Example - fabland:795425d30ddde9fce106626fdf96ca47a3e3b6c76ee5534cc556634c24d8f506

***

## Create Chaincode deployment and services

**We have to containerize our chaincode and push it to dockerhub to use it in our deployment files.**
**Also we pass the chaincode ID ie , package identifier we received from the previous packaging step in the deployment files**

Deploy files : 

`kubectl apply -f 9.cc-deploy/fabland/.`

***

### Approve Chaincode

Go to lensIDE

**Go to cli pod of peer0Sro ie, cli-peer0-sro**

Open shell

Run the approve command :

**Note : Substitute with your package id**

`peer lifecycle chaincode approveformyorg --channelID landchannel --name fabland --version 1.0 --package-id fabland:2cc3affe748a554ed496414d600e74f96fb1d00f25df7378b935e8c83ef48a36 --sequence 1 -o orderer:7050 --tls --cafile $ORDERER_CA`

---

**Go to cli pod of peer0Bank ie, cli-peer0-bank**

Open shell

Run the approve command : 

**Note : Substitute with your package id**

`peer lifecycle chaincode approveformyorg --channelID landchannel --name fabland --version 1.0 --package-id fabland:5135c39e5ccea99d71d968c7870adf1e700e36e88360f6e3f3bf2a77d053c969 --sequence 1 -o orderer:7050 --tls --cafile $ORDERER_CA`

---

**Go to cli pod of peer0Revenue ie, cli-peer0-revenue**

Open shell

Run the approve command : 

**Note : Substitute with your package id**

`peer lifecycle chaincode approveformyorg --channelID landchannel --name fabland --version 1.0 --package-id fabland:7d4c77810d67e7fae3241d9af189a10e13fb25294953c32de206e4e918fa2f9e --sequence 1 -o orderer:7050 --tls --cafile $ORDERER_CA`

***

### Check commit readiness
Check commit readiness from any of the cli pod terminal:

`peer lifecycle chaincode checkcommitreadiness --channelID landchannel --name fabland --version 1.0 --sequence 1 -o -orderer:7050 --tls --cafile $ORDERER_CA`

***

### Commit Chaincode
Commit from any of the cli pod terminal:

`peer lifecycle chaincode commit -o orderer:7050 --channelID landchannel --name fabland --version 1.0 --sequence 1 --tls true --cafile $ORDERER_CA --peerAddresses peer0-sro:7051 --tlsRootCertFiles /organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/tls/ca.crt --peerAddresses peer0-bank:7051 --tlsRootCertFiles /organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/tls/ca.crt --peerAddresses peer0-revenue:7051 --tlsRootCertFiles /organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/tls/ca.crt`

***

### Query commited chaincode
Query from any peer-cli pod terminal

`peer lifecycle chaincode querycommitted --channelID landchannel`

***

### Invoke & Query Chaincode
Do from any of the cli pod terminal:

**Invoke :**

`peer chaincode invoke -o orderer:7050 --tls true --cafile $ORDERER_CA -C landchannel -n fabland --peerAddresses peer0-sro:7051 --tlsRootCertFiles /organizations/peerOrganizations/sro.land.com/peers/peer0.sro.land.com/tls/ca.crt --peerAddresses peer0-bank:7051 --tlsRootCertFiles /organizations/peerOrganizations/bank.land.com/peers/peer0.bank.land.com/tls/ca.crt --peerAddresses peer0-revenue:7051 --tlsRootCertFiles /organizations/peerOrganizations/revenue.land.com/peers/peer0.revenue.land.com/tls/ca.crt -c '{"Args":["createLand","land1","Kozhikode","Koduvalli","Koduvalli","Koodaranhi","1","1","2","10","John","sea","jack","wall","no remarks","Abhith","2","1"]}' --waitForEvent`

**Query :**

`peer chaincode query -C landchannel -n fabland -c '{"Args":["readLand","land1"]}'`

***

## Accessing CouchDB

We need to do port forwarding to access the couchDb i.e., expose the port  of couchDB service.

The couchDB container is running inside the pods  for peer containers. From the service file for the peer pod in lensIDE we can see the couchDB is running on port 5984.

**In local terminal :**

`kubectl port-forward services/peer0-sro 5984:5984`

In the above command the first 5984 is the port on the container and next one is the port we expose on the local machine.

**Do not close the running terminal**

**Go to on browser - http://127.0.0.1:5984/_utils**

This will open up couchDB in the browser. Similarly can be done for other peers' couchdbs if needed.

***

## Backend

Create a docker file for the backend (api) . Containerize , push to docker hub and we use the image in a deployment file.

**Mention the image in 10.api/api.yaml file.**

Deploy files : 

`kubectl apply -f 10.api/.`

---

### Running the application on local-system : 

`kubectl port-forward <backend (api) pod name> 4000:4000`

**Access backend from http://localhost:4000**

## Frontend

Create a docker file for the frontend. Containerize , push to docker hub and we use the image in a deployment file.

**Mention the image in 11.frontend/frontend.yaml file.**

Deploy files : 

`kubectl apply -f 11.frontend/.`

---

### Running the frontend on local-system : 

Since its a react application by default runs on port 3000

`kubectl port-forward <frontend pod name> 3000:3000`

**Access backend from http://localhost:3000**

