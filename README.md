# fun_with_mongoDB

A repo for projects that I've built using the MongoDB sample database

My goal is to practice basic CRUD functions, utilize an MVC approach, and experiment with MongoDB queries and aggregation pipelines.

Feel free to download and play with the code, but please note that this repo does not include an .env file with the database URI. You'll need your own MongoDB setup and a copy of their sample data to make this work.

## NYC Eats

A simple website where users can search for NYC restaurants by cuisine type and borough.

---

# Notes for M001: MongoDB Basics

## Basic Terms

**NoSQL**: a generic term that refers to any database that doesn't use the approach of storing information in related tables of data

MongoDB is a NoSQL document database.

(The term **database** implies that documents are stored in a structured way; it's only that the structuring method is different.)

**Document**: a way to organize and store data as a set of field-value pairs (or property-value).

**Field**: a unique identifier for a datapoint

**Value**: data related to a given identifier

```
{
  field: value,
  field: value,
  "name": "Nicole",
  "age": 42,
}
```

Documents are stored in **collections**.

**Collection**: an organized store of documents, usually with common fields between documents (although the documents in a collection may not be related to one another, their structure is usually similar)

There can be many collections per database and many documents per collection.

**MQL**: MongoDB Query Language (or, how the queries are written)

**$** is a character that gets used a lot.

- Precedes MQL (Mongo Query Language) operators
- Precedes Aggregation pipeline stages
- Allows access to field values

#### Atlas

A cloud database service built on MongoDB

**Clusters**: groups of servers that store data

**Replica set**: connected MongoDB instances that store the same data. A cluster is automatically configured as a replica set.

**Instance**: a single machine, either local or in the cloud, running a certain software

**Atlas** manages cluster creation and deployment for you.

The free tier level (which is what I'm at) grants access to a 3-server replica set with 512 MB of storage.

#### URI string

`mongodb+srv://user:pw@sandbox.cviyqea.mongodb.net/sample_airbnb`

**URI** - uniform resource indentifier
**srv** - the type of connection string format (this one establishes a secure connection)
**@sandbox.cviyqea.mongodb.net** - the path to the cluster
**/sample_airbnb** - the name of the database (can string other options with the query string format, `?option=value&otherOption=etc`)

## Representation of Documents in Memory

When viewing or updating documents in the shell, you are working with JSON (JavaScript Standard Object Notation)

**JSON** rules:

- Object starts and ends with curly braces.
- Keys and values are surrounded by quotation marks.
- A key is separated from its value by a colon.
- Key-value pairs are comma separated.

**JSON** is user-friendly, readable and familiar. However, it is text-based, which means that it parses slowly, is not very space-efficient, and only supports a limited number of data types.

MongoDB documents are stored in memory (internally and over the network) in the **BSON** (Binary JSON) format. It is intended to bridge the gap between binary representation and JSON format. It encodes type and length information, and is optimized for speed, space and flexibility. It supports additional data types (notably dates, but also different number formats).

|      | Encoding     | Data Support                                                                 | Readability       |
| ---- | ------------ | ---------------------------------------------------------------------------- | ----------------- |
| JSON | UTF-8 String | String, Boolean, Number, Array                                               | Human and Machine |
| BSON | Binary       | String, Boolean, Number (Integer, Long, Float, ...), Array, Date, Raw Binary | Machine Only      |

## Importing and Exporting Data

You have the option to export data as JSON or BSON. BSON is the better choice if you're making a copy or transferring the data to another machine, as it's lighter and faster. JSON is the better choice if you (the human) want to actually read the data.

Obviously the import command you choose depends on what sort of file type you have to import.

### Importing/Exporting as JSON

#### Export

**mongoexport**:

```
mongoexport --uri="mongodb+srv://user:pwd@cluster.mongodb.net/database" --collection=collectionName --out.nameToGiveTheNewFile.json
```

#### Import

**mongoimport**:
Can import a JSON file or another supported file type.

```
mongoimport --uri="mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies" --drop sales.json
```

### Import/Exporting as BSON

#### Export

**mongodump**:

```
mongodump --uri "mongodb+srv://user:pwd@cluster.mongodb.net/databaseName"
```

#### Import

**mongorestore**:

```
mongorestore --uri "mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies"  --drop dump
```

### Exploring Data

**Namespace**: concatenation of the database name and the collection name (e.g., sample_analytics.accounts)

From the Atlas website interface, finding information and making queries is set up in a really straightforward fashion.

You can also connect via the terminal.

```
mongosh "mongodb+srv://user:pwd@cluster.mongodb.net/database"
```

#### Commands

- **show dbs**: lists the databases stored on the cluster
- **use <dbNAME>**: switches to the named database
- **show collections**: when used from within a database, lists the collections

From within the database:

```
db.<collectionName>.find(<query>)
```

- **it**: allows you to _iterate_ through the **cursor**

The **cursor** is a pointer to the result set of a query. A **pointer** more generally is the direct address of the memory location.

### Query Operations

- **.countDocuments()** returns the number of documents that match the query

```
db.<collectionName>.countDocuments(<query>)
```

-**.pretty()** formats the documents into something more readable (by default, they are listed in _block_ format) (Note that .pretty() seems to be on by default when using mongosh)

## Inserting New Documents

You can do this using the Data Explorer section of the Atlas GUI.

You can also insert documents via the Mongo Shell. (I have decided to go with Mongo Compass as my interface, because everything else that I've tried sucks balls.)

The basic commands are:

```
db.<collection>.insertOne({...})
db.<collection>.insertMany([{...},{...}, {...}])
```

Note that `insertOne()` takes an object and `insertMany` takes an array of objects.

### ObjectId

Whenever you insert a new document, MongoDB automatically generates an ObjectId value: **"\_id"** Every document in the collection has a unique **\_id** value. In all other respects, the documents can be otherwise identical or completely different.

There is no requirement that the value of **\_id** be of the ObjectId type; it is only the default type. If you have a set of unique ids in mind, those can be specified in the "\_id" field instead. The id will only be generated if the field is not included in the inserted document.

### Inserting Multiple Documents

The default behaviour for document insertion is to insert them in the order in which they are listed in the array. If the operation fails at some point (for instance, because one entry is invalid), it will stop at the point of failure and subsequent documents will not be entered.

We can circumvent this by adding `{"ordered": false}` as an option to the `.insertMany()` call:

```
db.<collection>.insertMany([{...},{...}, {...}], {"ordered": false})
```

This will allow MongoDB to reorder the documents to increase performance. In practical terms, this means that the valid documents will be inserted and _then_ the failures will throw their errors.

Note that it is very easy to create a new collection. So easy, in fact, that if you try to insert a document into a collection that doesn't exist (say, because you made a typo while writing the name), MongoDB will helpfully create a new collection for you.

The same thing is true of databases; `use 22hfadf` will create a database with that name. (However, unless you immediately insert a document, this new database will not show up in the list of databases.)

## Updating Documents

Again, you can do this quite easily via the Atlas interface.

From the shell, we would use the commands

**updateOne()** and **updateMany()**

If there are multiple documents that match the search parameters, **updateOne()** will update the first document returned by the query. **updateMany()** will update all matching documents.

In either case, the function takes two arguments: the query and the update.

```
db.<collection>.updateMany({"queryKey": "queryValue"}, {operator: {"targetKey": targetValue}})
db.zips.updateMany({"city": "HUDSON"}, {"$inc": {"pop": 10}})
```

### Update Operators

**$set** - sets the value of the specified field to equal the given value
**$unset** - sets the value of a specified field to _null_
**$inc** - increments the value of the specified field by a given amount (see above; obviously this only works with numbers)

You can update multiple fields at one time using these operators:

```
{"$inc": {"pop": 10, "<field 2>": <increment value>, ...} }
{"$set": {"pop": 15352, "<field 2>": <increment value>, ...} }
{"$unset": {"pop": ""})
```

**$push** - adds an element to an array field

```
{$push: {<field1>: <value1>, ...}}
// and for nested arrays...
{$push: {"scores": {"type": "extra credit", "score": 100}}}
```

Use dot notation in order to target embedded documents.
For instance...

```
{_id: 1,
  scores:
    [ {type: "extra credit", score: 100},
      {type: "homework", score: 75},
      {type: "test", score: 65}
    ]
}

db.students.updateOne({"_id": 1}, {$set: {"scores.2.score": 80}})
```

Would make the following change:

```
{_id: 1,
  scores:
    [ {type: "extra credit", score: 100},
      {type: "homework", score: 75},
      {type: "test", score: 80}
    ]
}
```

**$ set** and **$ push** can also be used to add new fields to a document, either deliberately or accidentally, if you make a typo, so LOOK OUT. (**$push** will make a new array and add the value that was pushed)

## Deleting Documents

From the website interface, it is once again totally obvious.

From the shell, **deleteOne()** and **deleteMany()** are what we want; they operate along the same lines as **updateOne()** and **updateMany()**. Note that the **official advice** is that **deleteOne()** should only be used in with a `{"_id": <objectID>}` query, because that is the only way that you can ensure that you are deleting the correct document.

```
db.<collection>.deleteMany({<field>:<value>})
db.inspections.deleteMany({"test": 1})
```

To delete an entire collection, we use the `drop` command.

```
db.<collection>.drop()
```

Removing all the collections from a database will remove the database as well.

## Advanced Querying

**Query operators** provide us with additional ways to locate data within the database.

### Comparison Operators

Comparison operators allow us to find data within a certain range.

- **$eq** = **EQ**ual to
- **$ne** != **N**ot **E**qual to
- **$gt** > **G**reater **T**han
- **$gte** >= **G**reater **T**han or **E**qual to
- **$lt** < **L**ess **T**han
- **$lte** <= **L**ess **T**han or **E**qual to

They all take the following syntax and can be chained with comma separation:

```
{<field>: {<operator>: <value>}, <field2>: {<operator>: <value>}, ... }
```

By chaining operators we can carry out more complex queries:

```
db.trips.find({"tripduration": {"$lte": 70}}) // returns all trips with a duration of 70 seconds or less
db.trips.find({"tripduration": {"$lte": 70}, "usertype": {"$ne": "subscriber"}}) // returns all trips with the duration and where the user was NOT a subscriber
```

**$eq** is the default operator, if no other is specified, which is how we've gotten away with all of those `.find({"\_id": 1})

It can, of course, be chained:

```
db.trips.find({"tripduration": {"$lte": 70}, "usertype": "subscriber"})
```

### Logic Operators

- **$and**: returns documents that match **all** of the specified query clauses
- **$or**: returns documents that **at least one** of the query clauses
- **$nor**: returns documents that **fail to match** both given clauses
- **$not**: **negates** the query requirements; returns all documents that **do not match them**

**$ and**, **$ or** and **$ nor** have a similar snytax: the value of the operator is given as an array that contains the objects that the operator will operate on.

```
{operator: [{statement1}, {statement2}...]}
db.zips.find({$and: [{"pop": {"$gte": 1000}}, {"state": "TX"}]})
db.inspections.find({$nor: [{"result": "No Violation Issued"}, {"result": "Violation Issued"}, {"result": "Pass"}, {"result": "Fail"}]})
```

**$not** negates whatever is in front of it, so the array syntax is not necessary:

```
{$not: {statement}}
```

**$and** is the default query if none other is specified. You could, for example, rewrite the `db.zips.find()` query above as

```
db.zips.find({"pop": {"$gte": 1000}, "state": "TX})
```

We could also use the implied _and_ to write queries that cover a range of values:

```
db.students.find({"student_id": {"$gt": 25, "$lt": 100}})
```

When do you need to explicitly include _and_?
When you need to include the same operator more than once in a query. (For instance, if you are doing multiple **$or** queries.)

e.g.,

```
db.routes.find({"$and": [
  {"$or": [{"dst_airport": "KZN"}, {"src_airport": "KZN"}]},
  {"$or": [{"airplane": "CR2"}, {"airplane": "A81"}]}
  ]})
```

This query would tell us how many CR2 and A81 airplanes come through the airport with designation KZN.  
The query reads like this: Incoming **OR** Outgoing airport === KZN **AND** airplace type === CR2 **OR** A81.)

If you're using multiple different operators, the _and_ will be implied. E.g.,

```
db.inspections.find(
  { "$or": [ { "date": "Feb 20 2015" },
             { "date": "Feb 21 2015" } ],
    "sector": { "$ne": "Cigarette Retail Dealer - 127" }})
```

(This query is looking for documents where the date is either Feb 20 **OR** Feb 21, 2015 **AND** the sector is **NOT EQUAL TO** "Cigarette Retail Dealer ' 127.)

Here's another one I had to write as part of the practice exercies: How many companies in the `sample_training.companies` dataset were **either** founded in 2004

- **and** have either the "social" category_code _or_ "web" category_code

**or** were founded in the month of October

- **and** have either the "social" category_code _or_ "web" category_code?

So, first checked a single document to ensure I was clear on the syntax and my god they are HUGE.
category_code: STRING
founded_year: NUMBER
founded_month: NUMBER

So here is an instance where I have to use the explicit **$ and** because we are dealing with two **$or**s:

```
db.companies.countDocuments({"$and": [{"$or": [{"founded_year": 2004}, {"founded_month": 10}]}, {"$or": [{"category_code": "social"}, {"category_code": "web"}]}]})
```

Nailed it.

### Expressive Query Operator: $expr

**$expr** allows the use of aggregation expressions, variables and conditional statements within the query language

```
{$expr: {<expression>}}
```

Using this, we can compare fields within the same document to each other.
For instance, if we were looking at `sample_training.trips` and we wanted to see how many users returned the bike to the same location from which they rented it, $expr would allow us to compare the two fields without specifying what they should equal on their own.

```
db.trips.countDocuments({$expr: {"$eq": ["$end station id", "$start station id"]}})
```

This is checking to see if the values of the two fields are equal. The "$" indicates that the field value should be evaluated.  
Note that the values to be compared are contained in an array.
We can also apply multiple operations:

```
db.trips.countDocuments({"$expr": {"$and": [
  {"$gt": ["$tripduration", 1200]},
  {"$eq":["$end station id", "$start station id"]}
  ]}})
```

This is looking for documents in which the value of _tripduration_ is **greater than** _1200_ **and** the _end station id_ and *start station id*s are **equal**

The syntax of this is a little different, as it is using the **aggregation** syntax.

In previous examples, we have seen comparison operators written thusly:

```
{<field>: {<operator>: <value>}}
{"tripduration": {"$gt": 1200}}
```

**Aggregation** syntax is as follows:

```
{<operator>: {<field>, <value>}}

{"$gt": ["$tripduration", 1200]}

db.companies.countDocuments({"$expr": {"$eq": ["$permalink", "$twitter_username"]}})
```

### Querying Arrays

#### $all

You can run into a problem when querying an array, in that if you are looking for a list of items in an array, you will only get a positive result when the document contains the specified elements in the specified order. If you don't care about the order, you can use `$all`, which will return all documents that contain at least the specified elements.

e.g.,

```
db.listingsAndReviews.find({"amenities": {"$all": ["Shampoo", "Heating"]}})
```

Would return documents in which the "amenities" array included both "Shampoo" and "Heating."

#### $size

You can use `$size` to query by array length.

e.g.,

```
db.listingsAndReviews.countDocuments({"amenities": {"$size": 20}})
```

Would return the number of documents in which the "amenities" field contained exactly 20 entries.

You can, of course, chain these parameters (and, as usual, `$and` is implied)

```
db.listingsAndReviews.find({"amenities": {"$size": 10, "$all": ["Shampoo", "Heating"]}})
```

Here are a couple of queries I wrote to satisfy the end-of-lesson exercise, to find out the name of the listing in `sample_airbnb.listingsAndReviews` that accomodates more than 6 people and has exactly 50 reviews:

```
db.listingsAndReviews.find({"accomodates": {"$gt": 6}, "reviews": {"$size": 50}})
db.listingsAndReviews.find({"accomodates": {"$gt": 6}, "number_of_reviews": 50})
```

And another that returns the number of properties of type "House" than include a changing table as one of the amenities:

```
db.listingsAndReviews.countDocuments({"property_type": "House", "amenities": {"$all": ["Changing table"]}})
```

### Projections

We can use a projection to limit the information that is returned by a query. This is essentially just another object that is passed as an argument following the search parameters:

e.g.,

```
db.<collection>.find({ <query> }, { <projection> })
.find({"amenities": {"$size": 20, "$all": ["Internet", "Wifi", "Kitchen", "Essentials"]}}, {"price": 1, "address":1, "_id": 0})
```

Assigning the field a value of 1 will display it, while a value of 0 will hide it. Use only 1s or 0s, the exception being the `_id` field, which can be explicitly excluded while other fields are included.

### Querying Array Fields with $elemMatch

**$elemMatch** is an array operator that we can use either in the query or in the projection; it will match documents that contain an array field with at least one element that matches the specified query criteria. Or, if used as part of the projection, will project only the array elements with at least one element that matches the criteria.

e.g.,

```
db.collection.find({ <field>: {"$elemMatch": { <field>: <value> }}})
db.grades.find({"scores": {"$elemMatch": {"type": "extra credit"}}})
db.grades.find({"class_id": 431}, {"scores": {"$elemMatch": {"score": {"$gt": 85}}}})
```

The first example uses **$elemMatch** as part of the query, and will return documents in which the "scores" array contains an object with the type "extra credit."

The second example is a little more complicated. Here **$elemMatch** is used as part of the projection, and will return a list of documents with the class_id 431. However, we're using a projection, the only elements that will be displayed are the \_id value (which is "on" by default), and elements of the "scores" array in which the value of "score" is greater than 85. (And this really does only return those precise elements: the rest of the array will not be returned.)

The **$elemMatch** challenge involved writing a query to determine how many companies in sample_training.companies had offices in Seattle. Here's the answer (note that we're using $elemMatch in the query):

```
db.companies.countDocuments({"offices": {"$elemMatch": {"city": "Seattle"}}})
```

The next challenge was to use **$elemMatch** in the projection. Specificially, to pick the query that would return only the names of companies from the `sample_training.companies` collection that had exactly 8 funding rounds:

```
db.companies.find({"funding_rounds": {"$size": 8}}, {"_id": 0, "name": 1})
```

(Looking at a sample document, we can see that "funding_rounds" field contains an array with one element for each round. So we would be looking at its **$size**, which is the number of elements it contains.)

### Querying Array Elements in Sub-Documents: Dot Notation and $regex

I feel like this has already come up before, but in case it hasn't, note that you can access sub-document values using dot notation. For example, taking a value from of the documents in the `sample_training.trips` collection:

```
'start station location': { type: 'Point', coordinates: [ -73.993915, 40.746647 ] },
```

We can access the value of the "type" field with `db.trips.findOne({"start station location.type": "Point"})`
You can continue to chain dot notation to go as deeply into the hierarchy as you need. For example, taking the value of the "relationships" field from a random document `sample_training.companies`, where the field is an array of objects, structured thusly:

```
    { is_past: true,
       title: 'Director, Recruiting',
       person:
        { first_name: 'Oliver',
          last_name: 'Ryan',
          permalink: 'oliver-ryan' } }
```

To access, for instance, the last name of an individual at index _i_ in the array, you would use dot notation: `db.companies.findOne({"relationships.i.person.last_name": "Ryan"})`

If we wanted to retrieve the names of companies in the database whose current CEOs are named Mark, we could run the following query:

```
db.companies.find({"relationships.0.person.first_name": "Mark", "relationships.0.title": {"$regex": "CEO"}}, {"name": 1, "_id": 0})
```

In this case, we're using the **$regex** operator to match the pattern string.

How about a query for the names of all companies that had a senior executive named Mark listed in the relationships array but whom no longer work at said companies? For this task, we can go back to **$elemMatch** to search through the subdocuments in the "relationships" array to match those queries:

```
db.companies.find({"relationships": {$elemMatch: {"is_past": true, "person.first_name": "Mark}}}, {"name": 1, "_id": 0})
```

For the next exercise, I needed to write a query that would return the number of trips from the `sample_training.trips` collection which started at stations to the west of the -74 longitude coordinate.

```
db.trips.countDocuments({"start station location.coordinates.0": {"$lt": -74}})
```

Second task: how many inspections from the `sample_training.inspections` collection were conducted in the city of NEW YORK?

```
db.inspections.countDocuments({"address.city": "NEW YORK"})
```

Finally, what query would return the names and addresses of all listings from `sample_airbnb.listingsAndReviews` where the first `amenity` in the list is "Internet?"

```
db.listingsAndReviews.find({"amenities.0": "Internet"}, {"name": 1, "address": 1, "_id":0})
```
