const {faker} = require('@faker-js/faker');
const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://saitarun:8e5i4A4HTabvtj5q@cluster0.ralyv0x.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

async function generateAndInsertFakeData() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('players');
    const collection = db.collection('cricket');

    const records = [];
    const numRecords = 1000;

    for (let i = 0; i < numRecords; i++) {
      const player = {
        _id: new ObjectId(),
        name: faker.person.fullName(),
        dateOfBirth: faker.number.bigInt({ min: 1900, max: 2023 }),
        nationality: faker.location.country(),
        battingStyle: faker.helpers.arrayElement(['Right-hand bat', 'Left-hand bat']),
        bowlingStyle: faker.helpers.arrayElement(['Right-arm fast', 'Left-arm fast']),
      };

      records.push(player);
    }

    await collection.insertMany(records);
    console.log(`Inserted ${numRecords} records into the collection`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

generateAndInsertFakeData();
