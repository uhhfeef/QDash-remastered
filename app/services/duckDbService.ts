import { initDuckDB } from './[old]duckDbConfig.js';
import * as XLSX from 'xlsx';
import { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm';
import { generateTools } from './tools';
import { storeChatTools } from '~/utils/db.server';

// let db: AsyncDuckDB | null = null;
// let conn= null;
let isLoaded = false;
let currentTableName: null = null;
let loadedTables = new Set();
let tools = [];

// export async function initialize(connection) {
//     if (!connection) {
//         const instance = await initDuckDB();
//         db = instance.db;
//         conn = instance.conn;
//     } else {
//         db = connection.db;
//         conn = connection.conn;
//     }
// }

export function isDataLoaded() {
    return isLoaded;
}

export function getCurrentTableName() {
    return currentTableName;
}

export function getLoadedTables() {
    return Array.from(loadedTables); 
}

// Convert Excel file to CSV data
async function excelToCSV(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
            try {
                if (!e.target?.result || !(e.target.result instanceof ArrayBuffer)) {
                    throw new Error('Failed to read file');
                }
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Get the first worksheet
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                
                // Convert to CSV
                const csvContent = XLSX.utils.sheet_to_csv(firstSheet);
                
                // Create a new File object with CSV content
                const csvFile = new File(
                    [csvContent],
                    file.name.replace(/\.[^/.]+$/, '.csv'),
                    { type: 'text/csv' }
                );
                
                resolve(csvFile);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// This function handles both CSV and Excel file uploads
export async function handleFileUpload(file: File, db: AsyncDuckDB | null, conn: AsyncDuckDBConnection | null, chatId: string): Promise<any> {
    try {
        // if (!conn) {
        //     throw new Error("Database connection not initialized");
        // }
        if (!file) {
            throw new Error("No file selected");
        }
        const fileExtension = file.name?.split('.')?.pop()?.toLowerCase();
        
        // Convert Excel to CSV if needed
        const processFile = ['xlsx', 'xls'].includes(fileExtension ?? '') 
            ? await excelToCSV(file)
            : file;

        const tableName = processFile.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
        console.log(`Processing table: ${tableName}`);

        // Register the file content with DuckDB
        await db?.registerFileBuffer(processFile.name, new Uint8Array(await processFile.arrayBuffer()));
        
        // Check if the file has headers
        const hasHeaders = await checkCsvHeaders(processFile.name, db, conn);
        if (hasHeaders === false) {
            alert('1 or more headers are not present in file: ' + file.name);
            return false;
        }
        
        // Create table from file
        await conn?.query(`
            CREATE TABLE IF NOT EXISTS ${tableName} AS 
            SELECT * 
            FROM read_csv_auto('${processFile.name}', header=${hasHeaders}, AUTO_DETECT=true)
        `);
        
        // Add table to our tracked tables
        loadedTables.add(tableName);
        
        // Set current table name only if it's not already set
        // if (!currentTableName) {
        //     currentTableName = tableName;
        // }
        
        console.log('Current loaded tables:', Array.from(loadedTables));
        
        // Get schema information
        const schemaInfo = await getSchema(db, conn);
        isLoaded = true;

        // tools =  generateTools(schemaInfo);
        // console.log('Tools updated with new schema:', tools);

        // // store tools in db
        // await storeChatTools(tools, chatId);

        return schemaInfo;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

export async function getSchema(db: AsyncDuckDB | null, conn: AsyncDuckDBConnection | null) {
    try {
        if (!conn) {
            throw new Error("Database not initialized");
        }

        // Get list of loaded table names
        const tableNames = Array.from(loadedTables);
        console.log('Table names:', tableNames);
        
        // Build a query to get schema for all loaded tables
        const result = await conn.query(`
            SELECT name, sql 
            FROM sqlite_master 
            WHERE type='table' 
            AND name IN (${tableNames.map(name => `'${name}'`).join(',')})
            ORDER BY name
        `);
        console.log('Schema:', result);

        return result;
    } catch (error) {
        console.error("Error getting schema:", error);
        throw error;
    }
}

export async function executeDuckDbQuery(query: any) {
    try {
        if (!conn) {
            throw new Error("Database connection not initialized");
        }

        const result = await conn.query(query, { returnResultType: "arrow" });
        return convertArrowToRows(result);
    } catch (error) {
        // console.error("Error executing DuckDB query:", error);
        throw error;
    }
}

export async function checkCsvHeaders(fileName: string, db: AsyncDuckDB | null, conn: AsyncDuckDBConnection | null) {
    try {
        console.log('Checking CSV headers...');
        // Read first row as raw text to preserve commas
        const rawResult = await conn?.query(`
            SELECT *
            FROM read_csv_auto('${fileName}', header=false, AUTO_DETECT=true)
            LIMIT 2
        `);

        const rows = await rawResult?.toArray();
        if (!rows || rows?.length < 2) {
            return false; // Not enough rows to determine headers
        }

        // Get the first two rows
        const firstRow = Object.values(rows[0])?.join(',');  // Convert to CSV string
        const secondRow = Object.values(rows[1])?.join(','); // Convert to CSV string

        // Split by comma and filter out empty values
        const potentialHeaders = firstRow.split(',').filter(val => val.trim() !== '');
        const dataColumns = secondRow.split(',').filter(val => val.trim() !== '');

        // console.log('Potential headers:', potentialHeaders);
        // console.log('Data columns:', dataColumns);
        // console.log('Header count:', potentialHeaders.length);
        // console.log('Data column count:', dataColumns.length);

        // Return true if both rows have the same number of columns (indicating headers)
        const hasHeaders = potentialHeaders.length === dataColumns.length || potentialHeaders.length > dataColumns.length;
        // console.log('Has headers:', hasHeaders);
        return hasHeaders;
    } catch (error) {
        console.error('Error checking CSV headers:', error);
        return false; // Default to assuming no headers in case of error
    }
}

// converts arrows result from the executeDuckDbQuery function to rows
function convertArrowToRows(arrowResult: { schema: { fields: any[]; }; batches: any; }) {
    const columns = arrowResult.schema.fields.map((field: { name: any; }) => field.name);
    const rows = [];
    
    for (const batch of arrowResult.batches) {
        const numRows = batch.numRows;
        const columnData = {};
        
        columns.forEach((col: string | number, i: any) => {
            columnData[col] = batch.getChildAt(i).toArray();
        });
        
        for (let i = 0; i < numRows; i++) {
            const row = {};
            columns.forEach((col: string | number) => {
                let value = columnData[col][i];
                if (typeof value === 'bigint') {
                    value = Number(value);
                }
                row[col] = value;
            });
            rows.push(row);
        }
    }
    
    return rows;
}