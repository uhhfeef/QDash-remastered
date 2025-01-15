import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';
import { useEffect, useRef, useState } from 'react';

// // Select a bundle based on browser checks
// const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
// // Instantiate the asynchronus version of DuckDB-wasm
// const worker = new Worker(bundle.mainWorker!);
// const logger = new duckdb.ConsoleLogger();
// const db = new duckdb.AsyncDuckDB(logger, worker);
// await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
      mainModule: duckdb_wasm,
      mainWorker: mvp_worker,
  },
  eh: {
      mainModule: duckdb_wasm_eh,
      mainWorker: eh_worker,
  },
};


function useDuckDB() {
  // state to manage db state + ref for init since ref doesnt re render 
  // useeffect for csr + 1 time init
  // state for db
  // // bundle checks and init
  const [db, setDb] = useState<duckdb.AsyncDuckDB | null>(null);
  const init = useRef(false);

  
  useEffect(() => {
    // react re renders twice in dev mode, not in prod
    // console.log('useEffect running, init.current:', init.current, 'db:', !!db);

    if (init.current || db) {
      console.log('DuckDB already initialized.');
      return;
    }
    const initDuckDB = async () => {
      console.log('=== INITIALIZING DUCKDB ===');
    
        // Select a bundle based on browser checks
        const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
        // Instantiate the asynchronus version of DuckDB-wasm
        const worker = new Worker(bundle.mainWorker!);
        const logger = new duckdb.ConsoleLogger();
        const db = new duckdb.AsyncDuckDB(logger, worker);
        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
        setDb(db);
        init.current = true;
        const conn = await db.connect();
        URL.revokeObjectURL(bundle.mainWorker!);
        console.log("DuckDB-Wasm initialized successfully.");
    };
    initDuckDB();
  }, []);
    return db;
}

export default useDuckDB;