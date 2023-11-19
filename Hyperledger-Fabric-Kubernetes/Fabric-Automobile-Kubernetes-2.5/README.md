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

**Note : add the rule for TCP 2049 port or better thing to do is open all ports**

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

Github repo link with kubernetes files - https://github.com/Abhith-S/kubernetes/tree/main/Fabric-Automobile-Kubernetes-2.5

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

**Go to cli pod of peer0Manufacturer ie, cli-peer0-manufacturer**

Open shell

The scripts folder will be mounted from nfs server inside our pod , we use createAppChannel.sh to execute the command for channel creation.

Run the script : 

`./scripts/createAppChannel.sh`

`ls channel-artifacts/`

See if autochannel.block is present, if yes and no errors in the shell then successful.

---

### Joining Channel

To Join channel , Go to lensIDE

**Go to cli pod of peer0Manufacturer ie, cli-peer0-manufacturer**

Open shell

Run this command : 

`peer channel join -b ./channel-artifacts/autochannel.block`

Check if joined : 

`peer channel list`

---

**Go to cli pod of peer0Dealer ie, cli-peer0-dealer**

Open shell

Run this command : 

`peer channel join -b ./channel-artifacts/autochannel.block`

Check if joined : 

`peer channel list`

---

**Go to cli pod of peer0Mvd ie, cli-peer0-mvd**

Open shell

Run this command : 

`peer channel join -b ./channel-artifacts/autochannel.block`

Check if joined : 

`peer channel list`

***

## Anchor peer update
Go to lensIDE or use terminal

**Go to cli pod of peer0Manufacturer ie, cli-peer0-manufacturer**

Open shell

Run the script : 

`./scripts/updateAnchorPeer.sh ManufacturerMSP`

---

**Go to cli pod of peer0Dealer ie, cli-peer0-dealer**

Open shell

Run the script : 

`./scripts/updateAnchorPeer.sh DealerMSP`

---

**Go to cli pod of peer0Mvd ie, cli-peer0-mvd**

Open shell

Run the script : 

`./scripts/updateAnchorPeer.sh MvdMSP`

***

## Chaincode Operations 
### Packaging Chaincode
We have the chaincode already available in the peers as it's there in the nfs server.

For packaging chaincode we need 2 files , connection.json and metadata.json.

These 2 are available in chaincode/automobile/packaging/ folder.

**Go to the nfs_clientshare local folder from local terminal**

The files required for chaincode are inside it.

`cd nfs_clientshare/chaincode/automobile/packaging`

We are creating a tar file and bringing the connection.json file inside it 

`sudo tar cfz code.tar.gz connection.json`

Do ls to see code.tar.gz file created

We are packaging the code.tar.gz file with metadat.json and storing it in automobile-manufacturer.gz

`sudo tar cfz automobile-manufacturer.tgz code.tar.gz metadata.json`

**The above is for peer0 of manufacturer**

---

**Do same for dealer**

`sudo rm code.tar.gz`

Edit the connection.json file to change address to **automobile-dealer:7052** for dealer : 

`sudo vim connection.json`

Save it and run : 

`sudo tar cfz code.tar.gz connection.json`

`sudo tar cfz automobile-dealer.tgz code.tar.gz metadata.json`

---

**Do same for mvd**

`sudo rm code.tar.gz`

Edit the connection.json file to change address to automobile-mvd:7052 for mvd : 

`sudo vim connection.json`

Save it and run : 

`sudo tar cfz code.tar.gz connection.json`

`sudo tar cfz automobile-mvd.tgz code.tar.gz metadata.json`

***

### Install chaincode

Go to lensIDE

**Go to cli pod of peer0Manufacturer ie, cli-peer0-manufacturer**

Open shell

`cd /opt/gopath/src/github.com/chaincode/automobile/packaging`

`ls `

We can see chaincode there

Install chaincode : 

`peer lifecycle chaincode install automobile-manufacturer.tgz`

Copy the package identifier and store it in a file for later use

Example - automobile:9e81979c0074e9c20ff1c6bcf11cbc265702d8ed09695b95f594a451be635a10

---

**Go to cli pod of peer0dealer ie, cli-peer0-dealer**

Open shell

`cd /opt/gopath/src/github.com/chaincode/automobile/packaging`

Install chaincode : 

`peer lifecycle chaincode install automobile-dealer.tgz`

Copy the package identifier and store it in a file for later use

Example - automobile:13aff83f58ac33fdc61ee4ba6353f58292b5aa5985aebfbad4db350bf6b5225e

---

**Go to cli pod of peer0mvd ie, cli-peer0-mvd**

Open shell

`cd /opt/gopath/src/github.com/chaincode/automobile/packaging`

Install chaincode : 

`peer lifecycle chaincode install automobile-mvd.tgz`

