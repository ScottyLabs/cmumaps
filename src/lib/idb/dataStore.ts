import { Buildings, FloorPlanMap } from '@/types';

let db: IDBDatabase;

export function cachedFetch(
  floorPlanURL: string,
  buildingsURL: string,
  success: (floorPlans: FloorPlanMap, buildings: Buildings) => void,
  failure: (error: any) => void,
) {
  const DBOpenRequest = window.indexedDB.open('cmumaps', 1);

  // Initialize the database connection
  DBOpenRequest.onerror = function () {
    console.error('Error loading database. Subsequent queries will fail.');
  };
  DBOpenRequest.onsuccess = function () {
    db = DBOpenRequest.result;

    // Check if the database is empty
    const transaction = db.transaction(['dataStore'], 'readonly');
    const objectStore = transaction.objectStore('dataStore');
    const request = objectStore.getAll();
    request.onerror = function (event) {
      console.error(event, 'Attempting to fetch from network.');
      if (request.result === undefined) {
        networkFetch(
          floorPlanURL,
          buildingsURL,
          (floorPlans, buildings) => {
            const floorsTransfer = db
              .transaction('dataStore', 'readwrite')
              .objectStore('dataStore');
            floorsTransfer.add(floorPlans, 'floorPlans');
            const buildingsTransfer = db
              .transaction('buildings', 'readwrite')
              .objectStore('buildings');
            buildingsTransfer.add(buildings, 'buildings');
          },
          (error) => {
            failure(error);
          },
        );
      }
    };
    request.onsuccess = function () {
      if (request.result === undefined) {
        networkFetch(
          floorPlanURL,
          buildingsURL,
          (floorPlans, buildings) => {
            const floorsTransfer = db
              .transaction('dataStore', 'readwrite')
              .objectStore('dataStore');
            floorsTransfer.add(floorPlans, 'floorPlans');
            const buildingsTransfer = db
              .transaction('buildings', 'readwrite')
              .objectStore('buildings');
            buildingsTransfer.add(buildings, 'buildings');
          },
          (error) => {
            failure(error);
          },
        );
      } else {
        success(request.result[1], request.result[0]);
      }
    };
  };

  DBOpenRequest.onupgradeneeded = function (event: any) {
    db = event.target.result;
    if (db === null) {
      return;
    }

    if (!db.objectStoreNames.contains('dataStore')) {
      const dataStore = db.createObjectStore('dataStore');
      if (!db.objectStoreNames.contains('logStore')) {
        db.createObjectStore('logStore', { autoIncrement: true });
      }

      dataStore.transaction.onerror = (event: any) => {
        failure(event);
      };

      networkFetch(
        floorPlanURL,
        buildingsURL,
        (floorPlans, buildings) => {
          const floorsTransfer = db
            .transaction('dataStore', 'readwrite')
            .objectStore('dataStore');
          floorsTransfer.add(floorPlans, 'floorPlans');
          const buildingsTransfer = db
            .transaction('dataStore', 'readwrite')
            .objectStore('dataStore');
          buildingsTransfer.add(buildings, 'buildings');
          success(floorPlans, buildings);
        },
        (error) => {
          failure(error);
        },
      );
    }
  };
}

function networkFetch(floorPlanURL, buildingsURL, success, failure) {
  fetch(floorPlanURL)
    .then((response) => response.json())
    .then((data) => {
      const floorPlans = data;
      fetch(buildingsURL)
        .then((response) => response.json())
        .then((data) => {
          const buildings = data;
          success(floorPlans, buildings);
        })
        .catch(failure);
    })
    .catch(failure);
}
