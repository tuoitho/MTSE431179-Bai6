// src/config/elasticsearch.js
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
});

client.ping()
  .then(() => console.log('Connected to Elasticsearch'))
  .catch(error => console.error('Elasticsearch connection error:', error));

module.exports = client;