Copy the package identifier and store it in a file for later use

Example - automobile:fe5644ec3a6aea74a1e56eb19f5a860be935b5aec93fb67872c9f38bf8348b4f

***

## Create Chaincode deployment and services

**We have to containerize our chaincode and push it to dockerhub to use it in our deployment files.**
**Also we pass the chaincode ID ie , package identifier we received from the previous packaging step in the deployment files**

Deploy files : 

`kubectl apply -f 9.cc-deploy/automobile/.`

***

### Approve Chaincode

Go to lensIDE

**Go to cli pod of peer0Manufacturer ie, cli-peer0-manufacturer**

Open shell

Run the approve command :

**Note : Substitute with your package id**

`peer lifecycle chaincode approveformyorg --channelID autochannel --name automobile --version 1.0 --package-id automobile:9e81979c0074e9c20ff1c6bcf11cbc265702d8ed09695b95f594a451be635a10 --sequence 1 -o orderer:7050 --tls --cafile $ORDERER_CA --collections-config /opt/gopath/src/github.com/chaincode/automobile/collections.json`

---

**Go to cli pod of peer0dealer ie, cli-peer0-dealer**

Open shell

Run the approve command : 

**Note : Substitute with your package id**

`peer lifecycle chaincode approveformyorg --channelID autochannel --name automobile --version 1.0 --package-id automobile:13aff83f58ac33fdc61ee4ba6353f58292b5aa5985aebfbad4db350bf6b5225e --sequence 1 -o orderer:7050 --tls --cafile $ORDERER_CA --collections-config /opt/gopath/src/github.com/chaincode/automobile/collections.json`

---

**Go to cli pod of peer0mvd ie, cli-peer0-mvd**

Open shell

Run the approve command : 

**Note : Substitute with your package id**

`peer lifecycle chaincode approveformyorg --channelID autochannel --name automobile --version 1.0 --package-id automobile:fe5644ec3a6aea74a1e56eb19f5a860be935b5aec93fb67872c9f38bf8348b4f --sequence 1 -o orderer:7050 --tls --cafile $ORDERER_CA --collections-config /opt/gopath/src/github.com/chaincode/automobile/collections.json`

***

### Check commit readiness
Check commit readiness from any of the cli pod terminal:

`peer lifecycle chaincode checkcommitreadiness --channelID autochannel --name automobile --version 1.0 --sequence 1 -o -orderer:7050 --tls --cafile $ORDERER_CA --collections-config /opt/gopath/src/github.com/chaincode/automobile/collections.json`

***

### Commit Chaincode
Commit from any of the cli pod terminal:

`peer lifecycle chaincode commit -o orderer:7050 --channelID autochannel --name automobile --version 1.0 --sequence 1 --tls true --cafile $ORDERER_CA --peerAddresses peer0-manufacturer:7051 --tlsRootCertFiles /organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/tls/ca.crt --peerAddresses peer0-dealer:7051 --tlsRootCertFiles /organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/tls/ca.crt --peerAddresses peer0-mvd:7051 --tlsRootCertFiles /organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/tls/ca.crt --collections-config /opt/gopath/src/github.com/chaincode/automobile/collections.json`

***

### Query commited chaincode
Query from any peer-cli pod terminal

`peer lifecycle chaincode querycommitted --channelID autochannel`

***

### Invoke & Query Chaincode
Do from any of the cli pod terminal:

**Invoke :**

`peer chaincode invoke -o orderer:7050 --tls true --cafile $ORDERER_CA -C autochannel -n automobile --peerAddresses peer0-manufacturer:7051 --tlsRootCertFiles /organizations/peerOrganizations/manufacturer.auto.com/peers/peer0.manufacturer.auto.com/tls/ca.crt --peerAddresses peer0-dealer:7051 --tlsRootCertFiles /organizations/peerOrganizations/dealer.auto.com/peers/peer0.dealer.auto.com/tls/ca.crt --peerAddresses peer0-mvd:7051 --tlsRootCertFiles /organizations/peerOrganizations/mvd.auto.com/peers/peer0.mvd.auto.com/tls/ca.crt -c '{"Args":["createCar","car1","Ford","Mustang","Black","12/12/2020","Ford"]}' --waitForEvent`

**Query :**

`peer chaincode query -C autochannel -n automobile -c '{"Args":["readCar","land1"]}'`

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

## Application

Create a docker file for the application. Containerize , push to docker hub and we use the image in a deployment file.

**Mention the image in 10.autoapp/auto.yaml file.**

Deploy files : 

`kubectl apply -f 10.autoapp/.`

---

### Running the application on local-system : 

`kubectl port-forward <application (autoapp) pod name> 4000:4000`

**Access application from http://localhost:4000**
