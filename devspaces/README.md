# Devspaces
This is the devspaces environment configuration to use for Remote Retro development. 

With Devspaces, you can setup your development environment
and start coding from scratch in minutes, you will have your project synced to and run on the cloud!

## Required AD group
To be able to use devspaces environment, you need to be a member of `jira-users` AD group. If you are not yet, please open a ticket to IT operations.

## Preparing your environment

### Installing devspaces

  Before starting development on devspaces, should first install the required libraries for devspaces. 
  
  Please follow detailed instructions to install and setup Devspaces 
  [here](http://devspaces-docs.ey.devfactory.com/installation/index.html).
  
### Importing devspaces configuration
  Here you will import the devspaces collection (into your personal devspaces), which contains a specialized set of containers ready to run Remote Retro development resources.
  - **dev** : Development container
  - **db** : PostgreSQL DB container
  
  Just run the command below
  ```sh
   cndevspaces import eee91e73-547f-42b3-8c0b-9ee25f8bce23 remopte-retro-v100
  ```
  Once the import completed, console replies with ```Import successfull, created with name remopte-retro-v100```
  
  Now your devspaces configuration is ready to use.
  
### Start syncing your source code with your Devspaces

  This is the final step in order to start actual development on your source code with Devspaces. 
  First you need to kickstart sync process between your local project directory and Devspaces environment on the cloud. So cd into your project root directory and run the command below
  ```sh
  cndevspaces bind -v --collection remopte-retro-v100 --config dev
  ```
  This command execution will take a while to complete, relative to your project size and current bandwidth. It will upload your local directory to your Devspaces environment config ```dev```, and ```-v``` arg actually prints *rsync* logs during processing.
  
  Once process completed, console replies with ```Bind successful```. Now your devspaces is ready for development.
  
### Development workflow with Devspaces
  **dev** and **db** container is started and running. 

  #### Application development

  ```sh
   cndevspaces exec --container dev
  ```
  initial connection will sync local project directory to `/app`/ directory on the server container. Once command executed successfully, you should be able to start development, your local changes will be synced to your ```dev``` container 

  All build commands being used locally are also available on remote container, such as `bin/install_erlang_and_elixir_with_dependencies` in `/app` folder for dependency installation, `mix compile`, `mix` to compile and run the application.

  __NOTE:__ update `dev.exs`: to be able to use `mix ecto.migrate`, RemoteRetro.Repo `hostname` variable should be updated to `dev` to match with the actual config name as the new host name in devspaces. Also end user facing url's should be updated to their actual IP and port information reflected in `cndevspaces info` command if you want to do manual testing via browser. i.e. http://localhost:5001 url being called should be modified to http://<ACTUAL_DEVSPACES_IP>:<ACTUAL_DEVSPACES_PORT_FOR_5001> in UI resources, since they should be available to end users (browser access).

  #### Remote IP and port information

  Actual IP for remote host and ports mapped to exposed ports from containers are available with command below

  ```sh
   cndevspaces info
  ```   
  and information returned will look like 
  ```sh
Using version: 0.2.19
Displaying info for: dev
Container    State      Reason
-----------  -------  --------
db           Ready
dev          Ready

Ip: 10.224.82.131
db containerPort    hostPort    protocol
------------------  ----------  ----------
5432                31183       TCP
dev containerPort    hostPort    protocol
----------------------  ----------  ----------
5432                    31183       TCP
5001                    31224       TCP
4000                    30340       TCP
db containerPort    hostPort    protocol
------------------  ----------  ----------
5432                    31183       TCP
5001                    31224       TCP
4000                    30340       TCP
```

i.e. in this case `4000` port is available at `30340` and IP is `10.224.82.131`, so if `mix` is running, application will be accessible through `http://10.224.82.131:30340` etc.
 

For further information please refer to official documentation for Devspaces at

http://devspaces-docs.ey.devfactory.com/

and to our Slack channel **#devspaces-support**.
