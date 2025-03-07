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

   ```zsh
   git clone git@github.com:ScottyLabs/cmumaps.git
   ```

2. Set up environment variables

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
node index.ts
```
