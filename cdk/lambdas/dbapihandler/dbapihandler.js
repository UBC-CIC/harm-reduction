const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const headers = {
  "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE,PUT,POST,GET,OPTIONS"
}

exports.handler = async (event) => {
  const { httpMethod, path, body } = event;
  const resource = event.requestContext.resourcePath;
  const tableName = event.queryStringParameters['tableName']


  if (httpMethod === 'POST') {
    return await createItem(tableName, JSON.parse(body));
  } else if (httpMethod === 'PUT') {
    return await updateItem(tableName, JSON.parse(body));
  } else if (httpMethod === 'GET') {
      if (resource === '/users') {
        return await getUser(tableName, event.queryStringParameters['sample-id']);
      }
      else if (resource === '/samples') {
        const sampleId = event.queryStringParameters['sample-id'];
        const query = event.queryStringParameters['query'];
        
        if (query === 'getCensoredUser'){
          return await getCensoredUser(tableName, sampleId)
        }
        
        else if (query === 'getSample') {
          return await getSample(tableName, sampleId);
        }
        else if (query === 'getContentOptions'){
          return await getContentOptions(tableName);
        }
        else if (query === 'getAllPublicSampleData') {
          return await getAllPublicSampleData(tableName);
        }
      }
      else if (resource === '/admin') {
          return await getAllSamples(tableName);
      }
  } else if (httpMethod === 'DELETE') {
    return await deleteItem(tableName, event.queryStringParameters['sample-id']);
  } else if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: headers,
      body: JSON.stringify({ message: 'No content' }),
    }
  }

  return {
    statusCode: 400,
    headers: headers,
    body: JSON.stringify({ message: 'Invalid request' }),
  };
};

async function createItem(tableName, item) {
  const params = {
    TableName: tableName,
    Item: item,
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      headers: headers,
      body: JSON.stringify({ message: 'Item created successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to create item', error }),
    };
  }
}

async function updateItem(tableName, item) {
  const params = {
    TableName: tableName,
    Item: item,
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: 'Item updated successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to update item', error }),
    };
  }
}

async function getUser(tableName, sampleId) {
  const params = {
    TableName: tableName,
    Key: { 'sample-id': sampleId },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(Item),
      };
    } else {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({ message: 'Item not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers, 
      body: JSON.stringify({ message: 'Failed to retrieve item', error }),
    };
  }
}

async function getCensoredUser(tableName, sampleId) {
  const params = {
    TableName: tableName,
    ProjectionExpression: 'censoredContact',
    Key: { 'sample-id': sampleId },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(Item),
      };
    } else {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({ message: 'Item not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers, 
      body: JSON.stringify({ message: 'Failed to retrieve item', error }),
    };
  }
}

async function getSample(tableName, sampleId) {
  const params = {
    TableName: tableName,
    Key: { 'sample-id': sampleId },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(Item),
      };
    } else {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({ message: 'Item not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to retrieve item', error }),
    };
  }
}

async function getAllSamples(tableName) {
  const params = {
    TableName: tableName,
  };

  try {
    const { Items } = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to retrieve items', error }),
    };
  }
}

async function getAllPublicSampleData(tableName) {
  const columns = ['date-received', 'expected-content', 'test-results', 'status'];
  const status = 'Complete';

  const columnsModified = columns.map(column => {
    return `#${column.replace(/-/g, '_')}`;
  });

  const expressionAttributeNames = {};
  for (let i = 0; i < columns.length; i++) {
    expressionAttributeNames[columnsModified[i]] = columns[i];
  }
  
  const params = {
    TableName: tableName,
    ProjectionExpression: columnsModified.join(', '),
    ExpressionAttributeNames: expressionAttributeNames,
    FilterExpression: '#status = :status', // Use an alias for "status"
    ExpressionAttributeValues: {
      ':status': status,
    },
  };

  try {
    const { Items } = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to retrieve items', error }),
    };
  }
}

async function getContentOptions(tableName) {
  const expressionAttributeNames = {
    '#expected_content': 'expected-content',
  };
  
  const params = {
    TableName: tableName,
    ProjectionExpression: '#expected_content',
    ExpressionAttributeNames: expressionAttributeNames,
  };

  try {
    const { Items } = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to retrieve items', error }),
    };
  }
}

async function deleteItem(tableName, sampleId) {
  const params = {
    TableName: tableName,
    Key: { 'sample-id': sampleId },
  };

  try {
    await dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: 'Item deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to delete item', error }),
    };
  }
}
