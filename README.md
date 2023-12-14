# Student Database System for ICP Canister Project

## Overview

This project is a decentralized student database system built using Azle/Typescript for the Internet Computer (ICP) Canister. It allows schools to decentralize their student records database, providing a more secure and transparent solution. This README provides instructions on how to clone the project to your local machine, navigate through the project directories, install dependencies, start the replica, and interact with the canister through the Candid UI.

## Prerequisites

Make sure you have the following installed on your machine:

- [Dfinity SDK (DFX)](https://sdk.dfinity.org/docs/download.html)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Cloning the Repository

1. Open a terminal on your local machine.

2. Clone the repository to your local machine using the following command:
    i-> (ssh)
      ```bash
       git clone git@github.com:Fadhil047/STUDENTS_MS.git
      ```

    ii->(https)
     ```bash
        https://github.com/Fadhil047/STUDENTS_MS.git
      ```
    iii->downloading the zip 
       STUDENTS_MS-30ba988ee51009af7eba96a09798634b92a0b8d0.zip

    iv->Codespaces 
       just click on the codespace and can acces the repo on the github without installing any files.
       For this tutorial we shall be using the local repo

## Navigating to Students_MS Directory

3. Change your working directory to the `STUDENTS_MS` directory using the `cd` command:
    check for the files that are on that directory and confirm whether the file is on the local repo. Once confimed proceed to the next level.
    ```bash
    ls
    ```

    ```bash
    cd STUDENTS_MS/
    ```

## Navigating to Students Directory

4. Navigate further into the `STUDENTS` directory:This is where the actual codebase is;

    ```bash
    cd STUDENTS/
    ```

## Installing Dependencies

5. Install project dependencies using npm:
   *NOTE: NEVER SKIP THIS PROCESS AS THE CODE WILL NOT COMPILE AND IT WILL NEED NPM DEPENDANCIES

    ```bash
    npm install
    ```
    Check out whether the packages have been installed 
      that is dfx.json packagelock.json and package.json 
    ```bash
    ls
    ```

## Starting the Replica (Clean)

6. Remove any existing replica and start a clean one using the following DFX command:

    ```bash
    dfx start --clean
    ```

This command will start the Internet Computer replica, ensuring a clean state.

## Accessing the Student Database System

Once the replica is started, you can access the student database system by opening a web browser and navigating to the provided URL (usually `http://localhost:8000`).

## Interacting with the Canister through Candid UI

7. Open the Candid UI to interact with the canister:
    
    if it does not have any errors it will compile slowly if its the first time and after success u will receive a URL (usually `http://127.0.0.1:4943/?canisterId=r7inp-6aaaa-aaaaa-aaabq-cai`)
    ```bash
    dfx deploy
    ```

This command installs the canister and opens the Candid UI. Follow the provided instructions in the UI to interact with the canister.

## Additional Configuration

Make sure to check the project's documentation for any additional configuration or setup instructions.

## Contributing

If you would like to contribute to the development of this project, just clone the project on your local repo and then submit a `PR`

## License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and distribute it as needed.

---

**Note:** Please check the navigations when trying to start the local replica as it will frustrate you by showing a response like  `Error: Cannot find dfx configuration file in the current working directory. Did you forget to create one?` so always confirm you;re `pwd` is `STUDENTS`