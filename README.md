# CMU-Maps-Data-Visualization

## Project Overview

A visualization tool for Carnegie Mellon University campus floorplans, featuring customizable room information and navigation graph. This repository powers the backend for [CMU Maps](https://github.com/scottylabs/cmumaps), providing accurate spatial data and pathfinding algorithms for seamless campus navigation.

For comprehensive usage instructions and features, refer to our [documentation](https://docs.google.com/document/d/1-cCIbMQp5eLcjvXO46XwQY86PnqABLn0Ts0VEIpT6AM/).

## Getting Started

### Prerequisites

- Git
- Node.js and npm

### Installation

1. Clone the repository
   1. Using GitHub Desktop: clone `cmumaps` from the GitHub by authenticating using your username. 
   2. Using CLI:
       1. In the folder on your computer that you want the cmumaps folder to be in, `git clone [git@github.com](mailto:git@github.com):ScottyLabs/cmumaps.git`
       2. To clone the `cmumaps-data` submodule: `cd` into the folder that the submodule is in (`cmumaps/apps/data`) 
       `git submodule update --init`
           1. Case 1: not logged into GitHub. If it asks for authentication, instead of using your GitHub password, when prompted for the password, input your PAT (personal access token). 
               1. Account Settings → Developer Settings → Generate a new Personal Access Token (with repo permissions)
           2. Case 2: logged into GitHub and still error. If there’s a “Failed to clone” error with “repository not found”, make sure you have access to the submodule. If you don’t, ask someone to give your account access to the submodule.

3. Set up environment variables

- Frontend: Use credentials from [ScottyLabs Vault (Frontend)](https://vault.scottylabs.org/#/vault?organizationId=3ef62a20-29b9-4a0f-a745-50a8e6dc13ea&collectionId=6e348651-87b5-4124-85cb-2f0e48617b72&itemId=f28ca35c-6f3e-4679-b0e6-2edac8664aa6)
- Backend: Use credentials from [ScottyLabs Vault (Backend)](https://vault.scottylabs.org/#/vault?organizationId=3ef62a20-29b9-4a0f-a745-50a8e6dc13ea&collectionId=6e348651-87b5-4124-85cb-2f0e48617b72&itemId=06bf9947-fb94-402a-9a96-97c5ba196226)

### Running the Application

You'll need to run both the frontend and backend servers in separate terminal windows.

#### Frontend

```zsh
cd app
npm install
npm run dev
```

### Backend

```zsh
cd server
npm install
npx prisma generate
node index.ts
```
