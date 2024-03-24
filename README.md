# Flo

## Installation and Running
1. Update `src/postgres/db` to point to the PostgresSQL database. 
2. Run `npm i` then `node src/index.js`, it will start a node server.
3. On postman create a POST request to `http://localhost:3000/upload-and-insert`.
4. For the body, use `form-data`. Add a new key `fisier` with `File` type. Put in a csv for the value (there are a couple of csv under `tests/fixtures` that can be used).
5. Send the request. If successful it will print a message "done".
6. Check table for whether data was inserted if successful or ignored if failed. 

## To Run Test
1. Run `npm test`.

## To Run Test Coverage
1. Run `npm run test:coverage`.

## Approach
- Planned out what I needed first. Service for parsing the csv, model for the insertion and controller to handle the request. 
- Worked on TDD to get service working as intended before moving to the model then controller as the service and model are independent. 
- Mocked services and model on the controller as the point of interest are whether the service and model are called. Do not necessarily test the return values of the service and model as there are test in place for that already.
- Test against an actual database in order to see if it works. If the approach did not work as intended, refine the components, run and resolve tests if required. Cycling like so in order to get the end result. 

## Assumptions
- It will only parse the first file if multiple files are being uploaded to the endpoint.
- Duplicated nmi and timestamp records are updated with the later records.
- Do not include the NMI suffix when saving to the database.
- Timestamp of the very first interval is intervalLength after midnight of that day.
- There are no records inserted if there are any errors. 
- Error messages are purposefully ambiguous to not provide more details for the user. It can be expanded upon if it used for internal staff only. 
- Using PostgreSQL as the database of choice rather than MySQL as the insert statement in the document uses `gen_random_uuid` which is available on PostgreSQL.
- A PostgresSQL database already exists (requires configuration inside `src/postgres/db`)
- Using fs.createReadStream allows chunks of information to be read which is suitable in situation where the file is large. 
- No front end as the requirement only required an endpoint to achieve the intended result. 

## Improvements
- Validating the the csv before it parse can help avoid issues during parsing or insertion eg all consumptions are positive numbers, sequential 300 records are later dates etc.
- Additional validation on nmi number and date. 
- Ensure that the time being inserted in do not conform to local time zones or convert it all to AEST for consistency.
- Chunking of the file during parsing to avoid loading the file into memory at once, currently it will read the whole file.
- Add more test fixtures from the aemo documentation for testing purposes.
- csvService could be broken down for better readability within the `on('data')` handler.